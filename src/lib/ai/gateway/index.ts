import { classifyIntent, UserIntent } from './classifier';
import { PromptManager } from './prompt';
import { MemoryManager } from './memory';
import { ToolSelector } from './tools';
import { KnowledgeRouter } from './knowledge';
import { CitationManager } from './citation';
import { ResponseComposer } from './composer';
import { CacheLayer } from './cache';
import { GatewayLogger } from './logging';
import { streamTextWithFallback } from '../fallback';
import { getRoutingSequence } from '../router';
import { ProviderName } from '../providers';

export interface GatewayRequest {
  sessionId: string;
  messages: any[];
  documentId?: string;
  variables?: Record<string, any>;
  preferredModel?: string;
  bypassCache?: boolean;
}

export interface GatewayResult {
  text: string;
  intent: UserIntent;
  sources: string[];
  durationMs: number;
  tokens: { prompt: number; completion: number; total: number };
  cacheHit: boolean;
  provider: string;
  modelName: string;
}

export class GatewayOrchestrator {
  /**
   * Orchestrates the entire request pipeline.
   * Receives request -> Checks Cache -> Classifies Intent -> Fetches Context ->
   * Invokes Fallback LLM sequence -> Formats Citations -> Logs performance -> Returns.
   */
  public static async execute(req: GatewayRequest): Promise<GatewayResult> {
    const startTime = Date.now();
    const { sessionId, messages, documentId, variables = {}, preferredModel, bypassCache = false } = req;
    
    // 1. Fetch User Query
    const lastMsg = messages[messages.length - 1];
    let query = '';
    if (lastMsg) {
      query = typeof lastMsg.content === 'string' 
        ? lastMsg.content 
        : lastMsg.content?.map?.((p: any) => p.text || '').join(' ') || '';
    }

    // 2. Cache Lookup (Response Cache)
    const cacheKey = CacheLayer.generateKey('response', { query, documentId, intent: 'auto' });
    if (!bypassCache) {
      const cachedResponse = await CacheLayer.get(cacheKey);
      if (cachedResponse) {
        const duration = Date.now() - startTime;
        return {
          text: cachedResponse.text,
          intent: cachedResponse.intent,
          sources: cachedResponse.sources || ['Response Cache'],
          durationMs: duration,
          tokens: { prompt: 0, completion: 0, total: 0 },
          cacheHit: true,
          provider: 'cache',
          modelName: 'cached-response'
        };
      }
    }

    // 3. Classify User Intent
    const intent = await classifyIntent(messages);

    // 4. Load Prompt Template & Interpolate Variables
    const promptTemplate = await PromptManager.getTemplate(intent);
    const systemPrompt = PromptManager.interpolate(promptTemplate.template, variables);

    // 5. Fetch Session & Context Memory
    const sessionMemory = await MemoryManager.getSession(sessionId);

    // 6. Query Knowledge Layer (RAG -> CAD -> Web)
    const citationManager = new CitationManager();
    const { context: knowledgeContext, sources: knowledgeSources } = await KnowledgeRouter.queryKnowledge(
      query,
      intent,
      sessionId,
      citationManager,
      documentId
    );

    // 7. Assemble final System Instructions with Context
    const systemInstruction = knowledgeContext
      ? `${systemPrompt}\n\n[TÀI LIỆU NỘI BỘ THAM KHẢO]\n${knowledgeContext}`
      : systemPrompt;

    // 8. Fetch Intent-Specific Tools
    const tools = ToolSelector.getToolsForIntent(intent);

    // 9. Execute LLM Fallback Sequence (Gemini -> OpenRouter -> DeepSeek -> Grok)
    const task = intent === 'house_design' || intent === 'cad_analysis' ? 'coding' : 'general';
    let sequence: ProviderName[] = [];
    
    if (preferredModel && preferredModel !== 'auto') {
      const primaryProvider = preferredModel.split(':')[0] as ProviderName;
      sequence = [primaryProvider, ...getRoutingSequence(task).filter(p => p !== primaryProvider)];
    } else {
      sequence = getRoutingSequence(task);
    }

    let resultText = '';
    let providerName = 'gemini';
    let activeModelName = 'gemini-2.5-flash';
    let tokensUsed = { prompt: 0, completion: 0, total: 0 };
    let errorOccurred: string | undefined;

    try {
      const llmResult = await streamTextWithFallback({
        sequence,
        task,
        messages,
        system: systemInstruction,
        temperature: 0.7,
        preferredModel,
        tools,
        maxSteps: 5,
      });

      providerName = llmResult.provider;
      activeModelName = llmResult.modelName;

      // Consume the generator/stream to get full output
      // Since E2E stream is expected, we compile it for simple responses,
      // API routes can consume text stream directly.
      const textChunks = [];
      const reader = llmResult.result.textStream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textChunks.push(value);
      }
      resultText = textChunks.join('');

      // Approximate token calculation if not returned directly by AI SDK
      // standard averages: 1 token ~= 4 characters
      const pTokens = Math.round((systemInstruction.length + query.length) / 4);
      const cTokens = Math.round(resultText.length / 4);
      tokensUsed = {
        prompt: pTokens,
        completion: cTokens,
        total: pTokens + cTokens
      };

    } catch (err: any) {
      errorOccurred = err.message || String(err);
      console.error('[GatewayOrchestrator] LLM Sequence execution failed:', err);
      // Fallback message
      resultText = "Hiện tại toàn bộ kênh kết nối AI của chúng tôi đang bận. Quý khách vui lòng thử lại sau vài giây hoặc liên hệ Mr. Thắng để được trợ giúp trực tiếp.";
    }

    // 10. Format Citations & Compose Response
    const citationsText = citationManager.formatCitations();
    const finalResponseText = ResponseComposer.composeResponse(resultText, citationsText, intent);

    const durationMs = Date.now() - startTime;

    // 11. Write Transaction Logs & Cache
    if (!errorOccurred) {
      const resultPayload = {
        text: finalResponseText,
        intent,
        sources: knowledgeSources
      };
      await CacheLayer.set(cacheKey, 'response', resultPayload, 1800); // cache for 30 mins
    }

    // Log the transaction
    await GatewayLogger.log({
      sessionId,
      intent,
      query,
      model: activeModelName,
      provider: providerName,
      durationMs,
      tokens: tokensUsed,
      toolsUsed: Object.keys(tools),
      citations: citationManager.getSources().map(s => s.fileName),
      cacheHit: false,
      error: errorOccurred
    });

    // Update Session Memory
    await MemoryManager.saveSession(sessionId, {
      tokenUsage: tokensUsed,
      lastState: intent
    });

    return {
      text: finalResponseText,
      intent,
      sources: knowledgeSources,
      durationMs,
      tokens: tokensUsed,
      cacheHit: false,
      provider: providerName,
      modelName: activeModelName
    };
  }
}

'use client';

import { useState, useRef, useEffect } from 'react';

export interface ProviderHealthStatus {
  status: 'online' | 'offline' | 'cooldown';
  cooldownUntil: number | null;
  latency: number[];
  requestCount: number;
  errorCount: number;
  fallbackCount: number;
  lastErrorMsg?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: Date;
}

// Simple client-side cache
const CLIENT_QUERY_CACHE = new Map<string, string>();
const CHAT_REQUEST_TIMEOUT_MS = 8_000;

function getInstantFallbackReply(prompt: string): string {
  const text = prompt.toLowerCase();

  if (text.includes('low-e') || text.includes('cản nhiệt') || text.includes('kính hộp')) {
    return 'Kính Low-E giúp hạn chế bức xạ nhiệt, giảm tải điều hòa và vẫn giữ ánh sáng tự nhiên. Với khu vực nhiều nắng, anh/chị nên dùng kính hộp có lớp Low-E. Để báo giá chính xác, vui lòng cho tôi kích thước rộng × cao, số lượng cửa và địa chỉ công trình.';
  }

  if (text.includes('ea60') || text.includes('cách nhiệt')) {
    return 'Hệ nhôm EA60i phù hợp khi cần cách nhiệt và cách âm tốt. Để lên báo giá, vui lòng gửi kích thước rộng × cao, kiểu cửa (mở quay, mở trượt hoặc vách kính), loại kính và số lượng.';
  }

  if (text.includes('ea55') || text.includes('báo giá')) {
    return 'Tôi có thể hỗ trợ báo giá sơ bộ. Anh/chị vui lòng cho biết hệ cửa mong muốn, kích thước rộng × cao, kiểu mở, loại kính và số lượng để tôi tư vấn chính xác hơn.';
  }

  if (text.includes('kommerling') || text.includes('upvc')) {
    return 'Cửa uPVC Kommerling là lựa chọn tốt cho nhu cầu cách âm, cách nhiệt và vận hành êm. Vui lòng gửi kích thước, kiểu cửa và số lượng để nhận tư vấn phù hợp.';
  }

  return 'Cảm ơn anh/chị đã liên hệ Eurowindow. Tôi có thể tư vấn cửa nhôm EA55, EA60i, cửa uPVC Kommerling và kính Low-E. Anh/chị đang quan tâm sản phẩm nào và kích thước dự kiến bao nhiêu?';
}

export function useAiChat(options: {
  selectedModel: string;
  documentId?: string | null;
  onResponse?: (response: Response) => void;
}) {
  const { selectedModel, documentId } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [healthData, setHealthData] = useState<Record<string, ProviderHealthStatus>>({});
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [activeModelInfo, setActiveModelInfo] = useState<{
    provider: string;
    model: string;
    fallbackTriggered: boolean;
  } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchHealthStats = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetch('/api/chat/health');
      if (res.ok) {
        const json = await res.json();
        if (json.success) setHealthData(json.data);
      }
    } catch (err) {
      // silently ignore health poll errors
    } finally {
      setIsHealthLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStats();
    const interval = setInterval(fetchHealthStats, 20000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (textToSend?: string, data?: { documentId?: string }) => {
    const prompt = (textToSend !== undefined ? textToSend : input).trim();
    if (!prompt || isLoading) return;

    // Check cache
    const cached = CLIENT_QUERY_CACHE.get(prompt.toLowerCase());
    if (cached && !data?.documentId) {
      const userId = `cache-user-${Date.now()}`;
      const assistantId = `cache-assistant-${Date.now()}`;
      setMessages(prev => [
        ...prev,
        { id: userId, role: 'user', text: prompt, createdAt: new Date() },
        { id: assistantId, role: 'assistant', text: cached, createdAt: new Date() },
      ]);
      setInput('');
      setActiveModelInfo({ provider: 'client-cache', model: 'Local Cache', fallbackTriggered: false });
      return;
    }

    // Add user message optimistically
    const userId = `user-${Date.now()}`;
    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { id: userId, role: 'user', text: prompt, createdAt: new Date() }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Build conversation history for API
    const apiMessages = messages.map(m => ({
      role: m.role,
      parts: [{ type: 'text', text: m.text }],
    }));
    apiMessages.push({ role: 'user', parts: [{ type: 'text', text: prompt }] });

    abortControllerRef.current = new AbortController();
    let requestTimedOut = false;
    const timeoutId = setTimeout(() => {
      requestTimedOut = true;
      abortControllerRef.current?.abort();
    }, CHAT_REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel,
          ...(documentId || data?.documentId ? { documentId: documentId || data?.documentId } : {}),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      // Read provider info from headers
      const provider = res.headers.get('X-AI-Provider') || '';
      const modelName = res.headers.get('X-AI-Model') || '';
      const fallbackTriggered = res.headers.get('X-AI-Fallback-Triggered') === 'true';
      if (provider || modelName) {
        setActiveModelInfo({ provider, model: modelName, fallbackTriggered });
      }

      // Add empty assistant message to update incrementally
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '', createdAt: new Date() }]);

      // Stream the response
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const dataStr = line.slice(5).trim();
          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const chunk = JSON.parse(dataStr);

            // Handle different chunk types from AI SDK v7 UIMessageStream
            if (chunk.type === 'text-delta') {
              const text = chunk.delta ?? chunk.textDelta ?? '';
              if (text) {
                fullText += text;
                setMessages(prev =>
                  prev.map(m => m.id === assistantId ? { ...m, text: fullText } : m)
                );
              }
            } else if (chunk.type === 'text-start') {
              // text stream starting
            } else if (chunk.type === 'text-end' || chunk.type === 'finish' || chunk.type === 'finish-step') {
              // done
            }
          } catch {
            // skip unparseable line
          }
        }
      }

      // Cache successful response
      if (fullText) {
        CLIENT_QUERY_CACHE.set(prompt.toLowerCase(), fullText);
      } else {
        // Some upstream providers end a stream without emitting text while
        // still returning HTTP 200. Never leave the customer with a blank bot
        // message in that case.
        const fallbackText = getInstantFallbackReply(prompt);
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, text: fallbackText } : m)
        );
        CLIENT_QUERY_CACHE.set(prompt.toLowerCase(), fallbackText);
        setActiveModelInfo({
          provider: 'instant-fallback',
          model: 'empty-ai-response',
          fallbackTriggered: true,
        });
      }

      fetchHealthStats();
    } catch (err: any) {
      console.error('[useAiChat] Stream error:', err);
      const fallbackText = getInstantFallbackReply(prompt);
      setActiveModelInfo({
        provider: 'instant-fallback',
        model: requestTimedOut ? '8-second-timeout' : 'api-unavailable',
        fallbackTriggered: true,
      });
      setMessages(prev => {
        const hasAssistantMessage = prev.some(m => m.id === assistantId);
        if (!hasAssistantMessage) {
          return [...prev, { id: assistantId, role: 'assistant', text: fallbackText, createdAt: new Date() }];
        }
        return prev.map(m => m.id === assistantId && !m.text ? { ...m, text: fallbackText } : m);
      });
      CLIENT_QUERY_CACHE.set(prompt.toLowerCase(), fallbackText);
      setError(null);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    // Find last user message and resend
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    // Remove last assistant message if empty/error
    setMessages(prev => {
      const lastIdx = prev.length - 1;
      if (prev[lastIdx]?.role === 'assistant') return prev.slice(0, lastIdx);
      return prev;
    });
    sendMessage(lastUserMsg.text);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleRetry,
    error,
    activeModelInfo,
    setActiveModelInfo,
    healthData,
    isHealthLoading,
    refreshHealth: fetchHealthStats,
  };
}

import { UserIntent } from './orchestrator';

import fs from 'fs';
import path from 'path';

export interface ObservabilityLog {
  sessionId: string;
  user_question: string;
  intent: UserIntent;
  selected_route: string;
  retrieval_hits: number;
  prompt_sent_to_llm: string;
  llm_raw_response: string;
  fallback_used: boolean;
  fallback_reason?: string;
  response_source: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  model: string;
  provider: string;
}

export async function logTransaction(log: ObservabilityLog) {
  try {
    // Console log for immediate visibility
    console.log('[Debug Chat Pipeline]', JSON.stringify(log, null, 2));

    // Write to a physical log file
    const logDir = path.join(process.cwd(), 'sandbox', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, 'debug_chat_pipeline.json');
    
    let logs = [];
    if (fs.existsSync(logFile)) {
      const existing = fs.readFileSync(logFile, 'utf8');
      try { logs = JSON.parse(existing); } catch (e) {}
    }
    
    logs.push({ timestamp: new Date().toISOString(), ...log });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error('Failed to log observability metrics', err);
  }
}

export async function validateResponse(text: string, intent: UserIntent): Promise<void> {
  // Simple Async Response Validator and Context Guard.
  // Because we stream, this is an asynchronous check for Observability purposes.
  // If we detect hallucination, we log it for future prompt tuning.
  
  const lowerText = text.toLowerCase();
  let hallucinationFlag = false;
  let reason = '';

  if (intent === 'quote') {
    if (!lowerText.includes('giá') && !lowerText.includes('đồng') && !lowerText.includes('vnđ')) {
      hallucinationFlag = true;
      reason = 'Intent Quote but no pricing unit found in response.';
    }
  }

  if (intent === 'showroom') {
    if (!lowerText.includes('địa chỉ') && !lowerText.includes('showroom')) {
      hallucinationFlag = true;
      reason = 'Intent Showroom but no address found in response.';
    }
  }

  if (hallucinationFlag) {
    console.warn(`[Context Guard Warning] Potential Hallucination Detected: ${reason}`);
    // Here we could update the DB to flag this session for manual review.
  }
}

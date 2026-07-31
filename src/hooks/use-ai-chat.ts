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

            // Handle different chunk types from AI SDK v4 UIMessageStream
            if (chunk.type === 'text-delta' && chunk.delta) {
              fullText += chunk.delta;
              setMessages(prev =>
                prev.map(m => m.id === assistantId ? { ...m, text: fullText } : m)
              );
            } else if (chunk.type === 'text-start') {
              // text stream starting
            } else if (chunk.type === 'finish' || chunk.type === 'finish-step') {
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
      }

      fetchHealthStats();
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('[useAiChat] Stream error:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
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

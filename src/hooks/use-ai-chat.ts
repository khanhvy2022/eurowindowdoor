import { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { UIMessage } from 'ai';

// Client-side simple query cache to prevent repeat requests for identical queries
const CLIENT_QUERY_CACHE = new Map<string, string>();

export interface ProviderHealthStatus {
  status: 'online' | 'offline' | 'cooldown';
  cooldownUntil: number | null;
  latency: number[];
  requestCount: number;
  errorCount: number;
  fallbackCount: number;
  lastErrorMsg?: string;
}

export function useAiChat(options: {
  selectedModel: string;
  documentId?: string | null;
  onResponse?: (response: Response) => void;
}) {
  const { selectedModel, documentId, onResponse } = options;
  
  const [healthData, setHealthData] = useState<Record<string, ProviderHealthStatus>>({});
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [input, setInput] = useState('');
  const [activeModelInfo, setActiveModelInfo] = useState<{
    provider: string;
    model: string;
    fallbackTriggered: boolean;
  } | null>(null);

  // Track the last user prompt submitted for caching
  const lastPromptRef = useRef<string>('');
  // Prevent double submissions
  const submissionLockRef = useRef<boolean>(false);
  // Stable ref for onResponse to avoid transport recreation
  const onResponseRef = useRef(onResponse);
  onResponseRef.current = onResponse;
  const setActiveModelInfoRef = useRef(setActiveModelInfo);
  setActiveModelInfoRef.current = setActiveModelInfo;
  const fetchHealthStatsRef = useRef<() => void>(() => {});

  // Fetch health data function
  const fetchHealthStats = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetch('/api/chat/health');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setHealthData(json.data);
        }
      }
    } catch (err) {
      console.error('Error fetching AI health status:', err);
    } finally {
      setIsHealthLoading(false);
    }
  };

  fetchHealthStatsRef.current = fetchHealthStats;

  // Poll health status every 20 seconds
  useEffect(() => {
    fetchHealthStats();
    const interval = setInterval(fetchHealthStats, 20000);
    return () => clearInterval(interval);
  }, []);

  // Create transport — memoize so it's stable across re-renders
  // Only recreate when selectedModel or documentId changes
  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: '/api/chat',
      body: {
        model: selectedModel,
        ...(documentId ? { documentId } : {}),
      },
      // Intercept fetch to capture response headers for provider telemetry
      fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
        const response = await fetch(url, init);
        
        const provider = response.headers.get('X-AI-Provider') || '';
        const modelName = response.headers.get('X-AI-Model') || '';
        const fallbackTriggered = response.headers.get('X-AI-Fallback-Triggered') === 'true';
        
        if (provider || modelName) {
          setActiveModelInfoRef.current({ provider, model: modelName, fallbackTriggered });
        }
        
        if (onResponseRef.current) {
          onResponseRef.current(response.clone());
        }
        
        fetchHealthStatsRef.current();
        
        return response;
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel, documentId]);

  const chat = useChat({
    transport,
    onFinish: (event: any) => {
      submissionLockRef.current = false;
      
      // AI SDK v4: onFinish receives { message, messages, isAbort, isDisconnect, isError, finishReason }
      const message = event?.message ?? event;
      
      // Cache the response for identical future queries
      const cleanPrompt = lastPromptRef.current.trim().toLowerCase();
      const msgText = message?.parts
        ? message.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text || '').join('')
        : (typeof message?.content === 'string' ? message.content : '');
      if (cleanPrompt && msgText) {
        CLIENT_QUERY_CACHE.set(cleanPrompt, msgText);
      }
    },
    onError: () => {
      submissionLockRef.current = false;
      fetchHealthStats();
    }
  } as any);

  const { messages, setMessages, status } = chat;
  // In AI SDK v4: status is 'submitted' | 'streaming' | 'ready' | 'error'
  // 'submitted' and 'streaming' are the "loading" states
  const isLoading = status === 'submitted' || status === 'streaming';

  // Custom submit handler with debounce, cache, and AI SDK v4 sendMessage
  const sendMessage = async (
    textToSend?: string,
    data?: { documentId?: string }
  ) => {
    const prompt = textToSend !== undefined ? textToSend : input;
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    // 1. Debounce: block if currently loading or locked
    if (isLoading || submissionLockRef.current) {
      console.warn('Chat is currently loading. Ignoring duplicate submission.');
      return;
    }

    submissionLockRef.current = true;
    lastPromptRef.current = cleanPrompt;

    // 2. Client cache hit
    const cachedResponse = CLIENT_QUERY_CACHE.get(cleanPrompt.toLowerCase());
    if (cachedResponse && !data?.documentId) {
      console.log('[AI Cache] Returning cached response for:', cleanPrompt);
      
      setTimeout(() => {
        const userMsg: any = {
          id: `cache-user-${Date.now()}`,
          role: 'user',
          parts: [{ type: 'text', text: cleanPrompt }],
          createdAt: new Date(),
        };
        const assistantMsg: any = {
          id: `cache-assistant-${Date.now()}`,
          role: 'assistant',
          parts: [{ type: 'text', text: cachedResponse }],
          createdAt: new Date(),
        };

        setMessages((prev: any[]) => [...prev, userMsg, assistantMsg]);
        setActiveModelInfo({
          provider: 'client-cache',
          model: 'Local Cache Memory',
          fallbackTriggered: false,
        });
        setInput('');
        submissionLockRef.current = false;
      }, 150);
      return;
    }

    // 3. Real streaming request via AI SDK v4 sendMessage
    try {
      setInput('');
      // AI SDK v4 sendMessage signature: ({ text: string }) | CreateUIMessage
      await chat.sendMessage({ text: cleanPrompt });
    } catch (err) {
      console.error('[useAiChat] sendMessage failed:', err);
      submissionLockRef.current = false;
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    submissionLockRef.current = true;
    if (chat.regenerate) {
      chat.regenerate();
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleRetry,
    error: chat.error,
    activeModelInfo,
    setActiveModelInfo,
    healthData,
    isHealthLoading,
    refreshHealth: fetchHealthStats,
  };
}

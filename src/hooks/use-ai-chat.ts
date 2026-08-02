import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';

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
  const [activeModelInfo, setActiveModelInfo] = useState<{
    provider: string;
    model: string;
    fallbackTriggered: boolean;
  } | null>(null);

  // Use ref to track the last user prompt submitted, for caching purposes
  const lastPromptRef = useRef<string>('');
  // Prevent double submissions
  const submissionLockRef = useRef<boolean>(false);

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

  // Poll health status every 20 seconds
  useEffect(() => {
    fetchHealthStats();
    const interval = setInterval(fetchHealthStats, 20000);
    return () => clearInterval(interval);
  }, []);

  // Configure Vercel AI SDK useChat
  const chat = useChat({
    api: '/api/chat',
    body: {
      model: selectedModel,
      ...(documentId ? { documentId } : {}),
    },
    onResponse: (response: Response) => {
      const provider = response.headers.get('X-AI-Provider') || '';
      const modelName = response.headers.get('X-AI-Model') || '';
      const fallbackTriggered = response.headers.get('X-AI-Fallback-Triggered') === 'true';
      
      if (provider || modelName) {
        setActiveModelInfo({
          provider,
          model: modelName,
          fallbackTriggered,
        });
      }
      
      if (onResponse) {
        onResponse(response);
      }
      
      fetchHealthStats();
    },
    onFinish: (message: any) => {
      submissionLockRef.current = false;
      const cleanPrompt = lastPromptRef.current.trim().toLowerCase();
      if (cleanPrompt && message.content) {
        CLIENT_QUERY_CACHE.set(cleanPrompt, message.content);
      }
    },
    onError: (err: any) => {
      console.error('[useAiChat] Stream Error:', err);
      submissionLockRef.current = false;
      fetchHealthStats();
    }
  } as any) as any;

  const { messages, setMessages, append, sendMessage: sdkSendMessage, reload, status } = chat;
  const isLoading = status === 'submitted' || status === 'streaming';
  const [input, setInput] = useState('');

  // Custom submit handler supporting debounce and caching
  const sendMessage = async (
    textToSend?: string,
    data?: { documentId?: string }
  ) => {
    const prompt = textToSend !== undefined ? textToSend : input;
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    if (isLoading || submissionLockRef.current) {
      console.warn('Chat request is currently locked or loading. Ignoring duplicate click.');
      return;
    }

    submissionLockRef.current = true;
    lastPromptRef.current = cleanPrompt;

    const cachedResponse = CLIENT_QUERY_CACHE.get(cleanPrompt.toLowerCase());
    if (cachedResponse && !data?.documentId) {
      console.log('[AI Cache] Trả về câu trả lời đã lưu trong cache client.');
      
      setTimeout(() => {
        const userMsg: any = {
          id: `cache-user-${Date.now()}`,
          role: 'user',
          content: cleanPrompt,
          createdAt: new Date(),
        };
        const assistantMsg: any = {
          id: `cache-assistant-${Date.now()}`,
          role: 'assistant',
          content: cachedResponse,
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

    try {
      setInput('');
      if (append) {
        await append({
          role: 'user',
          content: cleanPrompt,
        });
      } else if (sdkSendMessage) {
        await sdkSendMessage({
          role: 'user',
          content: cleanPrompt,
        });
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      submissionLockRef.current = false;
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    submissionLockRef.current = true;
    if (reload) {
      reload();
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

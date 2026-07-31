import { useState, useEffect, useRef } from 'react';
import { useChat, UseChatOptions } from '@ai-sdk/react';
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
      
      // Update health stats after a query completes
      fetchHealthStats();
    },
    onFinish: (message: any) => {
      submissionLockRef.current = false;
      
      // Save query response to client cache if successful
      const cleanPrompt = lastPromptRef.current.trim().toLowerCase();
      if (cleanPrompt && message.content) {
        CLIENT_QUERY_CACHE.set(cleanPrompt, message.content);
      }
    },
    onError: () => {
      submissionLockRef.current = false;
      fetchHealthStats();
    }
  } as any) as any;

  const { messages, setMessages, isLoading } = chat;
  const appendFn = chat.append || chat.sendMessage;
  const reloadFn = chat.reload || chat.regenerate;

  // Custom submit handler supporting debounce and caching
  const sendMessage = async (
    textToSend?: string,
    data?: { documentId?: string }
  ) => {
    const prompt = textToSend !== undefined ? textToSend : input;
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    // 1. Debounce protection: block if loading or locked
    if (isLoading || submissionLockRef.current) {
      console.warn('Chat request is currently locked or loading. Ignoring duplicate click.');
      return;
    }

    // Lock submission
    submissionLockRef.current = true;
    lastPromptRef.current = cleanPrompt;

    // 2. Cache hit check: bypass network request if identical query exists
    const cachedResponse = CLIENT_QUERY_CACHE.get(cleanPrompt.toLowerCase());
    if (cachedResponse && !data?.documentId) {
      console.log('[AI Cache] Trả về câu trả lời đã lưu trong cache client.');
      
      // Simulate typing/connection delay of 150ms for natural feel
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

    // 3. Cache miss: trigger regular streaming call
    try {
      setInput('');
      if (chat.append) {
        await chat.append({
          role: 'user',
          content: cleanPrompt,
        });
      } else if (chat.sendMessage) {
        // @ts-ignore
        await chat.sendMessage({ text: cleanPrompt });
      } else if (appendFn) {
        // Fallback catch-all
        await appendFn({
          role: 'user',
          content: cleanPrompt,
          text: cleanPrompt,
        } as any);
      } else {
        console.error('Không tìm thấy hàm gửi tin nhắn (append/sendMessage) trong thư viện AI SDK.');
      }
    } catch (err) {
      console.error('Failed to append message:', err);
      submissionLockRef.current = false;
    }
  };

  const handleRetry = () => {
    if (messages.length === 0) return;
    submissionLockRef.current = true;
    if (reloadFn) {
      reloadFn();
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

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAiChat, ProviderHealthStatus } from '@/hooks/use-ai-chat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { 
  Bot, 
  MessageSquare, 
  Cpu, 
  ChevronDown, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  RefreshCw, 
  Activity, 
  Wifi, 
  WifiOff, 
  Clock,
  ArrowRight,
  TrendingUp,
  X,
  Gauge
} from 'lucide-react';

const CooldownTimer: React.FC<{ cooldownUntil: number }> = ({ cooldownUntil }) => {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => Math.max(0, Math.round((cooldownUntil - Date.now()) / 1000));
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownUntil]);

  if (!mounted) return null;

  return (
    <div className="mt-1.5 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/40 text-[9px] text-amber-600 dark:text-amber-500">
      Phục hồi sau: {timeLeft}s
    </div>
  );
};

const MODELS = [
  { id: 'auto', name: 'Tự động (Auto)', desc: 'Tự động chọn & fallback', icon: Sparkles, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'grok', name: 'Grok (xAI)', desc: 'grok-2-1212', icon: Bot, color: 'text-emerald-500 bg-emerald-500/10' },
  { id: 'gemini', name: 'Gemini (Google)', desc: 'gemini-2.5-flash', icon: Sparkles, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'deepseek', name: 'DeepSeek Chat', desc: 'deepseek-chat', icon: Cpu, color: 'text-cyan-500 bg-cyan-500/10' },
  { id: 'openrouter', name: 'OpenRouter Free', desc: 'qwen, deepseek, llama', icon: MessageSquare, color: 'text-purple-500 bg-purple-500/10' },
];

export function ChatLayout({ isAdmin = false }: { isAdmin?: boolean }) {
  const [selectedModel, setSelectedModel] = useState('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);

  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    handleRetry,
    error,
    activeModelInfo,
    healthData,
    isHealthLoading,
    refreshHealth
  } = useAiChat({
    selectedModel,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 100);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>, data?: { fileName?: string, documentId?: string }) => {
    if (e) e.preventDefault();
    
    // Determine content to send
    const content = (input || '').trim() || (data?.fileName ? `Đã đính kèm file: ${data?.fileName}` : '');
    if (!content) return;
    
    sendMessage(content, data?.documentId ? { documentId: data.documentId } : undefined);
    setInput('');
  };

  const getAverageLatency = (latencyArray: number[]) => {
    if (!latencyArray || latencyArray.length === 0) return 'N/A';
    const sum = latencyArray.reduce((a, b) => a + b, 0);
    return `${Math.round(sum / latencyArray.length)}ms`;
  };

  const getStatusColor = (status: ProviderHealthStatus['status']) => {
    if (status === 'online') return 'bg-green-500 text-green-600 dark:text-green-400';
    if (status === 'cooldown') return 'bg-amber-500 text-amber-600 dark:text-amber-400';
    return 'bg-zinc-400 text-zinc-500 dark:text-zinc-500';
  };

  const renderModelSelector = (isMobile = false) => {
    const activeModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];
    const ActiveIcon = activeModel.icon;
    
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full px-3 py-1.5 text-xs bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center gap-2 text-left">
            <span className={`p-1 rounded-md ${activeModel.color}`}>
              <ActiveIcon className="w-3.5 h-3.5" />
            </span>
            <div>
              <div className="font-semibold text-zinc-800 dark:text-zinc-200">{activeModel.name}</div>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 shrink-0 ml-1.5 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
            <div className={`absolute right-0 mt-2 z-50 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl flex flex-col gap-1 min-w-[200px] ${isMobile ? 'top-full' : 'top-full'}`}>
              <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 px-3.5 py-1.5 uppercase tracking-wider">
                Chọn mô hình AI
              </div>
              {MODELS.map((model) => {
                const ModelIcon = model.icon;
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      setSelectedModel(model.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex items-start gap-2.5 w-full text-left px-3 py-2 rounded-xl text-xs transition-all duration-150 ${isSelected ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
                  >
                    <span className={`p-1 rounded-md shrink-0 ${model.color} mt-0.5`}>
                      <ModelIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{model.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      </div>
                      <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">{model.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDashboardStats = () => {
    return (
      <div className="flex flex-col gap-2.5 mt-2">
        {Object.entries(healthData).map(([providerName, stats]) => {
          const formattedName = providerName.toUpperCase();
          const avgLatency = getAverageLatency(stats.latency);
          
          return (
            <div 
              key={providerName} 
              className="p-2.5 rounded-xl border border-zinc-150 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30 text-[11px]"
            >
              <div className="flex items-center justify-between font-semibold mb-1.5">
                <span className="text-zinc-750 dark:text-zinc-300">{formattedName}</span>
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(stats.status).split(' ')[0]} ${stats.status === 'cooldown' || stats.status === 'online' ? 'animate-pulse' : ''}`} />
                  <span className={`text-[10px] font-medium capitalize ${getStatusColor(stats.status).split(' ').slice(1).join(' ')}`}>
                    {stats.status === 'online' ? 'Online' : stats.status === 'cooldown' ? 'Cooldown' : 'Offline'}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-zinc-450 dark:text-zinc-550">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span>Trễ: <strong className="text-zinc-650 dark:text-zinc-350">{avgLatency}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 shrink-0" />
                  <span>Tổng gọi: <strong className="text-zinc-650 dark:text-zinc-350">{stats.requestCount}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0 text-amber-500" />
                  <span>Lỗi Quota: <strong className="text-zinc-650 dark:text-zinc-350">{stats.errorCount}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 shrink-0 text-blue-500" />
                  <span>Fallback: <strong className="text-zinc-650 dark:text-zinc-350">{stats.fallbackCount}</strong></span>
                </div>
              </div>

              {stats.status === 'cooldown' && stats.cooldownUntil && (
                <CooldownTimer cooldownUntil={stats.cooldownUntil} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6 px-2 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold text-lg tracking-tight">Eurowindow AI</h1>
          </div>
        </div>
        
        {/* Model Selector (Desktop Sidebar) */}
        <div className="mb-6 px-2">
          <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">Mô hình AI</div>
          {renderModelSelector(false)}
        </div>
        
        {/* Telemetry Dashboard (Desktop Sidebar) */}
        <div className="mb-6 px-2 border-t border-zinc-100 dark:border-zinc-800/50 pt-5">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-blue-500" /> Giám sát Router</span>
            <button 
              onClick={refreshHealth} 
              disabled={isHealthLoading}
              className="text-blue-500 hover:text-blue-600 disabled:opacity-50 transition-colors flex items-center gap-0.5 text-[9px]"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isHealthLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
          {renderDashboardStats()}
        </div>
        
        <div className="flex-1 overflow-y-auto border-t border-zinc-100 dark:border-zinc-800/50 pt-5">
          <div className="text-xs font-medium text-zinc-500 mb-3 px-2 uppercase tracking-wider">Hôm nay</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors text-left text-zinc-700 dark:text-zinc-300">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span className="truncate">Tư vấn cửa nhôm kính...</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full min-h-0">
        {/* Header (Mobile only) */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold text-sm">Eurowindow AI</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Health Dashboard trigger on Mobile */}
            <button
              onClick={() => setIsMobileDashboardOpen(true)}
              className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
              title="Xem giám sát AI"
            >
              <Activity className="w-4 h-4 text-blue-500" />
            </button>
            <div className="w-36">
              {renderModelSelector(true)}
            </div>
          </div>
        </header>

        {/* Mobile Dashboard Drawer Overlay */}
        {isMobileDashboardOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm">
            <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border border-zinc-150 dark:border-zinc-800 animate-slide-up">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-4">
                <h3 className="font-bold flex items-center gap-2 text-sm">
                  <Gauge className="w-4 h-4 text-blue-500" /> Giám sát Router AI
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={refreshHealth} 
                    disabled={isHealthLoading}
                    className="p-1 text-zinc-500 hover:text-blue-500"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isHealthLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={() => setIsMobileDashboardOpen(false)}
                    className="p-1 text-zinc-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {renderDashboardStats()}
            </div>
          </div>
        )}

        {/* Messages list */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 md:p-8 scroll-smooth relative"
        >
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center mt-12 md:mt-24 space-y-3 md:space-y-4 px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-lg md:text-2xl font-semibold">Xin chào, tôi là AI tư vấn cửa Eurowindow.</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-sm md:text-base">
                  Tôi có thể giúp bạn tìm hiểu về các dòng sản phẩm, thông số kỹ thuật, cách âm, cách nhiệt, và đưa ra giải pháp phù hợp cho ngôi nhà của bạn.
                </p>
              </div>
            ) : (
              messages.map((m: any) => <ChatMessage key={m.id} message={m} />)
            )}
            
            {/* Connection/API error status */}
            {error && (
              <div className="p-4 mb-4 text-sm text-red-800 rounded-2xl bg-red-50 dark:bg-red-950/20 dark:text-red-400 border border-red-200 dark:border-red-900/30 mt-4 flex flex-col gap-3 max-w-2xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5 animate-bounce" />
                  <div className="flex-1">
                    <span className="font-semibold block mb-0.5">Lỗi kết nối AI:</span>
                    <span className="text-xs md:text-sm">
                      {error.message.includes('API key') || error.message.includes('API_KEY')
                        ? 'Cấu hình API Key trên máy chủ đang bị thiếu hoặc không chính xác. Vui lòng kiểm tra lại file .env hoặc cấu hình dự án.'
                        : error.message}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRetry}
                  className="self-end px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-red-500/20 focus:outline-none"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Thử lại truy vấn
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 md:bottom-28 right-6 z-20 p-2.5 bg-blue-600 text-white rounded-full shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center animate-bounce"
            title="Cuộn xuống tin nhắn mới nhất"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}

        {/* Input Area */}
        <div className="p-3 md:p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950 z-10">
          <div className="max-w-3xl mx-auto">
            {/* Active responding AI model indicator */}
            {activeModelInfo && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl text-xs text-zinc-500 dark:text-zinc-400 mb-3 max-w-max mr-auto shadow-sm backdrop-blur-md animate-fade-in">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>AI hoạt động: <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{activeModelInfo.model}</strong> ({activeModelInfo.provider})</span>
                {activeModelInfo.fallbackTriggered && (
                  <span className="flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md font-semibold text-[10px]">
                    <AlertTriangle className="w-3 h-3 animate-pulse text-amber-500" /> Tự động Fallback
                  </span>
                )}
              </div>
            )}
            <ChatInput 
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              isAdmin={isAdmin}
            />
            <p className="text-center text-[10px] md:text-xs text-zinc-400 mt-2 md:mt-4">
              AI có thể mắc sai lầm. Hãy kiểm tra lại thông tin quan trọng.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

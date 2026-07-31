'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { submitToGoogleForms } from '@/utils/googleForms';
import { useAiChat } from '@/hooks/use-ai-chat';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PHONE = '0966994338';
const PHONE_DISPLAY = '0966 994 338';
const ZALO_LINK = `https://zalo.me/${PHONE}`;

export const FloatingContact: React.FC = () => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'form'>('ai');
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Chat Hook
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
  } = useAiChat({
    selectedModel: 'auto',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Listen for global custom event 'open-ai-chat'
  useEffect(() => {
    const handleOpenAiChat = (e: any) => {
      setModalOpen(true);
      setActiveTab('ai');
      if (e.detail?.initialPrompt) {
        setTimeout(() => {
          sendMessage(e.detail.initialPrompt);
        }, 300);
      }
    };

    window.addEventListener('open-ai-chat', handleOpenAiChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenAiChat);
  }, [sendMessage]);

  useEffect(() => {
    if (activeTab === 'ai') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      message: formData.get('product') as string,
    };

    const success = await submitToGoogleForms(data);
    setIsSubmitting(false);

    if (success) {
      alert('Cảm ơn bạn đã liên hệ! Chuyên viên Eurowindow sẽ phản hồi trong thời gian sớm nhất.');
      setModalOpen(false);
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  const handleSendAiMessage = (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend || !textToSend.trim()) return;
    sendMessage(textToSend.trim());
    setInput('');
  };

  return (
    <>
      <style>{`
        @keyframes sonar {
          0%   { transform: scale(1);   opacity: .55; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes sonar2 {
          0%   { transform: scale(1);   opacity: .35; }
          100% { transform: scale(2.6); opacity: 0;   }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0);      }
        }
        .sonar-1 { animation: sonar  2.2s ease-out infinite; }
        .sonar-2 { animation: sonar2 2.2s ease-out infinite .55s; }
        .sonar-red-1 { animation: sonar  2s ease-out infinite .2s; }
        .sonar-red-2 { animation: sonar2 2s ease-out infinite .85s; }
        .modal-in { animation: modalIn .35s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* ── Floating Buttons ── */}
      <div
        className={`fixed bottom-20 right-5 z-50 flex flex-col items-center gap-4 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* ── ZALO ── */}
        <div className="relative flex items-center justify-center">
          <span className="sonar-1 absolute inset-0 rounded-full bg-[#0068ff]/40 pointer-events-none" />
          <span className="sonar-2 absolute inset-0 rounded-full bg-[#0068ff]/25 pointer-events-none" />

          <a
            href={ZALO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            title={`Chat Zalo: ${PHONE_DISPLAY}`}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #1a8cff 0%, #0052cc 100%)' }}
          >
            <span
              className="text-white font-black select-none"
              style={{ fontSize: 16, letterSpacing: '-0.5px', fontFamily: 'Arial Black, Arial, sans-serif' }}
            >
              Zalo
            </span>
          </a>
        </div>

        {/* ── CALL ── */}
        <div className="relative flex items-center justify-center">
          <span className="sonar-red-1 absolute inset-0 rounded-full bg-red-500/45 pointer-events-none" />
          <span className="sonar-red-2 absolute inset-0 rounded-full bg-red-500/25 pointer-events-none" />

          <a
            href={`tel:${PHONE}`}
            title={`${t('float_call_free')}: ${PHONE_DISPLAY}`}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(145deg, #ff4444 0%, #cc0000 100%)' }}
          >
            <PhoneIcon />
          </a>
        </div>

        {/* ── TƯ VẤN BÁO GIÁ PILL BUTTON ── */}
        <button
          onClick={() => {
            setModalOpen(true);
            setActiveTab('ai');
          }}
          className="mt-1 flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#005ba7] text-[11px] font-black uppercase tracking-wide rounded-full shadow-xl px-4 py-2.5 border border-blue-200 transition-all hover:scale-105 active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span>TƯ VẤN BÁO GIÁ</span>
        </button>
      </div>

      {/* ── Consultation & Chatbot Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="modal-in bg-white w-full sm:max-w-xl h-[85vh] sm:h-[650px] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col">

            {/* Header */}
            <div className="relative px-6 pt-5 pb-4 text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg,#005ba7 0%,#1a6fd8 100%)' }}>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <CloseIcon />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-400 text-slate-900 tracking-wider">Hỗ trợ 24/7</span>
                <span className="text-[11px] text-blue-100 font-medium">Phản hồi tức thì</span>
              </div>
              <h3 className="text-lg font-black">Tư Vấn & Báo Giá Eurowindow</h3>

              {/* Tabs */}
              <div className="flex gap-2 mt-3 pt-2 border-t border-white/15">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === 'ai' ? 'bg-white text-[#005ba7]' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  💬 Chatbot Báo Giá
                </button>
                <button
                  onClick={() => setActiveTab('form')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === 'form' ? 'bg-white text-[#005ba7]' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  📞 Để Lại SĐT Tư Vấn
                </button>
              </div>
            </div>

            {/* Tab 1: Chatbot */}
            {activeTab === 'ai' && (
              <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  
                  {/* Default Welcome */}
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full bg-[#005ba7] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      EW
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200/80 shadow-sm max-w-[85%] text-slate-800 space-y-2">
                      <p className="font-semibold text-[#005ba7]">
                        Xin chào! Tôi là Trợ lý Eurowindow.
                      </p>
                      <p>
                        Tôi có thể tư vấn thông số kỹ thuật, cách âm cách nhiệt và tính báo giá cho các dòng cửa nhôm EA55, EA60i, cửa nhựa Kommerling... Bạn muốn báo giá sản phẩm nào?
                      </p>
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {messages.length === 0 && (
                    <div className="grid grid-cols-2 gap-2 pt-2 px-1">
                      <button
                        onClick={() => handleSendAiMessage('Báo giá cửa nhôm EA55')}
                        className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#005ba7] rounded-xl text-left font-medium text-slate-700 hover:text-[#005ba7] transition-all text-[11px]"
                      >
                        🚪 Báo giá Cửa nhôm EA55
                      </button>
                      <button
                        onClick={() => handleSendAiMessage('Báo giá cửa nhôm EA60i cầu cách nhiệt')}
                        className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#005ba7] rounded-xl text-left font-medium text-slate-700 hover:text-[#005ba7] transition-all text-[11px]"
                      >
                        🛡️ Báo giá Cửa nhôm EA60i
                      </button>
                      <button
                        onClick={() => handleSendAiMessage('Báo giá cửa nhựa uPVC Kommerling cách âm')}
                        className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#005ba7] rounded-xl text-left font-medium text-slate-700 hover:text-[#005ba7] transition-all text-[11px]"
                      >
                        🔇 Cửa nhựa uPVC Kommerling
                      </button>
                      <button
                        onClick={() => handleSendAiMessage('Tư vấn chọn kính Low-E cản nhiệt và kính hộp')}
                        className="p-2.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[#005ba7] rounded-xl text-left font-medium text-slate-700 hover:text-[#005ba7] transition-all text-[11px]"
                      >
                        ⚡ Kính Low-E cản nhiệt
                      </button>
                    </div>
                  )}

                  {/* Chat History */}
                  {messages.map((msg: any, idx: number) => {
                    // Extract text content safely across AI SDK 3.x and 4.x
                    let text = '';
                    if (typeof msg.content === 'string' && msg.content.trim()) {
                      text = msg.content;
                    } else if (Array.isArray(msg.parts) && msg.parts.length > 0) {
                      text = msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text || '').join('');
                    } else if (typeof msg.text === 'string' && msg.text.trim()) {
                      text = msg.text;
                    }

                    if (!text || !text.trim()) return null;

                    return (
                      <div
                        key={idx}
                        className={`flex gap-2.5 items-start ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.role !== 'user' && (
                          <div className="w-7 h-7 rounded-full bg-[#005ba7] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                            EW
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-[#005ba7] text-white rounded-tr-none shadow-md font-medium'
                              : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80 shadow-sm'
                          }`}
                        >
                          {text}
                        </div>
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex gap-2 items-center text-slate-400 italic text-xs pl-9">
                      <span className="w-2 h-2 bg-[#005ba7] rounded-full animate-ping" />
                      <span>Đang tra cứu thông tin báo giá...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendAiMessage();
                      }
                    }}
                    placeholder="Nhập câu hỏi báo giá hoặc thông số kỹ thuật..."
                    className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-xs outline-none focus:bg-white focus:border-[#005ba7] focus:ring-1 focus:ring-[#005ba7] text-slate-800"
                  />
                  <button
                    onClick={() => handleSendAiMessage()}
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2.5 bg-[#005ba7] hover:bg-[#004077] disabled:opacity-40 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>Gửi</span>
                  </button>
                </div>

                <div className="px-4 py-1.5 bg-slate-100 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Cần tư vấn toàn màn hình?</span>
                  <Link href="/chat" className="text-[#005ba7] font-bold hover:underline">
                    Mở Full Screen Chat →
                  </Link>
                </div>
              </div>
            )}

            {/* Tab 2: Form */}
            {activeTab === 'form' && (
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {t('float_label_name')}
                  </label>
                  <input
                    name="name"
                    type="text"
                    placeholder={t('float_ph_name')}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {t('float_label_phone')}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder={t('float_ph_phone')}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {t('float_label_product')}
                  </label>
                  <select
                    name="product"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800"
                  >
                    <option value={t('float_opt1')}>{t('float_opt1')}</option>
                    <option value={t('float_opt2')}>{t('float_opt2')}</option>
                    <option value={t('float_opt3')}>{t('float_opt3')}</option>
                    <option value={t('float_opt4')}>{t('float_opt4')}</option>
                    <option value={t('float_opt5')}>{t('float_opt5')}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-blue-600/40"
                  style={{ background: 'linear-gradient(135deg,#005ba7 0%,#1a6fd8 100%)' }}
                >
                  {isSubmitting ? 'ĐANG GỬI...' : t('float_submit')}
                </button>

                <p className="text-center text-[10px] text-gray-400">
                  {t('float_or_call')}{' '}
                  <a href={`tel:${PHONE}`} className="text-[#005ba7] font-bold hover:underline">
                    {PHONE_DISPLAY}
                  </a>
                </p>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
};

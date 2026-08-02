'use client';

import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function SeoAssistantPage() {
  const [input, setInput] = useState('');
  const chat = useChat({
    api: '/api/admin/seo/assistant',
  } as any) as any;

  const { messages = [], append, status } = chat;
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    if (append) {
      await append({
        role: 'user',
        content: userText,
      });
    }
  };

  const handlePresetClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-gray-900">AI SEO Expert Assistant</h2>
          <p className="text-xs text-gray-500">Trợ lý AI tư vấn SEO Enterprise, phân tích bài viết & tra cứu quy định Google</p>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
          ● RAG Enabled
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <span className="text-4xl">🤖</span>
            <p className="text-sm font-bold text-gray-700">Tôi có thể giúp gì cho chiến lược SEO Eurowindow hôm nay?</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              <button
                type="button"
                onClick={() => handlePresetClick('Kiểm tra chuẩn E-E-A-T cho trang cửa nhôm')}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs text-gray-700 border border-gray-200 cursor-pointer"
              >
                &ldquo;Kiểm tra chuẩn E-E-A-T cho trang cửa nhôm&rdquo;
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('Tại sao CTR từ khóa cửa nhựa uPVC thấp?')}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs text-gray-700 border border-gray-200 cursor-pointer"
              >
                &ldquo;Tại sao CTR từ khóa cửa nhựa uPVC thấp?&rdquo;
              </button>
            </div>
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#005ba7] text-white'
                    : 'bg-gray-50 text-gray-800 border border-gray-100'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-3 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi trợ lý SEO (ví dụ: Tạo schema FAQ cho bài viết cửa gỗ...)"
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7] shadow-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-3 bg-[#005ba7] hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
        >
          {isLoading ? 'Đang suy nghĩ...' : 'Gửi'}
        </button>
      </form>
    </div>
  );
}

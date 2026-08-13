'use client';

import React, { useState } from 'react';
import { ArticleSEOData } from '@/lib/seo/analyzer/types';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ArticleSEOData;
  category?: string;
  date?: string;
}

export function ArticlePreviewModal({
  isOpen,
  onClose,
  data,
  category = 'Tin tức',
  date = new Date().toLocaleDateString('vi-VN'),
}: ArticlePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Modal Header Controls */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">👁️</span>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Xem Trước Bài Đăng (Live Article Preview)</h3>
              <p className="text-[11px] text-gray-400">Xem trước hiển thị giao diện thực tế đối với người đọc</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Device View */}
            <div className="bg-slate-800 p-1 rounded-xl flex gap-1 border border-slate-700">
              <button
                onClick={() => setDevice('desktop')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  device === 'desktop' ? 'bg-[#005ba7] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                🖥️ Desktop
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  device === 'mobile' ? 'bg-[#005ba7] text-white shadow-xs' : 'text-gray-400 hover:text-white'
                }`}
              >
                📱 Mobile
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white font-bold rounded-xl hover:bg-slate-800 transition text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-4 flex justify-center">
          <div
            className={`bg-white transition-all duration-300 shadow-md min-h-full ${
              device === 'mobile'
                ? 'w-[375px] rounded-3xl border-8 border-slate-800 my-4 p-4'
                : 'w-full max-w-4xl p-8 rounded-xl'
            }`}
          >
            {/* Header Meta */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-[#005ba7] bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                  {category}
                </span>
                <span className="text-xs text-gray-400">• {date}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {data.title || 'Tiêu đề bài viết chưa nhập...'}
              </h1>
            </div>

            {/* Cover Image */}
            {data.image && (
              <div className="mb-6 rounded-2xl overflow-hidden shadow-xs border border-gray-100">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-auto max-h-[450px] object-cover"
                />
              </div>
            )}

            {/* Excerpt */}
            {data.excerpt && (
              <div className="p-4 bg-slate-50 border-l-4 border-[#005ba7] text-gray-700 italic text-sm font-medium mb-6 rounded-r-xl">
                {data.excerpt}
              </div>
            )}

            {/* Content Body Render */}
            <div
              className="prose max-w-none text-gray-800 text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: data.content || '<p className="text-gray-400 italic">Nội dung bài viết chưa nhập...</p>' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

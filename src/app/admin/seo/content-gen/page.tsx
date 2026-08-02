'use client';

import React, { useState } from 'react';
import SchemaPreview from '@/components/seo/SchemaPreview';
import type { ContentType, GeneratedContent } from '@/lib/seo/types';

export default function SeoContentGenPage() {
  const [type, setType] = useState<ContentType>('blog');
  const [topic, setTopic] = useState('Ưu điểm cửa nhôm Eurowindow EA55 cho công trình biệt thự');
  const [keywords, setKeywords] = useState('cửa nhôm eurowindow, ea55, cửa nhôm biệt thự');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const kwList = keywords.split(',').map((k) => k.trim()).filter(Boolean);
      const res = await fetch('/api/admin/seo/content-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, keywords: kwList }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Content generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">AI Content Generator (RAG Grounded)</h2>
        <p className="text-xs text-gray-500">
          Tạo bài viết Blog, FAQ, Landing Page, Meta Data chuẩn SEO. Sử dụng 100% dữ liệu đã xác thực từ tài liệu Eurowindow (RAG).
        </p>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Loại Nội Dung</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ContentType)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
              >
                <option value="blog">Bài viết Blog</option>
                <option value="faq">Trang FAQ</option>
                <option value="landing">Landing Page</option>
                <option value="product">Mô tả sản phẩm</option>
                <option value="meta">Meta Title & Description</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Chủ đề chính</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Từ khóa mục tiêu (phân cách bằng dấu phẩy)</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'AI đang sinh nội dung...' : 'Sinh Nội Dung Chuẩn SEO'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Metadata preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Xem Trước Meta Data</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
              <div className="font-bold text-blue-800 text-sm hover:underline cursor-pointer">
                {result.metaTitle}
              </div>
              <div className="text-emerald-700 font-medium">
                https://eurowindow.com.vn/{result.slug}
              </div>
              <div className="text-gray-600">
                {result.metaDescription}
              </div>
            </div>
          </div>

          {/* Generated Content */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900">Nội Dung Đã Sinh ({result.title})</h3>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto whitespace-pre-wrap font-sans">
              {result.content}
            </pre>
          </div>

          {/* Schema JSON-LD if auto-generated */}
          {result.schema && (
            <SchemaPreview jsonLd={JSON.stringify(result.schema, null, 2)} />
          )}
        </div>
      )}
    </div>
  );
}

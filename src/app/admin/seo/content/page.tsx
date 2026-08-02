'use client';

import React, { useState } from 'react';
import type { ContentAuditResult } from '@/lib/seo/types';

export default function SeoContentPage() {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentAuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, url }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Content audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">AI Content & E-E-A-T Audit</h2>
        <form onSubmit={handleAudit} className="space-y-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL bài viết (không bắt buộc)"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dán nội dung bài viết cần phân tích vào đây..."
            rows={8}
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang phân tích E-E-A-T...' : 'Phân Tích Nội Dung'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Score Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">E-E-A-T</span>
              <div className="text-xl font-black text-[#005ba7]">{result.scores.eeat}/100</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Helpfulness</span>
              <div className="text-xl font-black text-emerald-600">{result.scores.helpfulness}/100</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Readability</span>
              <div className="text-xl font-black text-purple-600">{result.scores.readability}/100</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase">Spam Risk</span>
              <div className="text-xl font-black text-amber-600">{result.scores.spamRisk}%</div>
            </div>
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900">💡 Gợi Ý Tối Ưu Nội Dung</h3>
              <div className="space-y-2 text-xs">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <span className="font-bold text-[#005ba7] uppercase">{s.type} - {s.section}</span>
                    <p className="text-gray-700">{s.reason}</p>
                    {s.suggested && (
                      <p className="text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg mt-1">
                        Gợi ý: &ldquo;{s.suggested}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

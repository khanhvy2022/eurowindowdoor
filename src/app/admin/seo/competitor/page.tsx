'use client';

import React, { useState } from 'react';
import type { CompetitorAnalysis } from '@/lib/seo/types';

export default function SeoCompetitorPage() {
  const [domain, setDomain] = useState('austdoor.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitorAnalysis | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Competitor analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">AI Competitor Analysis</h2>
        <form onSubmit={handleAnalyze} className="flex gap-3">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Nhập tên miền đối thủ (ví dụ: austdoor.com)"
            required
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang phân tích đối thủ...' : 'Phân Tích Đối Thủ'}
          </button>
        </form>
      </div>

      {result && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Báo Cáo Đối Thủ: {result.domain}</h3>
            <span className="text-xs text-gray-500">Không ước lượng điểm kỹ thuật, nội dung hoặc traffic khi chưa có phép đo độc lập.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>💪</span> Điểm Mạnh Của Đối Thủ
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚠️</span> Điểm Yếu Của Đối Thủ
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>🚀</span> Cơ Hội Cho Eurowindow
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {result.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

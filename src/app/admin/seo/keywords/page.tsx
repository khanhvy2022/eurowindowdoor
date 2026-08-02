'use client';

import React, { useState } from 'react';
import KeywordTable from '@/components/seo/KeywordTable';
import type { KeywordResearchResult } from '@/lib/seo/types';

export default function SeoKeywordsPage() {
  const [seed, setSeed] = useState('cửa nhôm kính');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<KeywordResearchResult | null>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seed }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Keyword research failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">AI Keyword Research & Clustering</h2>
        <form onSubmit={handleResearch} className="flex gap-3">
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Nhập từ khóa hạt giống (ví dụ: cửa nhựa upvc, cửa gỗ công nghiệp)"
            required
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang phân tích...' : 'Nghiên Cứu Từ Khóa'}
          </button>
        </form>
      </div>

      {result && <KeywordTable clusters={result.clusters} questions={result.questions} />}
    </div>
  );
}

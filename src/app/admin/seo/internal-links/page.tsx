'use client';

import React, { useEffect, useState } from 'react';
import type { InternalLinkAnalysis } from '@/lib/seo/types';

export default function SeoInternalLinksPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InternalLinkAnalysis | null>(null);

  useEffect(() => {
    async function loadInternalLinks() {
      try {
        const res = await fetch('/api/admin/seo/internal-links');
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Failed to load internal links:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInternalLinks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005ba7]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-gray-900">AI Internal Linking Analysis</h2>
          <p className="text-xs text-gray-500">Phân tích liên kết nội bộ, phát hiện trang mồ côi (orphan pages) và gợi ý anchor text</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-[#005ba7] rounded-xl text-xs font-bold border border-blue-100">
          {data?.linkGraph.length || 0} Pages Audited
        </span>
      </div>

      {/* Suggestions List */}
      {data?.suggestions && data.suggestions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>🔗</span> Đề Xuất Liên Kết Nội Bộ ({data.suggestions.length})
          </h3>
          <div className="divide-y divide-gray-100 text-xs">
            {data.suggestions.map((s, idx) => (
              <div key={idx} className="py-3 space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{s.sourceTitle} ➔ {s.targetTitle}</span>
                  <span className="text-blue-600 font-semibold">Anchor: &ldquo;{s.anchorText}&rdquo;</span>
                </div>
                <p className="text-gray-500">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

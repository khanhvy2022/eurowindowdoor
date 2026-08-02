'use client';

import React, { useState } from 'react';
import AuditChecklist from '@/components/seo/AuditChecklist';
import type { TechnicalAuditResult } from '@/lib/seo/types';

export default function SeoAuditPage() {
  const [url, setUrl] = useState('https://eurowindowdoor.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TechnicalAuditResult | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input Form */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">AI Technical SEO Audit</h2>
        <form onSubmit={handleAudit} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL cần kiểm tra (ví dụ: https://eurowindowdoor.com)"
            required
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Bắt đầu Audit'}
          </button>
        </form>
      </div>

      {/* Audit Result Display */}
      {result && (
        <div className="space-y-6">
          {/* Score Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Kết quả Audit cho {result.url}</h3>
              <p className="text-xs text-gray-500">Phát hiện {result.issues.length} vấn đề SEO</p>
            </div>
            <div className="text-2xl font-black text-[#005ba7] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
              Score: {result.score}/100
            </div>
          </div>

          {/* Audit Checklist & Issues */}
          <AuditChecklist checklist={result.checklist} issues={result.issues} />
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import type { ReportType } from '@/lib/seo/types';

export default function SeoReportsPage() {
  const [type, setType] = useState<ReportType>('monthly');
  const [loading, setLoading] = useState(false);

  const handleExportCsv = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, format: 'csv' }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `seo-report-${type}.csv`;
        a.click();
      }
    } catch (err) {
      console.error('Export CSV failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">Xuất Báo Cáo SEO Enterprise</h2>
        <p className="text-xs text-gray-500">Tạo và xuất báo cáo tổng hợp SEO định kỳ: Hàng tuần, Hàng tháng, Hàng quý.</p>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReportType)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005ba7]"
          >
            <option value="weekly">Báo cáo Hàng tuần (Weekly)</option>
            <option value="monthly">Báo cáo Hàng tháng (Monthly)</option>
            <option value="quarterly">Báo cáo Hàng quý (Quarterly)</option>
          </select>

          <button
            onClick={handleExportCsv}
            disabled={loading}
            className="px-5 py-2.5 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <span>📥</span> {loading ? 'Đang tạo CSV...' : 'Xuất File CSV / Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}

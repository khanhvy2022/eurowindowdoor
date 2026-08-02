'use client';

import React, { useEffect, useState } from 'react';
import MetricsChart from '@/components/seo/MetricsChart';
import type { SearchConsoleData } from '@/lib/seo/types';

export default function SeoSearchConsolePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchConsoleData | null>(null);

  useEffect(() => {
    async function loadGsc() {
      try {
        const res = await fetch('/api/admin/seo/search-console');
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Failed to load GSC data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGsc();
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
          <h2 className="text-base font-bold text-gray-900">Google Search Console Integration</h2>
          <p className="text-xs text-gray-500">Phân tích hiệu suất tìm kiếm tự nhiên: Clicks, Impressions, CTR, Position</p>
        </div>
        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100">
          Property: eurowindowdoor.com
        </span>
      </div>

      {!data?.isLiveData && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-950">
          <p className="font-bold">Chưa có dữ liệu Google Search Console thực</p>
          <p className="mt-1">Thiết lập service account và cấp quyền cho property {data?.siteUrl || 'sc-domain:eurowindowdoor.com'}. Trang này không hiển thị dữ liệu mẫu.</p>
          {data?.error ? <p className="mt-1 font-medium">Lý do: {data.error}</p> : null}
        </div>
      )}

      {data?.isLiveData && <MetricsChart data={data.byDate} title="Hiệu suất tìm kiếm (28 ngày)" />}

      {/* Top Pages Table */}
      {data?.isLiveData && data.topPages.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Top Trang Có Lượt Truy Cập Cao Nhất</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-2.5">Trang (URL)</th>
                  <th className="p-2.5">Clicks</th>
                  <th className="p-2.5">Impressions</th>
                  <th className="p-2.5">CTR</th>
                  <th className="p-2.5">Vị trí trung bình</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {data.topPages.map((page, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2.5 font-bold text-blue-600">{page.page}</td>
                    <td className="p-2.5 text-gray-900 font-semibold">{page.clicks.toLocaleString()}</td>
                    <td className="p-2.5 text-gray-600">{page.impressions.toLocaleString()}</td>
                    <td className="p-2.5 text-emerald-600 font-bold">{(page.ctr * 100).toFixed(1)}%</td>
                    <td className="p-2.5 text-amber-600 font-bold">{page.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

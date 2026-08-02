'use client';

import React, { useEffect, useState } from 'react';
import GeoScoreMatrix from '@/components/seo/GeoScoreMatrix';
import type { GeoAnalysisResult } from '@/lib/seo/types';

export default function SeoGeoPage() {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('Eurowindow');
  const [data, setData] = useState<GeoAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/geo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand }),
      });
      if (res.ok) {
        const resData = await res.json();
        setData(resData);
      }
    } catch (err) {
      console.error('GEO analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Generative Engine Optimization (GEO)</h2>
          <p className="text-xs text-gray-500">Đánh giá khả năng hiển thị & độ uy tín của thương hiệu trên các AI Engine (Gemini, Groq, OpenRouter)</p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="px-4 py-2 bg-[#005ba7] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Đang kiểm tra AI Engines...' : '🔄 Chạy Phân Tích Mới'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005ba7]" />
        </div>
      ) : (
        data && <GeoScoreMatrix data={data} />
      )}
    </div>
  );
}

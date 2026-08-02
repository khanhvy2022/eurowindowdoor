'use client';

import React, { useEffect, useState } from 'react';
import SeoScoreCard from '@/components/seo/SeoScoreCard';
import MetricsChart from '@/components/seo/MetricsChart';
import type { SeoScore, SearchConsoleData, SiteHealthResult } from '@/lib/seo/types';

export default function SeoDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [seoScore, setSeoScore] = useState<SeoScore | undefined>();
  const [gscData, setGscData] = useState<SearchConsoleData | undefined>();
  const [siteHealth, setSiteHealth] = useState<SiteHealthResult | undefined>();

  interface PageSpeedData {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    lcp: string;
    fcp: string;
    cls: string;
  }

  const [pageSpeed, setPageSpeed] = useState<PageSpeedData | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/seo/dashboard');
        if (res.ok) {
          const data = await res.json();
          setSeoScore(data.seoScore);
          setGscData(data.searchConsole);
          setSiteHealth(data.siteHealth);
          setPageSpeed(data.pageSpeed);
        }
      } catch (err) {
        console.error('Failed to load SEO dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
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
      {/* Composite score is shown only after every required source has been measured. */}
      {seoScore ? <SeoScoreCard score={seoScore} /> : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-bold text-slate-900">Chưa có SEO Score tổng hợp</p>
          <p className="mt-1 text-xs">Cần một Technical Audit đã lưu và kết quả Google PageSpeed hợp lệ. Hệ thống không tự điền điểm ước lượng.</p>
        </div>
      )}

      {/* Real Google PageSpeed Insights & Core Web Vitals Panel */}
      {pageSpeed && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>⚡</span> Google PageSpeed & Core Web Vitals (Real-time)
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full">
              Live API
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 font-semibold block">Performance</span>
              <span className="text-xl font-black text-[#005ba7]">{pageSpeed.performance}/100</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 font-semibold block">Accessibility</span>
              <span className="text-xl font-black text-purple-600">{pageSpeed.accessibility}/100</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 font-semibold block">LCP (Load Speed)</span>
              <span className="text-xl font-black text-emerald-600">{pageSpeed.lcp}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500 font-semibold block">CLS (Shift)</span>
              <span className="text-xl font-black text-amber-600">{pageSpeed.cls}</span>
            </div>
          </div>
        </div>
      )}

      {/* Google Search Console Status */}
      {gscData && !gscData.isLiveData && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
          <span className="text-lg">🔒</span>
          <div className="text-xs text-amber-900 space-y-1">
            <div className="font-bold">Google Search Console API chưa kết nối (OAuth 2.0 / Service Account)</div>
            <div>
              Không có số liệu ước lượng nào được hiển thị. Bổ sung <code className="bg-amber-100 px-1 rounded">GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL</code>, <code className="bg-amber-100 px-1 rounded">GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY</code> và <code className="bg-amber-100 px-1 rounded">GOOGLE_SEARCH_CONSOLE_SITE_URL</code> trong <code className="bg-amber-100 px-1 rounded">.env.local</code>, rồi cấp quyền đọc property cho service account.
              {gscData.error ? <span className="block mt-1 font-medium">Lý do: {gscData.error}</span> : null}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Summary Grid (Only if Live Data) */}
      {gscData && gscData.isLiveData && gscData.summary.impressions > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-bold uppercase">Total Clicks</span>
              <div className="text-2xl font-black text-[#005ba7]">{gscData.summary.clicks.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-bold uppercase">Total Impressions</span>
              <div className="text-2xl font-black text-purple-600">{gscData.summary.impressions.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-bold uppercase">Average CTR</span>
              <div className="text-2xl font-black text-emerald-600">{(gscData.summary.ctr * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-xs text-gray-500 font-bold uppercase">Average Position</span>
              <div className="text-2xl font-black text-amber-600">{gscData.summary.position}</div>
            </div>
          </div>

          {gscData.byDate && gscData.byDate.length > 0 && <MetricsChart data={gscData.byDate} />}
        </>
      )}

      {/* Site Health & Top Queries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Health Card */}
        {siteHealth && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>🩺</span> Real-time Site Health Snapshot
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
                <span>SSL Certificate</span>
                <span className={`font-bold ${siteHealth.ssl.valid ? 'text-emerald-600' : 'text-red-600'}`}>
                  {siteHealth.ssl.valid ? '✓ Valid (HTTPS)' : '✕ Invalid'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
                <span>XML Sitemap</span>
                <span className={`font-bold ${siteHealth.sitemap.found ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {siteHealth.sitemap.found ? `✓ Found (${siteHealth.sitemap.urlCount || 0} URLs)` : '✕ Missing'}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
                <span>Robots.txt</span>
                <span className={`font-bold ${siteHealth.robots.found ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {siteHealth.robots.found ? '✓ Configured' : '✕ Missing'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Top Queries Preview (Only when live) */}
        {gscData?.isLiveData && gscData.topQueries && gscData.topQueries.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>🔥</span> Top Search Queries
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              {gscData.topQueries.slice(0, 5).map((q, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <span className="font-medium text-gray-800">{q.query}</span>
                  <div className="flex items-center gap-3 text-gray-500">
                    <span>{q.clicks} clicks</span>
                    <span className="font-bold text-gray-900">Pos {q.position}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

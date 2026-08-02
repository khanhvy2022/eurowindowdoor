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

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/admin/seo/dashboard');
        if (res.ok) {
          const data = await res.json();
          setSeoScore(data.seoScore);
          setGscData(data.searchConsole);
          setSiteHealth(data.siteHealth);
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
      {/* Top Score Overview */}
      <SeoScoreCard score={seoScore} />

      {/* Metrics Summary Grid */}
      {gscData && (
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
      )}

      {/* Metrics Chart */}
      {gscData?.byDate && <MetricsChart data={gscData.byDate} />}

      {/* Site Health & Top Queries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Health Card */}
        {siteHealth && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>🩺</span> Site Health Snapshot
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

        {/* Top Queries Preview */}
        {gscData?.topQueries && (
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

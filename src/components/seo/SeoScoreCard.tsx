'use client';

import React from 'react';
import type { SeoScore } from '@/lib/seo/types';

export default function SeoScoreCard({ score }: { score?: SeoScore }) {
  if (!score) return null;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (val >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-blue-500';
    if (val >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const items = [
    { label: 'Technical SEO', val: score.technical },
    { label: 'Content & E-E-A-T', val: score.content },
    { label: 'Performance', val: score.performance },
    { label: 'Mobile Friendly', val: score.mobile },
    { label: 'Accessibility', val: score.accessibility },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">SEO Health Overview</h2>
          <p className="text-xs text-gray-500">Composite score based on technical & content signals</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-black ${getScoreColor(score.overall)}`}>
          Grade {score.grade}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Main Score Radial / Big badge */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 min-w-[120px]">
          <span className="text-4xl font-black text-[#005ba7]">{score.overall}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-1">SEO Score</span>
        </div>

        {/* Sub scores */}
        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-700">{item.label}</span>
                <span className="font-bold text-gray-900">{item.val}/100</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.val)}`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

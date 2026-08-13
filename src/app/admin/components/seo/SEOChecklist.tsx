'use client';

import React from 'react';
import { SEOAnalysisResult } from '@/lib/seo/analyzer/types';

interface SEOChecklistProps {
  categories: SEOAnalysisResult['categories'];
}

export function SEOChecklist({ categories }: SEOChecklistProps) {
  const catList = Object.values(categories);

  return (
    <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Chi Tiết Audit SEO & Gợi Ý</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {catList.map((cat) => (
          <div key={cat.category} className="border border-gray-100 rounded-xl p-3 bg-slate-50/50">
            <div className="text-xs font-bold text-[#005ba7] mb-2">{cat.name} ({cat.score}/{cat.maxScore})</div>
            <div className="space-y-2">
              {cat.checks.map((check) => (
                <div key={check.id} className="text-xs flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 font-bold">
                    {check.passed ? (
                      <span className="text-emerald-600">✓</span>
                    ) : check.score > 0 ? (
                      <span className="text-amber-500">⚠</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                  </span>
                  <div className="flex-1">
                    <p className={`font-semibold ${check.passed ? 'text-gray-800' : 'text-gray-900'}`}>
                      {check.message}
                    </p>
                    {check.recommendation && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md mt-1 border border-amber-200/50">
                        💡 Gợi ý: {check.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { SEOAnalysisResult } from '@/lib/seo/analyzer/types';

interface SEOCategoryScoreProps {
  categories: SEOAnalysisResult['categories'];
}

export function SEOCategoryScore({ categories }: SEOCategoryScoreProps) {
  const catList = Object.values(categories);

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Điểm Theo 9 Hạng Mục SEO</h4>
      {catList.map((cat) => {
        const percent = Math.round((cat.score / cat.maxScore) * 100);
        let barBg = 'bg-emerald-500';
        if (percent < 50) barBg = 'bg-red-500';
        else if (percent < 75) barBg = 'bg-amber-500';

        return (
          <div key={cat.category} className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-gray-700 font-semibold">{cat.name}</span>
              <span className="text-gray-500">{cat.score}/{cat.maxScore} điểm</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${barBg} transition-all duration-500 rounded-full`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import React from 'react';
import type { GeoAnalysisResult, GeoScore } from '@/lib/seo/types';

export default function GeoScoreMatrix({ data }: { data?: GeoAnalysisResult }) {
  if (!data) return null;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (val >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (val >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Điểm GEO Visibility Tổng Thể</h3>
          <p className="text-xs text-gray-500">Khả năng thương hiệu {data.brand} xuất hiện & trích dẫn trong các công cụ AI (Gemini, Groq, OpenRouter...)</p>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-xl font-black ${getScoreColor(data.overallScore)}`}>
          {data.overallScore}/100
        </div>
      </div>

      {/* Per Engine Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.scores.map((score: GeoScore) => (
          <div key={score.engine} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{score.engine}</span>
              <span className="text-sm font-bold text-blue-600">{score.aiVisibilityScore}/100</span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Entity Completeness</span>
                <span className="font-semibold text-gray-900">{score.entityCompleteness}%</span>
              </div>
              <div className="flex justify-between">
                <span>Knowledge Coverage</span>
                <span className="font-semibold text-gray-900">{score.knowledgeCoverage}%</span>
              </div>
              <div className="flex justify-between">
                <span>Citation Quality</span>
                <span className="font-semibold text-gray-900">{score.citationQuality}%</span>
              </div>
              <div className="flex justify-between">
                <span>Semantic Richness</span>
                <span className="font-semibold text-gray-900">{score.semanticRichness}%</span>
              </div>
            </div>

            {score.sampleResponse && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Mẫu phản hồi AI:</p>
                <p className="text-xs text-gray-600 line-clamp-3 italic mt-1 bg-gray-50 p-2 rounded-lg">
                  &ldquo;{score.sampleResponse}&rdquo;
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <span>💡</span> Khuyến Nghị Tối Ưu GEO
          </h4>
          <ul className="space-y-1.5 text-xs text-gray-700">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

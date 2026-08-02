'use client';

import React from 'react';
import type { KeywordCluster, Keyword } from '@/lib/seo/types';

export default function KeywordTable({
  clusters = [],
  questions = [],
}: {
  clusters?: KeywordCluster[];
  questions?: Keyword[];
}) {
  const getIntentBadge = (intent: string) => {
    switch (intent) {
      case 'transactional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'commercial':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'informational':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Clusters */}
      {clusters.map((cluster, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">{cluster.name}</h3>
              <p className="text-xs text-gray-500">Pillar: <span className="font-semibold text-blue-600">{cluster.pillarKeyword}</span></p>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-50 text-[#005ba7] border border-blue-200 uppercase">
              Cơ hội: {cluster.contentOpportunity}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                <tr>
                  <th className="p-2.5">Từ khóa</th>
                  <th className="p-2.5">Ý định tìm kiếm</th>
                  <th className="p-2.5">Volume ước tính</th>
                  <th className="p-2.5">Độ khó (KD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {cluster.keywords.map((kw, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="p-2.5 font-bold text-gray-900">{kw.keyword}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${getIntentBadge(kw.intent)}`}>
                        {kw.intent}
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-600">{kw.volume ? kw.volume.toLocaleString() : 'N/A'}</td>
                    <td className="p-2.5 text-gray-600">{kw.difficulty !== undefined ? `${kw.difficulty}/100` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Questions */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>❓</span> Từ Khóa Dạng Câu Hỏi (FAQs)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {questions.map((q, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-medium text-gray-800">
                {q.keyword}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

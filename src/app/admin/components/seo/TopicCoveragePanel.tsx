'use client';

import React from 'react';
import { SearchIntentResult } from '@/lib/seo/analyzer/types';

interface TopicCoveragePanelProps {
  intent: SearchIntentResult;
}

export function TopicCoveragePanel({ intent }: TopicCoveragePanelProps) {
  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Search Intent & Độ Bao Phủ</h4>
        <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
          {intent.primaryIntent}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 font-medium">Bao phủ chủ đề ngành cửa:</span>
          <span className="font-bold text-[#005ba7]">{intent.coverageScore}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#005ba7] h-full rounded-full transition-all duration-500"
            style={{ width: `${intent.coverageScore}%` }}
          />
        </div>

        {intent.missingTopics.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-[11px] text-gray-500 font-semibold block mb-1">Chủ đề nên bổ sung:</span>
            <div className="flex flex-wrap gap-1">
              {intent.missingTopics.map((topic, i) => (
                <span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200/50 px-2 py-0.5 rounded-md">
                  + {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

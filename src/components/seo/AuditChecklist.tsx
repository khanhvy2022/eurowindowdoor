'use client';

import React from 'react';
import type { AuditIssue, AuditChecklistItem } from '@/lib/seo/types';

export default function AuditChecklist({
  checklist = [],
  issues = [],
}: {
  checklist?: AuditChecklistItem[];
  issues?: AuditIssue[];
}) {
  const getBadgeStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Checklist */}
      {checklist.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Checklist Ưu Tiên Cần Sửa
            </h3>
            <span className="text-xs text-gray-500">{checklist.length} công việc</span>
          </div>

          <div className="space-y-2.5">
            {checklist.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 transition-all"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-[#005ba7] font-black text-xs shrink-0">
                  {item.priority}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900">{item.task}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getBadgeStyle(item.severity)}`}>
                      {item.severity}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 text-gray-600 border border-gray-200">
                      Tác động: {item.estimatedImpact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Phân mục: {item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Issue List */}
      {issues.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span>⚠️</span> Tất Cả Vấn Đề Phát Hiện ({issues.length})
          </h3>

          <div className="divide-y divide-gray-100">
            {issues.map((issue) => (
              <div key={issue.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">{issue.title}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase ${getBadgeStyle(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{issue.description}</p>
                <p className="text-xs text-blue-600 font-medium">💡 Gợi ý: {issue.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

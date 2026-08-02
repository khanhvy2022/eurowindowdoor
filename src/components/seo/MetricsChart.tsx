'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { SearchConsoleMetrics } from '@/lib/seo/types';

export default function MetricsChart({
  data,
  title = 'Clicks & Impressions Trend',
}: {
  data: SearchConsoleMetrics[];
  title?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center text-xs text-gray-500">
        Không có dữ liệu biểu đồ.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">28 ngày gần nhất</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005ba7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#005ba7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <YAxis tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              name="Clicks"
              stroke="#005ba7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#clicksGrad)"
            />
            <Area
              type="monotone"
              dataKey="impressions"
              name="Impressions"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#impressionsGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

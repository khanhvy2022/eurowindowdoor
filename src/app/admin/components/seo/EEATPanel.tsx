'use client';

import React from 'react';
import { EEATSignals } from '@/lib/seo/analyzer/types';

interface EEATPanelProps {
  eeat: EEATSignals;
}

export function EEATPanel({ eeat }: EEATPanelProps) {
  const signals = [
    { label: 'Tác giả & Đội ngũ chuyên gia', active: eeat.hasAuthor },
    { label: 'Nhãn hiệu Eurowindow', active: eeat.hasBrand },
    { label: 'Thông số & Số liệu thực tế', active: eeat.hasMetrics },
    { label: 'Thông tin liên hệ / Showroom', active: eeat.hasContact },
  ];

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tín Hiệu Đáng Tin Cậy (E-E-A-T)</h4>
        <span className="text-xs font-black text-[#005ba7] bg-blue-50 px-2.5 py-0.5 rounded-full">
          {eeat.trustScore}/100%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {signals.map((sig, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              sig.active
                ? 'bg-emerald-50/50 border-emerald-200/60 text-emerald-900 font-medium'
                : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}
          >
            <span>{sig.active ? '🛡️' : '⚪'}</span>
            <span className="text-[11px] leading-tight">{sig.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

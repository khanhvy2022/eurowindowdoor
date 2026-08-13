'use client';

import React, { useState } from 'react';

interface KeywordInputProps {
  focusKeyword: string;
  secondaryKeywords: string[];
  onChangeFocus: (val: string) => void;
  onChangeSecondary: (keywords: string[]) => void;
}

export function KeywordInput({
  focusKeyword,
  secondaryKeywords,
  onChangeFocus,
  onChangeSecondary,
}: KeywordInputProps) {
  const [secInput, setSecInput] = useState('');

  const handleAddSec = () => {
    if (!secInput.trim()) return;
    if (!secondaryKeywords.includes(secInput.trim())) {
      onChangeSecondary([...secondaryKeywords, secInput.trim()]);
    }
    setSecInput('');
  };

  const handleRemoveSec = (kw: string) => {
    onChangeSecondary(secondaryKeywords.filter((k) => k !== kw));
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cấu Hình Từ Khóa SEO</h4>
      
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Từ khóa chính (Focus Keyword)</label>
        <input
          type="text"
          value={focusKeyword}
          onChange={(e) => onChangeFocus(e.target.value)}
          placeholder="VD: Cửa nhôm Eurowindow"
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#005ba7] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Từ khóa phụ & LSI</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={secInput}
            onChange={(e) => setSecInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSec();
              }
            }}
            placeholder="Nhập từ khóa phụ rồi nhấn Thêm"
            className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#005ba7] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddSec}
            className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-[#005ba7] hover:bg-blue-100 rounded-xl transition"
          >
            + Thêm
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {secondaryKeywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-full font-medium"
            >
              {kw}
              <button
                type="button"
                onClick={() => handleRemoveSec(kw)}
                className="text-gray-400 hover:text-red-500 font-bold ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

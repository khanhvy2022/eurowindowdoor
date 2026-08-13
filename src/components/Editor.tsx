'use client';

import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Editor({ value, onChange, placeholder = 'Nhập nội dung bài viết...' }: EditorProps) {
  return (
    <div className="bg-white space-y-2">
      <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-t-xl border border-gray-200 text-xs font-semibold text-gray-600">
        <span>📝 Trình Soạn Thảo HTML / Văn Bản Bài Viết</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={14}
        className="w-full p-4 border border-gray-200 rounded-b-xl text-xs sm:text-sm font-mono leading-relaxed focus:ring-1 focus:ring-[#005ba7] focus:outline-none bg-slate-50/50"
      />
    </div>
  );
}

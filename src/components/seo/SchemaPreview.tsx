'use client';

import React, { useState } from 'react';

export default function SchemaPreview({
  jsonLd,
  isValid = true,
  errors = [],
}: {
  jsonLd: string;
  isValid?: boolean;
  errors?: string[];
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonLd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">Mã JSON-LD Schema</h3>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
              isValid
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {isValid ? 'Valid Schema' : 'Validation Error'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 bg-blue-50 text-[#005ba7] hover:bg-blue-100 rounded-lg text-xs font-bold transition-all"
        >
          {copied ? '✓ Đã sao chép' : '📋 Sao chép JSON-LD'}
        </button>
      </div>

      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
          <p className="font-bold">Cảnh báo Validation:</p>
          <ul className="list-disc list-inside">
            {errors.map((e, idx) => (
              <li key={idx}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto font-mono max-h-96">
        <code>{jsonLd}</code>
      </pre>
    </div>
  );
}

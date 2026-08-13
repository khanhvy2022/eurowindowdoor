'use client';

import React from 'react';

interface SEOScoreCircleProps {
  score: number;
  status: string;
}

export function SEOScoreCircle({ score, status }: SEOScoreCircleProps) {
  let color = 'text-red-500 stroke-red-500 bg-red-50';
  let badgeColor = 'bg-red-100 text-red-700';
  let statusText = 'CẦN CẢI THIỆN';

  if (score >= 85) {
    color = 'text-emerald-600 stroke-emerald-600 bg-emerald-50';
    badgeColor = 'bg-emerald-100 text-emerald-800';
    statusText = 'XUẤT SẮC';
  } else if (score >= 70) {
    color = 'text-blue-600 stroke-blue-600 bg-blue-50';
    badgeColor = 'bg-blue-100 text-blue-800';
    statusText = 'TỐT';
  } else if (score >= 50) {
    color = 'text-amber-500 stroke-amber-500 bg-amber-50';
    badgeColor = 'bg-amber-100 text-amber-800';
    statusText = 'KHÁ';
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 90 90">
          <circle
            cx="45"
            cy="45"
            r={radius}
            className="stroke-gray-100 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="45"
            cy="45"
            r={radius}
            className={`${color} fill-none transition-all duration-700 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-gray-900 leading-none">{score}</span>
          <span className="text-[10px] text-gray-400 font-semibold mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`mt-3 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${badgeColor}`}>
        {statusText}
      </span>
    </div>
  );
}

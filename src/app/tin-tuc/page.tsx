import React, { Suspense } from 'react';
import NewsContent from './NewsContent';

export const metadata = {
  title: 'Tin tức Eurowindow',
  description: 'Cập nhật các tin tức, sự kiện và khuyến mãi mới nhất từ Eurowindow.',
};

export default function TinTucPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#005ba7] border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <NewsContent />
    </Suspense>
  );
}

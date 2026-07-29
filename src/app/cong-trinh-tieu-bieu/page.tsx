import React, { Suspense } from 'react';
import ProjectsContent from './ProjectsContent';

export const metadata = {
  title: 'Công trình tiêu biểu | Eurowindow',
  description: 'Các dự án và công trình tiêu biểu sử dụng sản phẩm cửa và vách nhôm kính của Eurowindow trên toàn quốc.',
};

export default function CongTrinhTieuBieuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#005ba7] border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <ProjectsContent />
    </Suspense>
  );
}

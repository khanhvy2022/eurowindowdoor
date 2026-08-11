import React, { Suspense } from 'react';
import ProjectsContent from './ProjectsContent';



export default function CongTrinhTieuBieuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#005ba7] border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <ProjectsContent />
    </Suspense>
  );
}

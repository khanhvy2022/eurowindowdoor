import React, { Suspense } from 'react';
import ProductsContent from './ProductsContent';

export default function SanPhamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductsContent />
    </Suspense>
  );
}

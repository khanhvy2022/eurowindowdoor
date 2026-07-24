'use client';

import React from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './ImageWithFallback';

export const AdsBanner: React.FC = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <Link href="/tin-tuc/chuong-trinh-khuyen-mai-dac-biet-danh-cho-khach-hang-mua-kinh-dien-eurowindow" className="block relative w-full h-[110px] sm:h-[130px] rounded-xl overflow-hidden shadow-md border border-gray-100 group">
          <ImageWithFallback
            src="/images/eurowindow-banner-san-pham-trang-chu.png.webp"
            alt="Chương trình khuyến mãi Eurowindow"
            fill
            sizes="100vw"
            className="object-cover group-hover:scale-[1.01] transition-transform duration-300"
          />
        </Link>
      </div>
    </section>
  );
};

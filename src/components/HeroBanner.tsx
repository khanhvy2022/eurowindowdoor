'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domMax, AnimatePresence } from 'framer-motion';
import { slidesData } from '@/data/slides';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export const HeroBanner: React.FC = () => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slidesData.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1));
  }, []);

  // Continuous auto-play timer (5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  // Framer Motion Drag Handler
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = offset.x;
    if (swipe < -50) {
      handleNext();
    } else if (swipe > 50) {
      handlePrev();
    }
  };

  return (
    <section className="relative w-full overflow-hidden mt-[105px] group select-none font-sans touch-pan-y">
      {/* SEO: Page H1 — visually hidden, present for crawlers and screen readers */}
      <h1 className="sr-only">
        {language === 'ENG'
          ? 'Eurowindow – Aluminium Doors, uPVC Doors, Wood Doors & Glass Systems'
          : 'Eurowindow – Cửa Nhôm, Cửa Nhựa uPVC, Cửa Gỗ, Vách Kính Tiêu Chuẩn Châu Âu'}
      </h1>
      {/* Top Countdown Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-40">
        <div 
          key={currentIndex}
          className="h-full bg-amber-400 animate-progress" 
          style={{ animationDuration: '5000ms' }}
        />
      </div>

      <LazyMotion features={domMax}>
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[550px] xl:h-[650px] overflow-hidden">
        <m.div 
          className="flex h-full cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ translateX: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
        >
          {slidesData.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative min-w-full h-full flex-shrink-0"
            >
              <ImageWithFallback
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="100vw"
                priority={idx === 0}
                className="object-cover object-center w-full h-full transform scale-100 group-hover:scale-[1.02] transition-transform duration-1000"
              />
            </div>
          ))}
        </m.div>
      </div>
      </LazyMotion>

      {/* Floating Bottom Quick Features Ribbon */}
      <div className="absolute bottom-4 left-6 right-6 hidden lg:flex items-center justify-between z-30 bg-slate-950/60 backdrop-blur-xl border border-white/15 px-8 py-3.5 rounded-2xl shadow-2xl text-white text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005ba7] flex items-center justify-center font-bold text-amber-300">✓</div>
          <div>
            <div className="font-extrabold uppercase text-[11px]">{language === 'ENG' ? '22+ Years Leadership' : '22+ Năm Dẫn Đầu Thị Trường'}</div>
            <div className="text-[10px] text-slate-300">{language === 'ENG' ? 'European standard quality' : 'Tiêu chuẩn chất lượng Châu Âu'}</div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/20" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005ba7] flex items-center justify-center font-bold text-amber-300">★</div>
          <div>
            <div className="font-extrabold uppercase text-[11px]">{language === 'ENG' ? 'National Brand Award' : 'Thương Hiệu Quốc Gia'}</div>
            <div className="text-[10px] text-slate-300">{language === 'ENG' ? 'Trusted by 50,000+ projects' : 'Tin dùng bởi 50.000+ công trình'}</div>
          </div>
        </div>

        <div className="h-6 w-px bg-white/20" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005ba7] flex items-center justify-center font-bold text-amber-300">🛡</div>
          <div>
            <div className="font-extrabold uppercase text-[11px]">{language === 'ENG' ? '10-Year Warranty' : 'Bảo Hành Đến 10 Năm'}</div>
            <div className="text-[10px] text-slate-300">{language === 'ENG' ? 'Genuine customer care 24/7' : 'Chăm sóc khách hàng 24/7'}</div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="btn-tactile absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-950/40 hover:bg-[#005ba7] text-white rounded-full flex items-center justify-center z-30 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-sm hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Previous Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="btn-tactile absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-slate-950/40 hover:bg-[#005ba7] text-white rounded-full flex items-center justify-center z-30 transition-all opacity-100 lg:opacity-0 group-hover:opacity-100 shadow-xl backdrop-blur-sm hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Next Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Pagination Dots */}
      <div className="absolute bottom-5 lg:bottom-16 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center space-x-2 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
        {slidesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-4 rounded-full transition-all duration-500 ease-out ${
              idx === currentIndex ? 'bg-amber-400 w-10' : 'bg-white/50 hover:bg-white w-4'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

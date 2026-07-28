'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <section 
      className="relative w-full overflow-hidden mt-[105px] group select-none font-sans"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Countdown Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-40">
        <div 
          key={currentIndex}
          className="h-full bg-amber-400 animate-progress" 
          style={{ animationDuration: '5000ms' }}
        />
      </div>

      {/* Sliding Track */}
      <div className="relative w-full h-[360px] sm:h-[500px] md:h-[600px] lg:h-[680px]">
        <div 
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
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
                className="object-cover object-center w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-1000"
              />

              {/* Ultra Rich Multi-Layer Gradient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none hidden md:block" />

              {/* Floating Hero Content Glass Box */}
              <AnimatePresence>
                {idx === currentIndex && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-20 sm:bottom-24 left-6 sm:left-14 max-w-2xl text-white z-20"
                  >
                    <div className="inline-flex items-center gap-2 bg-[#005ba7]/90 backdrop-blur-md text-amber-300 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-lg border border-blue-400/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>EUROWINDOW ARCHITECTURAL SOLUTIONS</span>
                    </div>
                    
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black drop-shadow-md leading-[1.15] mb-5 tracking-tight text-white">
                      {language === 'ENG' ? slide.titleEn : slide.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        href={slide.link}
                        className="btn-tactile inline-flex items-center px-7 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 gap-2"
                      >
                        <span>{t('hero_discover')}</span>
                        <span className="text-base">&rarr;</span>
                      </Link>

                      <Link
                        href="/lien-he"
                        className="btn-tactile inline-flex items-center px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs uppercase tracking-wider rounded-full border border-white/30 transition-all hover:scale-105"
                      >
                        {language === 'ENG' ? 'Get A Quote' : 'Nhận Báo Giá'}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Bottom Quick Features Ribbon */}
      <div className="absolute bottom-4 left-6 right-6 hidden lg:flex items-center justify-between z-30 bg-slate-950/60 backdrop-blur-xl border border-white/15 px-8 py-3.5 rounded-2xl shadow-2xl text-white text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005ba7] flex items-center justify-center font-bold text-amber-300">✓</div>
          <div>
            <div className="font-extrabold uppercase text-[11px]">{language === 'ENG' ? '22+ Years Leadership' : '22+ Năm Dẫn Đầu Market'}</div>
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
        className="btn-tactile absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-950/60 hover:bg-[#005ba7] text-white rounded-full flex items-center justify-center z-30 transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Previous Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="btn-tactile absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-950/60 hover:bg-[#005ba7] text-white rounded-full flex items-center justify-center z-30 transition-all opacity-80 lg:opacity-0 group-hover:opacity-100 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 border border-white/20"
        aria-label="Next Slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Pagination Dots */}
      <div className="absolute bottom-5 lg:bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl">
        {slidesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
              idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white w-2.5'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

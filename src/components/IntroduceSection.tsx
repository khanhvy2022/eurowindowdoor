'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export const IntroduceSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-[#005ba7] font-bold text-xs uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full inline-block mb-3">
            {t('intro_badge')}
          </span>
          <h2 className="home_title text-3xl sm:text-4xl font-extrabold text-[#005ba7] uppercase">
            {t('intro_title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Column: Rich Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed"
          >
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 border-l-4 border-[#005ba7] p-5 rounded-r-2xl shadow-sm">
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {t('intro_highlight')}
              </p>
            </div>
            
            <p className="text-gray-600">
              {t('intro_p1')}
            </p>

            {/* 3 Pill Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-[#005ba7] mb-1">22+</div>
                <div className="text-[11px] font-bold uppercase text-gray-600">{t('intro_stat1_label')}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-amber-600 mb-1">5</div>
                <div className="text-[11px] font-bold uppercase text-gray-600">{t('intro_stat2_label')}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-2xl font-black text-emerald-600 mb-1">{t('intro_stat3_value')}</div>
                <div className="text-[11px] font-bold uppercase text-gray-600">{t('intro_stat3_label')}</div>
              </div>
            </div>

            <div className="pt-3">
              <Link 
                href="/gioi-thieu" 
                className="btn-tactile inline-flex items-center justify-center bg-[#005ba7] hover:bg-[#00386c] text-white font-extrabold text-xs uppercase rounded-full px-8 py-3.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all gap-2"
              >
                <span>{t('intro_btn')}</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: High-Res Glassmorphic Image with Floating Stat Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative flex justify-center"
          >
            <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white ring-1 ring-slate-100 group">
              <ImageWithFallback
                src="/images/vach-nhom-kinh-lon-eurowindow-mat-dung.png.webp"
                alt={t('intro_img_arch_name')}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">{t('intro_img_arch_label')}</span>
                <h3 className="text-lg font-extrabold">{t('intro_img_arch_name')}</h3>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -left-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 items-center gap-3 hidden sm:flex">
              <div className="w-12 h-12 rounded-xl bg-[#005ba7] text-white flex items-center justify-center font-black text-xl shadow-md">
                22
              </div>
              <div>
                <div className="text-xs font-extrabold text-slate-900 uppercase">{t('intro_img_badge_title')}</div>
                <div className="text-[10px] text-gray-500 font-medium">{t('intro_img_badge_sub')}</div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

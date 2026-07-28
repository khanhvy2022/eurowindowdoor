'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from './icons';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export const ProductCategories: React.FC = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'cuanhom',
      title: t('cat_alum_title'),
      subtitle: t('cat_alum_sub'),
      badge: t('cat_alum_badge'),
      badgeColor: 'bg-[#005ba7]',
      image: '/images/cua-nhom-eurowindow-tieu-chuan-chau-au.jpg.webp',
      link: '/san-pham?cat=Cửa+nhôm',
      specs: [t('cat_alum_spec1'), t('cat_alum_spec2'), t('cat_alum_spec3')]
    },
    {
      id: 'upvc',
      title: t('cat_upvc_title'),
      subtitle: t('cat_upvc_sub'),
      badge: t('cat_upvc_badge'),
      badgeColor: 'bg-emerald-600',
      image: '/images/cua-upvc-eurowindow-tieu-chuan-duc.jpg.webp',
      link: '/san-pham?cat=Cửa+uPVC',
      specs: [t('cat_upvc_spec1'), t('cat_upvc_spec2'), t('cat_upvc_spec3')]
    },
    {
      id: 'cuago',
      title: t('cat_wood_title'),
      subtitle: t('cat_wood_sub'),
      badge: t('cat_wood_badge'),
      badgeColor: 'bg-amber-600',
      image: '/images/cua-go-eurowindow-sang-trong.jpg.webp',
      link: '/san-pham?cat=Cửa+gỗ',
      specs: [t('cat_wood_spec1'), t('cat_wood_spec2'), t('cat_wood_spec3')]
    }
  ];

  const smartProducts = [
    { titleKey: 'smart_p1_title', tagKey: 'smart_p1_tag', icon: '/images/kinh-an-toan-low-e-eurowindow-cach-nhiet.png.webp', link: '/san-pham/kinh-dien-doi-mau' },
    { titleKey: 'smart_p2_title', tagKey: 'smart_p2_tag', icon: '/images/cua-tu-dong-thong-minh-eurowindow-cam-bien.png.webp', link: '/san-pham/cua-truot-tu-dong-2-canh' },
    { titleKey: 'smart_p3_title', tagKey: 'smart_p3_tag', icon: '/images/cua-cuon-nhom-eurowindow-chong-giat.png.webp', link: '/san-pham/cua-cuon-nhom-khe-thoang-easd45' }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden font-sans"
    >
      
      {/* Background Decorative Ambient Orbs */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#005ba7] font-bold text-xs uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full inline-block mb-3 shadow-sm border border-blue-200/50">
            {t('prod_badge')}
          </span>
          <h2 className="home_title text-3xl sm:text-4xl font-black text-[#005ba7] uppercase tracking-wide">
            {t('prod_title')}
          </h2>
          <p className="text-slate-600 text-sm mt-4 leading-relaxed max-w-xl mx-auto">
            {t('prod_desc')}
          </p>
        </motion.div>

        {/* 3 Main Product Category Cards Grid + Right Highlight Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {categories.map((cat, idx) => (
            <motion.div 
              key={cat.id} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group relative h-[470px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-slate-200/80 flex flex-col justify-between"
            >
              {/* Image & Gradient Backdrop */}
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/10" />
              </div>

              {/* Badge Header */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className={`${cat.badgeColor} text-white text-[10px] font-extrabold uppercase px-3.5 py-1.5 rounded-full shadow-lg tracking-wider`}>
                  {cat.badge}
                </span>
                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow border border-white/50">
                  {t('genuine')}
                </span>
              </div>

              {/* Card Footer Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 space-y-3.5">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-amber-300 group-hover:text-amber-400 transition-colors drop-shadow-md">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Specs List */}
                <ul className="space-y-1.5 pt-2 border-t border-white/15">
                  {cat.specs.map((spec, sIdx) => (
                    <li key={sIdx} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span className="truncate">{spec}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link 
                    href={cat.link} 
                    className="inline-flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#005ba7] to-blue-700 hover:from-[#004077] hover:to-blue-800 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md hover:scale-[1.02] tracking-wider gap-2"
                  >
                    <span>{t('see_all_models')}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Right Smart Product High-Tech Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-[#005ba7] via-blue-900 to-slate-950 rounded-3xl p-6 text-white flex flex-col justify-between shadow-2xl border border-blue-800/50 relative overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-6">
                <h3 className="text-xl font-black uppercase tracking-wide text-amber-300 flex items-center gap-2">
                  {t('smart_col_title')}
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black uppercase px-2.5 py-1 rounded shadow">NEW 2026</span>
              </div>
              
              <div className="space-y-3.5">
                {smartProducts.map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.link}
                    className="group flex items-center space-x-3.5 p-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all duration-300 hover:translate-x-2 border border-white/10 shadow-sm"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-xl p-1.5 shadow">
                      <ImageWithFallback 
                        src={item.icon} 
                        alt={t(item.titleKey)} 
                        fill
                        sizes="48px" 
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold uppercase group-hover:text-amber-300 transition-colors truncate">
                        {t(item.titleKey)}
                      </div>
                      <span className="text-[10px] text-slate-300 block truncate mt-0.5">
                        {t(item.tagKey)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/15">
              <Link 
                href="/san-pham?cat=Cửa+thông+minh" 
                className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.02] gap-2"
              >
                <span>{t('smart_col_btn')}</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

        </div>

      </div>
    </motion.section>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import { projectsData } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';

export const FeaturedProjects: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'ENG';
  const [activeCategory, setActiveCategory] = useState<'quoc-gia' | 'chung-cu' | 'dan-dung'>('quoc-gia');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const filteredProjects = projectsData.filter((p) => p.category === activeCategory);
  const mainProject = filteredProjects[currentSlideIndex] || filteredProjects[0];
  const secondaryProjects = filteredProjects.filter((_, idx) => idx !== currentSlideIndex);

  // Auto-slide vertical dots for active category
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % filteredProjects.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [filteredProjects.length, activeCategory]);

  const handleCategoryChange = (cat: 'quoc-gia' | 'chung-cu' | 'dan-dung') => {
    setActiveCategory(cat);
    setCurrentSlideIndex(0);
  };

  return (
    <section className="py-16 bg-white font-sans overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          {/* Left Text Column (4 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-4"
          >
            <h2 className="text-3xl font-extrabold text-[#005ba7] uppercase relative inline-block pb-3">
              {t('proj_title')}
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#005ba7]" />
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              {t('proj_desc')}
            </p>

            <div className="pt-2">
              <Link
                href="/cong-trinh-tieu-bieu"
                className="inline-block px-6 py-3 bg-[#005ba7] hover:bg-[#004077] text-white text-xs font-bold uppercase rounded-full shadow transition-all hover:scale-105"
              >
                {t('proj_all_btn')}
              </Link>
            </div>
          </motion.div>

          {/* Middle Category Tabs (3 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 flex flex-col space-y-4"
          >
            {/* Tab 1 */}
            <button
              onClick={() => handleCategoryChange('quoc-gia')}
              className={`flex items-center p-4 rounded-xl shadow-sm border transition-all text-left ${
                activeCategory === 'quoc-gia'
                  ? 'bg-[#005ba7] text-white border-[#005ba7]'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-white/20">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">
                {t('proj_tab_national')}
              </span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => handleCategoryChange('chung-cu')}
              className={`flex items-center p-4 rounded-xl shadow-sm border transition-all text-left ${
                activeCategory === 'chung-cu'
                  ? 'bg-[#005ba7] text-white border-[#005ba7]'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[#005ba7]/10 text-[#005ba7]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z"/>
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">
                {t('proj_tab_towers')}
              </span>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => handleCategoryChange('dan-dung')}
              className={`flex items-center p-4 rounded-xl shadow-sm border transition-all text-left ${
                activeCategory === 'dan-dung'
                  ? 'bg-[#005ba7] text-white border-[#005ba7]'
                  : 'bg-white text-gray-700 border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[#005ba7]/10 text-[#005ba7]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide">
                {t('proj_tab_civil')}
              </span>
            </button>
          </motion.div>

          {/* Right Main Featured Project Card (5 cols) */}
          {mainProject && (() => {
            const mainName = isEn && mainProject.nameEn ? mainProject.nameEn : mainProject.name;
            const mainLocation = isEn && mainProject.locationEn ? mainProject.locationEn : mainProject.location;

            return (
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-5 relative h-80 lg:h-[340px] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainProject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative block w-full h-full"
                  >
                    <Link href={`/cong-trinh-tieu-bieu/${mainProject.slug}`} className="relative block w-full h-full">
                  <ImageWithFallback
                    key={mainProject.id}
                    src={mainProject.image}
                    alt={mainName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-6 left-6 right-16 text-white">
                      <h3 className="text-base font-bold uppercase tracking-wide drop-shadow-sm group-hover:text-amber-300 transition-colors">
                        {mainName}
                      </h3>
                      <p className="text-xs text-amber-300 mt-0.5">{mainLocation} • {mainProject.year}</p>
                    </div>
                  </Link>
                </motion.div>
                </AnimatePresence>

                {/* Vertical Dots Slider Container */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#005ba7] rounded-full px-2.5 py-4 flex flex-col space-y-2.5 shadow-lg z-20">
                  {filteredProjects.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlideIndex(dotIdx)}
                      className={`rounded-full transition-all duration-300 ${
                        dotIdx === currentSlideIndex 
                          ? 'w-3 h-3 bg-amber-400 scale-110' 
                          : 'w-2.5 h-2.5 bg-white/40 hover:bg-white'
                      }`}
                      aria-label={`Project slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })()}
        </div>

        {/* Bottom 2 Grid Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryProjects.map((proj, idx) => {
            const projName = isEn && proj.nameEn ? proj.nameEn : proj.name;
            const projLocation = isEn && proj.locationEn ? proj.locationEn : proj.location;

            return (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl group"
              >
                <Link href={`/cong-trinh-tieu-bieu/${proj.slug}`} className="relative block w-full h-full">
                  <ImageWithFallback
                    src={proj.image}
                    alt={projName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-sm font-bold uppercase tracking-wide mb-1 group-hover:text-amber-300 transition-colors">
                      {projName}
                    </h3>
                    <p className="text-xs text-white/80 flex items-center">
                      <svg className="w-3 h-3 mr-1 fill-current text-amber-400" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {projLocation} • {proj.year}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

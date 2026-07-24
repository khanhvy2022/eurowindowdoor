'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { projectsData } from '@/data/projects';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

function ProjectsContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const categoryMap: Record<string, string> = {
    'Tất cả': t('doc_cat_all'),
    'Công trình cấp quốc gia': t('proj_tab_national'),
    'Tòa nhà VP - Chung cư': t('proj_tab_towers'),
    'Công trình dân dụng': t('proj_tab_civil'),
  };

  const categories = ['Tất cả', 'Công trình cấp quốc gia', 'Tòa nhà VP - Chung cư', 'Công trình dân dụng'];
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    if (catParam === 'quoc-gia') setSelectedCategory('Công trình cấp quốc gia');
    else if (catParam === 'chung-cu') setSelectedCategory('Tòa nhà VP - Chung cư');
    else if (catParam === 'dan-dung') setSelectedCategory('Công trình dân dụng');
  }, [catParam]);

  const filteredProjects = selectedCategory === 'Tất cả'
    ? projectsData
    : projectsData.filter((p) => {
        if (selectedCategory === 'Công trình cấp quốc gia') return p.category === 'quoc-gia';
        if (selectedCategory === 'Tòa nhà VP - Chung cư') return p.category === 'chung-cu';
        if (selectedCategory === 'Công trình dân dụng') return p.category === 'dan-dung';
        return true;
      });

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">{t('proj_page_title')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('home')} / {t('nav_projects')} ({projectsData.length} {t('proj_completed_count')})</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#005ba7] text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {categoryMap[cat] || cat}
              </button>
            ))}
          </div>

          {/* Projects List */}
          <div className="space-y-5">
            {filteredProjects.map((project) => {
              const projName = language === 'ENG' && project.nameEn ? project.nameEn : project.name;
              const projDesc = language === 'ENG' && project.descriptionEn ? project.descriptionEn : project.description;
              const catLabel = language === 'ENG' && project.categoryLabelEn ? project.categoryLabelEn : project.categoryLabel;
              const location = language === 'ENG' && project.locationEn ? project.locationEn : project.location;

              return (
                <Link
                  key={project.id}
                  href={`/cong-trinh-tieu-bieu/${project.slug}`}
                  className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="relative w-full sm:w-[280px] md:w-[340px] flex-shrink-0" style={{ minHeight: '200px' }}>
                    <ImageWithFallback
                      src={project.image}
                      alt={projName}
                      fill
                      sizes="(max-width: 640px) 100vw, 340px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      style={{ objectPosition: 'center' }}
                    />
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mb-2">
                        {catLabel}
                      </p>
                      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 group-hover:text-[#005ba7] transition-colors uppercase leading-snug mb-3">
                        {projName}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {projDesc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">
                        📍 {location} &nbsp;·&nbsp; {project.year}
                      </span>
                      <span className="text-xs font-bold text-[#005ba7] group-hover:underline">
                        {t('proj_view_detail')} &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

export default function CongTrinhTieuBieuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProjectsContent />
    </Suspense>
  );
}

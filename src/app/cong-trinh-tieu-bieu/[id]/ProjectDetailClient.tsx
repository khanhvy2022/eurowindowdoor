'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';
import { Project } from '@/data/projects';

interface ProjectDetailClientProps {
  project: Project;
  related: Project[];
}

export function ProjectDetailClient({ project, related }: ProjectDetailClientProps) {
  const { language, t } = useLanguage();

  const projName = language === 'ENG' && project.nameEn ? project.nameEn : project.name;
  const projDesc = language === 'ENG' && project.descriptionEn ? project.descriptionEn : project.description;
  const projSolution = language === 'ENG' && project.solutionEn ? project.solutionEn : project.solution;
  const catLabel = language === 'ENG' && project.categoryLabelEn ? project.categoryLabelEn : project.categoryLabel;
  const location = language === 'ENG' && project.locationEn ? project.locationEn : project.location;

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="pt-[130px] pb-20">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#005ba7]">{t('home')}</Link>
            <span>/</span>
            <Link href="/cong-trinh-tieu-bieu" className="hover:text-[#005ba7]">{t('nav_projects')}</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{projName}</span>
          </nav>

          {/* HERO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative min-h-[300px] md:min-h-[380px] bg-gray-100">
                <ImageWithFallback
                  src={project.image}
                  alt={project.imageAlt || projName}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                />
              </div>

              <div className="p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-3">
                    {catLabel}
                  </p>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 uppercase leading-snug mb-6">
                    {projName}
                  </h1>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[110px] shrink-0">{t('proj_location_label')}</span>
                      <span className="font-semibold text-gray-800">{location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[110px] shrink-0">{t('proj_year_label')}</span>
                      <span className="font-semibold text-gray-800">{project.year}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-gray-500 min-w-[110px] shrink-0">{t('proj_category_label')}</span>
                      <span className="font-semibold text-gray-800">{catLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <a
                    href="tel:0966994338"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-extrabold uppercase rounded-xl shadow-sm transition-all hover:scale-[1.01]"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                    Hotline: 0966 994 338
                  </a>
                  <Link
                    href="/lien-he"
                    className="flex items-center justify-center w-full py-3 bg-[#005ba7] hover:bg-[#004077] text-white text-sm font-bold uppercase rounded-xl shadow-sm transition-all hover:scale-[1.01]"
                  >
                    {t('proj_consult_similar')}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* PROJECT INFO CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-sm font-extrabold text-[#005ba7] uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">
              {t('proj_info_title')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t('proj_info_title'), value: projName },
                { label: t('proj_location_label'), value: location },
                { label: t('proj_year_label'), value: project.year },
                { label: t('proj_category_label'), value: catLabel },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">{label}</p>
                  <p className="text-sm font-bold text-gray-800 leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ARTICLE BODY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-base font-bold text-[#005ba7] mb-4 pb-2 border-b border-gray-100">
                  {t('proj_overview_title')}
                </h2>
                <p className="text-sm text-gray-700 leading-[1.9]">{projDesc}</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-7">
                <h2 className="text-base font-bold text-[#005ba7] mb-4 pb-2 border-b border-blue-200">
                  {t('proj_solution_title')}
                </h2>
                <p className="text-sm text-gray-700 leading-[1.9]">{projSolution}</p>
              </div>

              {project.gallery && project.gallery.length > 0 && (
                <div className="bg-[#005ba7]/5 rounded-2xl shadow-sm border border-blue-100 p-7">
                  <h2 className="text-base font-bold text-[#005ba7] mb-4 pb-2 border-b border-blue-200">
                    {t('proj_gallery_title')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-xl overflow-hidden shadow-sm group bg-gray-100"
                        style={{ aspectRatio: '16/10' }}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${projName} – ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-5 lg:sticky lg:top-[140px] self-start">
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">
                    {t('proj_other_title')}
                  </h3>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/cong-trinh-tieu-bieu/${rel.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={rel.image}
                            alt={language === 'ENG' && rel.nameEn ? rel.nameEn : rel.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-[#005ba7] leading-tight">
                          {language === 'ENG' && rel.nameEn ? rel.nameEn : rel.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/cong-trinh-tieu-bieu"
                    className="mt-4 block text-center text-xs text-[#005ba7] font-bold hover:underline"
                  >
                    {t('proj_all_btn')} →
                  </Link>
                </div>
              )}

              <div className="bg-[#005ba7] rounded-2xl p-6 text-white space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide opacity-80">{t('proj_need_consult')}</p>
                <p className="text-sm leading-relaxed opacity-90">{t('proj_need_consult_desc')}</p>
                <Link
                  href="/lien-he"
                  className="block w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-extrabold uppercase text-center rounded-xl transition-colors"
                >
                  {t('proj_free_consult_btn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingContact />
    </main>
  );
}

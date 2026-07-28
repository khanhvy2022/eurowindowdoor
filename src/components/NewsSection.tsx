'use client';

import React from 'react';
import Link from 'next/link';
import { ImageWithFallback } from './ImageWithFallback';
import { articlesData } from '@/data/news';
import { useLanguage } from '@/context/LanguageContext';

export const NewsSection: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'ENG';

  // Sort articles by published date descending (newest first)
  const sortedArticles = [...articlesData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Limit homepage to top 4 latest news articles only
  const latestArticles = sortedArticles.slice(0, 4);
  const featuredArticle = sortedArticles[0];

  return (
    <section className="py-28 bg-slate-50 relative overflow-hidden font-sans">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[#005ba7] font-bold text-xs uppercase tracking-widest bg-blue-100/70 px-3.5 py-1 rounded-full inline-block mb-2">
              {t('news_badge')}
            </span>
            <h2 className="home_title text-3xl font-extrabold text-[#005ba7] uppercase">
              {t('news_title')}
            </h2>
          </div>

          <Link 
            href="/tin-tuc" 
            className="btn-tactile hidden sm:inline-flex items-center text-xs font-bold text-[#005ba7] hover:text-amber-600 uppercase tracking-wider bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow transition-all gap-1.5"
          >
            <span>{t('news_all')}</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Grid - Exactly 4 Highlight Articles */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {latestArticles.map((item) => {
              const articleHref = `/tin-tuc/${item.slug}`;
              const itemTitle = isEn && item.titleEn ? item.titleEn : item.title;
              const itemCat = isEn && item.categoryEn ? item.categoryEn : item.category;
              const itemExcerpt = isEn ? (item.excerptEn || item.summaryEn || item.excerpt) : (item.summary || item.excerpt);

              return (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                      <ImageWithFallback
                        src={item.image}
                        alt={itemTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-3 left-3 bg-[#005ba7] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow tracking-wider">
                        {itemCat}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mb-2">
                        <span>📅 {item.date}</span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 line-clamp-2 group-hover:text-[#005ba7] transition-colors leading-snug">
                        <Link href={articleHref}>
                          {itemTitle}
                        </Link>
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed">
                        {itemExcerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link 
                      href={articleHref}
                      className="inline-flex items-center text-xs font-bold text-[#005ba7] hover:text-amber-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform gap-1"
                    >
                      <span>{t('news_detail_link')}</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Featured Highlight Box */}
          {featuredArticle && (() => {
            const featTitle = isEn && featuredArticle.titleEn ? featuredArticle.titleEn : featuredArticle.title;
            const featExcerpt = isEn ? (featuredArticle.excerptEn || featuredArticle.summaryEn || featuredArticle.excerpt) : (featuredArticle.summary || featuredArticle.excerpt);

            return (
              <div className="bg-gradient-to-br from-[#005ba7] via-blue-900 to-slate-950 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-between border border-blue-800/50">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow">
                      {t('news_featured_label')}
                    </span>
                    <span className="text-xs text-blue-200 font-mono">
                      {featuredArticle.date}
                    </span>
                  </div>

                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 group border border-white/10 shadow-lg">
                    <ImageWithFallback
                      src={featuredArticle.image}
                      alt={featTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  <h3 className="text-base font-extrabold mb-2 hover:text-amber-300 transition-colors leading-snug">
                    <Link href={`/tin-tuc/${featuredArticle.slug}`}>
                      {featTitle}
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {featExcerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                  <Link 
                    href={`/tin-tuc/${featuredArticle.slug}`} 
                    className="text-xs font-black text-amber-300 hover:text-amber-400 inline-flex items-center tracking-wider uppercase gap-1.5"
                  >
                    <span>{t('news_read_detail')}</span>
                    <span>&rarr;</span>
                  </Link>

                  <Link 
                    href="/tin-tuc" 
                    className="text-[11px] text-slate-300 hover:text-white underline"
                  >
                    {t('news_view_all_count')} ({articlesData.length})
                  </Link>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link 
            href="/tin-tuc" 
            className="btn-tactile inline-flex items-center text-xs font-bold text-white bg-[#005ba7] px-6 py-3 rounded-full shadow-lg"
          >
            <span>{t('news_all')} ({articlesData.length} {t('news_all_mobile')})</span>
            <span className="ml-2">&rarr;</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { articlesData } from '@/data/news';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export default function NewsContent({ initialCategory }: { initialCategory?: string }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Tất cả');

  useEffect(() => {
    if (catParam) {
      if (catParam.includes('sự kiện') || catParam.includes('nội bộ')) setSelectedCategory('Tin nội bộ');
      else if (catParam.includes('dự án')) setSelectedCategory('Tin dự án');
      else if (catParam.includes('khuyến mãi')) setSelectedCategory('Tin khuyến mãi');
      else if (catParam.includes('Tư vấn')) setSelectedCategory('Tư vấn');
    }
  }, [catParam]);

  const categories = language === 'ENG'
    ? ['All', 'Promotions', 'Internal News', 'Consultation', 'Projects']
    : ['Tất cả', 'Tin khuyến mãi', 'Tin nội bộ', 'Tư vấn', 'Tin dự án'];

  const filteredArticles = articlesData
    .filter((a) => {
      if (selectedCategory === 'Tất cả' || selectedCategory === 'All') return true;
      if (language === 'ENG') {
        const catEn = a.categoryEn || a.category;
        return catEn.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(catEn.toLowerCase());
      }
      return a.category === selectedCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">
              {t('news_title')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ENG' ? `Home / News (${filteredArticles.length} articles)` : `Trang chủ / Tin tức (${filteredArticles.length} bài viết)`}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase rounded-full transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#005ba7] text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedArticles.map((article) => {
              const articleTitle = (language === 'ENG' && article.titleEn) ? article.titleEn : article.title;
              const articleCat = (language === 'ENG' && article.categoryEn) ? article.categoryEn : article.category;
              const articleExcerpt = language === 'ENG' ? (article.excerptEn || article.summaryEn || article.excerpt) : (article.summary || article.excerpt);

              return (
                <div key={article.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                  <div>
                    <div className="relative w-full h-52 bg-slate-100">
                      <ImageWithFallback
                        src={article.image}
                        alt={articleTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#005ba7] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md shadow">
                        {articleCat}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                        <span>📅 {article.date}</span>
                      </div>
                      <h2 className="text-base font-bold text-gray-900 group-hover:text-[#005ba7] transition-colors mb-3 line-clamp-2 leading-snug">
                        <Link href={`/tin-tuc/${article.slug}`}>
                          {articleTitle}
                        </Link>
                      </h2>
                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                        {articleExcerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 mt-2">
                    <Link 
                      href={`/tin-tuc/${article.slug}`} 
                      className="inline-flex items-center text-xs font-bold text-[#005ba7] hover:text-[#004077] uppercase tracking-wider"
                    >
                      {t('read_more')} &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; {language === 'ENG' ? 'Previous' : 'Trang trước'}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 text-xs font-bold rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#005ba7] text-white shadow'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {language === 'ENG' ? 'Next' : 'Trang sau'} &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

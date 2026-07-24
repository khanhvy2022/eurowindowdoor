'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { NewsArticle } from '@/data/news';
import { useLanguage } from '@/context/LanguageContext';

interface ArticleDetailClientProps {
  article: NewsArticle;
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const { language, t } = useLanguage();

  const title = language === 'ENG' && article.titleEn ? article.titleEn : article.title;
  const content = language === 'ENG' && article.contentEn ? article.contentEn : article.content;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <span className="bg-[#005ba7] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded inline-block mb-3">
              {(language === 'ENG' && article.categoryEn) ? article.categoryEn : article.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              {language === 'ENG' ? 'Published date:' : 'Ngày đăng:'} {article.date}
            </p>
          </div>

          <div className="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden mb-8 shadow">
            <Image 
              src={article.image} 
              alt={title} 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          {/* Article Body Content */}
          <div className="text-gray-800 text-sm sm:text-base leading-relaxed border-b border-gray-100 pb-10 overflow-hidden font-sans">
            {content.includes('<') ? (
              <div 
                className="prose prose-blue max-w-none space-y-4 [&_img]:rounded-2xl [&_img]:mx-auto [&_img]:shadow-md [&_img]:max-h-[500px] [&_img]:object-contain [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[#005ba7] [&_a]:font-semibold [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#005ba7] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#005ba7] [&_h3]:mt-5 [&_h3]:mb-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="space-y-5">
                {content.split(/\n\s*\n|\n/).map((block: string, idx: number) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;

                  if (trimmed.startsWith('###') || trimmed.startsWith('####') || (trimmed.length < 80 && trimmed.endsWith(':'))) {
                    const headingText = trimmed.replace(/^#+\s*/, '');
                    return (
                      <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#005ba7] mt-7 mb-3 leading-snug">
                        {headingText}
                      </h3>
                    );
                  }

                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2.5 my-2 pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7] mt-2 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">
                          {trimmed.replace(/^[-*]\s*/, '')}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                      {trimmed}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href="/tin-tuc" className="text-xs font-semibold text-[#005ba7] hover:underline">
              &larr; {language === 'ENG' ? 'Back to News list' : 'Quay lại danh sách tin tức'}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

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

  const getProcessedContent = (raw: string) => {
    let text = raw;
    
    // Remove crawler footer junk
    const junkTokens = ['Chăm sóc khách hàng', 'Dự án quốc tế và xuất khẩu', 'Copyright ©', '[![BCT]', 'Tin tức và Sự kiện', 'Bản tin Nội bộ'];
    let minIndex = text.length;
    junkTokens.forEach(token => {
      const idx = text.indexOf(token);
      if (idx !== -1 && idx < minIndex) minIndex = idx;
    });
    if (minIndex < text.length) {
      text = text.substring(0, minIndex);
    }
    
    if (text.includes('<p') || text.includes('<div') || text.includes('<span')) {
      return text;
    }
    
    // Markdown formatting
    let html = text
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>');

    html = html.split(/\n\n+/).map(p => {
      let pt = p.trim();
      if (!pt) return '';
      if (pt.startsWith('<h') || pt.startsWith('<img') || pt.startsWith('<a')) return pt;
      if (pt.startsWith('- ') || pt.startsWith('* ')) {
        const lis = pt.split('\n').map(l => `<li>${l.replace(/^[-*]\s*/, '')}</li>`).join('');
        return `<ul>${lis}</ul>`;
      }
      return `<p>${pt}</p>`;
    }).join('\n');
    
    return html;
  };

  const processedContent = getProcessedContent(content);

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
            <div 
              className="prose prose-blue max-w-none space-y-4 [&_img]:rounded-2xl [&_img]:mx-auto [&_img]:shadow-md [&_img]:max-h-[500px] [&_img]:object-contain [&_p]:mb-4 [&_p]:leading-relaxed [&_a]:text-[#005ba7] [&_a]:font-semibold [&_a]:underline [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#005ba7] [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#005ba7] [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-2"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
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

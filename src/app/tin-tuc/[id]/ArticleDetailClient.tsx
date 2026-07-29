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
  const { language } = useLanguage();

  const title = language === 'ENG' && article.titleEn ? article.titleEn : article.title;
  const content = language === 'ENG' && article.contentEn ? article.contentEn : article.content;

  const getProcessedContent = (raw: string) => {
    let text = raw;

    // ── Step 1: Cut everything after social / footer markers ──────────────
    const stopTokens = [
      'Chia sẻ:', 'Tóm tắt với AI', 'Đánh giá:', 'Bình luận (',
      'Danh mục tin tức', 'Bài viết mới', 'Bài viết đọc nhiều',
      'Đăng ký ngay để nhận tư vấn', 'Họ và tên là bắt buộc',
      'Đang mở trình duyệt AI', 'facebook.com/eurowindow',
      'Chăm sóc khách hàng', 'Dự án quốc tế và xuất khẩu',
      'Copyright ©', '[![BCT]', 'Tin tức và Sự kiện', 'Bản tin Nội bộ',
      // Footer / sidebar contact info — cut before these appear
      'Tòa nhà Văn phòng Eurowindow Office Building',
      'thangtq2@eurowindow', 'cskhhn@eurowindowdoor', 'export@eurowindowdoor',
      'Eurowindow Office Building', '39 Bis Mạc Đĩnh Chi, Kim Liên',
      'Số 39 Bis Mạc Đĩnh Chi', '39 Bis Mạc Đĩnh Chi, P. Tân Định',
      '+84 -903', '+84-903', 'export@eurowindow',
      // Showroom article — cut before the long per-city listing
      '<p>Tại Thành Phố Hà Nội</p>',
      '<p><b>Tại Thành Phố Hà Nội</b></p>',
      'Showroom Tôn Thất Tùng', 'Showroom Eurowindow Multi Complex',
      // Showroom address separator – international
      '<p><b>Tại Thành Phố Yangon',
    ];
    let minIndex = text.length;
    stopTokens.forEach(token => {
      const idx = text.indexOf(token);
      if (idx !== -1 && idx < minIndex) minIndex = idx;
    });
    if (minIndex < text.length) text = text.substring(0, minIndex);

    // ── Step 2: Strip nav clutter (works for both HTML and plain text) ────
    const navPatterns: [RegExp, string][] = [
      [/\*\s*(VN|ENG|VI|EN)\s*\*/g, ''],
      [/\*\s*(GIỚI THIỆU|SẢN PHẨM|SHOWROOM|CÔNG TRÌNH TIÊU BIỂU|TÀI LIỆU|TIN TỨC|CHÍNH SÁCH|LIÊN HỆ|Back)\s*/gi, ''],
      [/\*\s*(CỬA NHÔM|CỬA uPVC|CỬA GỖ|CỬA CUỐN|CỬA TỰ ĐỘNG|SẢN PHẨM KÍNH|CỬA THÔNG MINH THẾ HỆ MỚI)\s*/gi, ''],
      [/\*\s*(CỬA ĐI|CỬA SỔ|VÁCH KÍNH|CỬA ĐI uPVC|CỬA SỔ uPVC)\s*/gi, ''],
      [/\*\s*(CỬA GỖ TỰ NHIÊN|CỬA GỖ CÔNG NGHIỆP|CỬA GỖ GHÉP THANH|CỬA GỖ HỖN HỢP|CỬA GỖ CHỐNG CHÁY|CỬA GỖ COMPOSITE)\s*/gi, ''],
      [/\*\s*(CÔNG TRÌNH CẤP QUỐC GIA|TÒA NHÀ VP - CHUNG CƯ|CÔNG TRÌNH DÂN DỤNG)\s*/gi, ''],
      [/\*\s*(TIN TỨC SỰ KIỆN|TIN DỰ ÁN|TIN NỘI BỘ|TIN KHUYẾN MÃI|TUYỂN DỤNG|TƯ VẤN|VIDEO)\s*/gi, ''],
      [/\*\s*(CHÍNH SÁCH BẢO HÀNH|CHÍNH SÁCH BẢO MẬT THÔNG TIN KHÁCH HÀNG)\s*/gi, ''],
      [/Nhận tư vấn\s*/g, ''],
      [/\d{1,2}\/\d{1,2}\/\d{4}\s+(?:Tin\s+\w+(?:\s+\w+)?|Tư vấn)\s+\d+\s+Lượt xem\s*/g, ''],
      [/\d+\s+Lượt xem/g, ''],
      [/(?:Trang chủ|Home)\s*[\*\/]\s*(?:Tin tức|News)[^\n<]*/g, ''],
    ];
    navPatterns.forEach(([re, rep]) => { text = text.replace(re, rep); });

    // ── Step 3: Handle Markdown Images & Formatting ───────────────────────
    // Crawler might have left markdown inside HTML paragraphs
    text = text
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Safely replace _italic_ (avoiding underscores in URLs/classes)
      .replace(/(^|[^a-zA-Z0-9_])_([^_]+)_(?=[^a-zA-Z0-9_]|$)/g, '$1<em>$2</em>')
      .replace(/<p>\s*###\s+(.*?)<\/p>/g, '<h3>$1</h3>')
      .replace(/<p>\s*##\s+(.*?)<\/p>/g, '<h2>$1</h2>')
      .replace(/<p>\s*#\s+(.*?)<\/p>/g, '<h2>$1</h2>')
      .replace(/^###\s+(.*$)/gim, '<h3>$1</h3>')
      .replace(/^##\s+(.*$)/gim, '<h2>$1</h2>')
      .replace(/^#\s+(.*$)/gim, '<h2>$1</h2>');

    // Extract inline markdown lists trapped inside <p> tags
    text = text.replace(/<p>(.*?)<\/p>/g, (match, inner) => {
      if (inner.includes('* ')) {
        const parts = inner.split(/(?:^|\s|<br\s*\/?>)\*\s+/);
        if (parts.length > 1) {
          let html = '';
          const intro = parts[0].trim();
          if (intro) {
            html += `<p>${intro}</p>`;
          }
          html += '<ul>';
          for (let i = 1; i < parts.length; i++) {
            if (parts[i].trim()) html += `<li>${parts[i].trim()}</li>`;
          }
          html += '</ul>';
          return html;
        }
      }
      return match;
    });

    // ── Step 4: Handle HTML content ───────────────────────────────────────
    if (text.includes('<p') || text.includes('<div') || text.includes('<span') || text.includes('<h1') || text.includes('<h2')) {
      // Clean empty/junk paragraphs + Blogger HTML artifacts
      text = text
        .replace(/<p>\s*(<br\s*\/?>)\s*<\/p>/g, '')
        .replace(/<p>\s*[*|\s]+<\/p>/g, '')
        .replace(/<p>\s*<\/p>/g, '')
        // Remove Blogger "b" tags with invalid style attributes like <b Times New Roman", serif; font-size: 12pt;">
        .replace(/<b\s+[^>]*?font[^>]*?>/gi, '')
        // Remove className= (JSX artifact in HTML)
        .replace(/\s+className="[^"]*"/g, '')
        // Remove data-original-* attributes from img (keep src/alt/title only)
        .replace(/\s+data-original-[a-z-]+="[^"]*"/g, '')
        // Remove external links wrapping images (crawler artifacts)
        .replace(/<a\s+href="https?:\/\/(?!eurowindow)[^"]*"[^>]*>([\s\S]*?)<\/a>/g, '$1')
        // Remove Google Drive download links
        .replace(/<a\s+href="https?:\/\/drive\.google[^"]*"[^>]*>[\s\S]*?<\/a>/g, '')
        // Remove leftover bracket links like [link text](url)
        .replace(/(?<!\!)\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, '$1')
        // Remove paragraphs containing phone numbers concatenated with emails (footer contact artifacts)
        .replace(/<p[^>]*>[^<]*(\(84[^<]*@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}[^<]*|@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}[^<]*\+84[^<]*)<\/p>/g, '')
        // Remove <!--more--> tags
        .replace(/<!--more-->/g, '');

      return text.trim();
    }

    // ── Step 5: Markdown → HTML (for plain text) ──────────────────────────
    let html = text
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

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

    return html.trim();
  };

  const processedContent = getProcessedContent(content);

  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="border-b border-gray-200 pb-5 mb-8">
            <span className="bg-[#005ba7] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md inline-block mb-4 tracking-widest">
              {(language === 'ENG' && article.categoryEn) ? article.categoryEn : article.category}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-400 mt-3">
              {language === 'ENG' ? 'Published:' : 'Ngày đăng:'}{' '}
              <span className="font-medium text-gray-600">{article.date}</span>
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-72 sm:h-[420px] rounded-2xl overflow-hidden mb-10 shadow-lg bg-slate-100">
            <Image
              src={article.image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Body */}
          <div
            className={[
              'prose prose-blue max-w-none',
              // Paragraphs
              '[&_p]:text-[15px] [&_p]:text-gray-700 [&_p]:leading-[1.9] [&_p]:mb-5',
              // Headings
              '[&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#004c8c] [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-blue-100',
              '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#004c8c] [&_h3]:mt-8 [&_h3]:mb-3',
              // Lists
              '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_li]:text-[15px] [&_li]:text-gray-700 [&_li]:mb-2 [&_li]:leading-[1.8]',
              '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5',
              // Links
              '[&_a]:text-[#005ba7] [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-blue-300 hover:[&_a]:text-[#003d7a] [&_a]:break-words',
              // Images
              '[&_img]:w-auto [&_img]:max-w-full md:[&_img]:max-w-[85%] [&_img]:max-h-[550px] [&_img]:object-contain [&_img]:rounded-xl [&_img]:mx-auto [&_img]:shadow-md [&_img]:my-8 [&_img]:block',
              // Caption italic
              '[&_.text-center.italic]:text-sm [&_.text-center.italic]:text-gray-500 [&_.text-center.italic]:text-center [&_.text-center.italic]:mt-[-20px] [&_.text-center.italic]:mb-6',
              // Strong / em
              '[&_strong]:font-bold [&_strong]:text-gray-900',
              '[&_em]:italic [&_em]:text-gray-600',
              // Blockquote
              '[&_blockquote]:border-l-4 [&_blockquote]:border-[#005ba7] [&_blockquote]:bg-blue-50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-gray-700 [&_blockquote]:my-8',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Back link */}
          <div className="mt-14 pt-8 border-t border-gray-200">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#005ba7] hover:text-[#003d7a] transition-colors"
            >
              <span>&larr;</span>
              {language === 'ENG' ? 'Back to News list' : 'Quay lại danh sách tin tức'}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

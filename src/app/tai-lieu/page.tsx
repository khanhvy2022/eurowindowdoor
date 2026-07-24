'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { useLanguage } from '@/context/LanguageContext';

interface DocumentItem {
  id: string;
  title: string;
  titleEn: string;
  category: 'Catalogue' | 'Báo giá' | 'Hướng dẫn' | 'Chứng nhận';
  type: string;
  size: string;
  year: string;
}

const documentsList: DocumentItem[] = [
  { id: '1', title: 'Catalogue Tổng quan Giải pháp Cửa Eurowindow 2026', titleEn: 'Eurowindow Door Solutions Overview Catalogue 2026', category: 'Catalogue', type: 'PDF', size: '12.5 MB', year: '2026' },
  { id: '2', title: 'Báo giá Chi tiết Cửa nhôm & Vách nhôm kính lớn', titleEn: 'Detailed Price List for Aluminum Doors & Large Glass Curtain Walls', category: 'Báo giá', type: 'PDF', size: '4.8 MB', year: '2026' },
  { id: '3', title: 'Catalogue Cửa sổ & Cửa đi uPVC tiêu chuẩn Châu Âu', titleEn: 'European Standard uPVC Window & Door Catalogue', category: 'Catalogue', type: 'PDF', size: '8.1 MB', year: '2026' },
  { id: '4', title: 'Hướng dẫn Sử dụng & Bảo dưỡng Cửa Eurowindow', titleEn: 'Eurowindow Doors User & Maintenance Guide', category: 'Hướng dẫn', type: 'PDF', size: '2.1 MB', year: '2025' },
  { id: '5', title: 'Chứng nhận Tiêu chuẩn Châu Âu ISO 9001:2015 DNV UKAS', titleEn: 'ISO 9001:2015 DNV UKAS European Standard Certificate', category: 'Chứng nhận', type: 'PDF', size: '3.5 MB', year: '2025' },
  { id: '6', title: 'Catalogue Cửa gỗ tự nhiên & Cửa gỗ chống cháy', titleEn: 'Natural Wooden Doors & Fireproof Wooden Doors Catalogue', category: 'Catalogue', type: 'PDF', size: '9.3 MB', year: '2026' },
  { id: '7', title: 'Báo giá Cửa thông minh thế hệ mới tích hợp công nghệ 4.0', titleEn: 'Next-Gen Smart Door 4.0 Technology Price List', category: 'Báo giá', type: 'PDF', size: '5.2 MB', year: '2026' },
  { id: '8', title: 'Chứng nhận Thương Hiệu Quốc Gia 14 năm liên tiếp', titleEn: '14 Consecutive Years Vietnam Value National Brand Certificate', category: 'Chứng nhận', type: 'PDF', size: '1.8 MB', year: '2026' }
];

const docCategories = ['Tất cả', 'Catalogue', 'Báo giá', 'Hướng dẫn', 'Chứng nhận'];

export default function TaiLieuPage() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const categoryMap: Record<string, string> = {
    'Tất cả': t('doc_cat_all'),
    'Catalogue': t('doc_cat_catalogue'),
    'Báo giá': t('doc_cat_price'),
    'Hướng dẫn': t('doc_cat_guide'),
    'Chứng nhận': t('doc_cat_cert'),
  };

  const filteredDocs = selectedCategory === 'Tất cả'
    ? documentsList
    : documentsList.filter((d) => d.category === selectedCategory);

  const handleDownload = (doc: DocumentItem) => {
    const docName = language === 'ENG' ? doc.titleEn : doc.title;
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
      alert(language === 'ENG' ? `Successfully downloaded: ${docName}` : `Đã tải xuống thành công tài liệu: ${docName}`);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">{t('doc_title')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('doc_breadcrumb')} ({documentsList.length} {t('doc_count_label')})</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {docCategories.map((cat) => (
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

          {/* Document Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between group">
                <div className="space-y-2 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#005ba7] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                      {categoryMap[doc.category] || doc.category}
                    </span>
                    <span className="text-xs text-gray-400 font-semibold">
                      {doc.type} • {doc.size}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#005ba7] transition-colors leading-snug">
                    {language === 'ENG' ? doc.titleEn : doc.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  disabled={downloadingDoc === (language === 'ENG' ? doc.titleEn : doc.title)}
                  className="px-4 py-2.5 bg-[#005ba7] hover:bg-[#004077] text-white text-xs font-bold uppercase rounded-xl shadow transition-all hover:scale-105 flex-shrink-0 ml-2"
                >
                  {downloadingDoc === (language === 'ENG' ? doc.titleEn : doc.title) ? t('doc_downloading') : t('doc_download_btn')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

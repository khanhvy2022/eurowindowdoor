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
  url: string;
}

const documentsList: DocumentItem[] = [
  { id: '1', title: 'Catalogue Eurowindow 2025', titleEn: 'Eurowindow Catalogue 2025', category: 'Catalogue', type: 'PDF', size: '25 MB', year: '2025', url: 'https://sudospaces.com/eurowindow/2025/12/catalogue-eurowindow-2025.pdf' },
  { id: '2', title: 'Catalogue Sản Phẩm Mới 2025', titleEn: 'New Products Catalogue 2025', category: 'Catalogue', type: 'PDF', size: '18 MB', year: '2025', url: 'https://sudospaces.com/eurowindow/2025/12/catalogue-san-pham-moi-2025.pdf' },
  { id: '3', title: 'Tờ Rơi Nhôm Có Cầu Cách Nhiệt', titleEn: 'Thermally Broken Aluminum Leaflet', category: 'Catalogue', type: 'PDF', size: '4.2 MB', year: '2021', url: 'https://sudospaces.com/eurowindow/2021/11/to-roi-nhom-co-cau-thiet-ke.pdf' },
  { id: '4', title: 'Tờ Rơi Bảng Màu Sơn Nhôm', titleEn: 'Aluminum Color Palette Leaflet', category: 'Catalogue', type: 'PDF', size: '2.5 MB', year: '2021', url: 'https://sudospaces.com/eurowindow/2021/11/to-roi-mau-mau-son.pdf' },
  { id: '5', title: 'Tờ Rơi Cửa Cuốn', titleEn: 'Roller Shutters Leaflet', category: 'Catalogue', type: 'PDF', size: '3.1 MB', year: '2021', url: 'https://sudospaces.com/eurowindow/2021/11/to-roi-cua-cuon-a4-2020.pdf' },
  { id: '6', title: 'Tờ Rơi Cửa Gỗ', titleEn: 'Wooden Doors Leaflet', category: 'Catalogue', type: 'PDF', size: '5.6 MB', year: '2021', url: 'https://sudospaces.com/eurowindow/2021/11/to-roi-cua-go.pdf' },
  { id: '7', title: 'Tờ Rơi Rèm Trong Hộp Kính', titleEn: 'Blinds Inside Glass Leaflet', category: 'Catalogue', type: 'PDF', size: '2.8 MB', year: '2022', url: 'https://sudospaces.com/eurowindow/2022/03/to-roi-sp-rem-trong-hop-kinh.pdf' },
  { id: '8', title: 'Sổ Tay Văn Hóa Doanh Nghiệp', titleEn: 'Corporate Culture Handbook', category: 'Hướng dẫn', type: 'PDF', size: '8.4 MB', year: '2024', url: 'https://sudospaces.com/eurowindow/2024/10/final-so-tay-a5-small.pdf' }
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
    
    // Open PDF in new tab to view/download
    if (doc.url) {
      window.open(doc.url, '_blank');
    }
    
    setTimeout(() => {
      setDownloadingDoc(null);
    }, 800);
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

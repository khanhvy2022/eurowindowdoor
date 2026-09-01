'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { productsData } from '@/data/products';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductsContent({ initialCategory }: { initialCategory?: string }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Tất cả');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      return;
    }
    if (catParam) {
      const clean = catParam.toLowerCase();
      if (clean.includes('nhôm') || clean.includes('nhom')) setSelectedCategory('Cửa nhôm');
      else if (clean.includes('upvc')) setSelectedCategory('Cửa uPVC');
      else if (clean.includes('gỗ') || clean.includes('go')) setSelectedCategory('Cửa gỗ');
      else if (clean.includes('cuốn') || clean.includes('cuon')) setSelectedCategory('Cửa cuốn');
      else if (clean.includes('tự động') || clean.includes('tu-dong')) setSelectedCategory('Cửa tự động');
      else if (clean.includes('kính') || clean.includes('kinh')) setSelectedCategory('Sản phẩm kính');
      else if (clean.includes('thông minh') || clean.includes('thong-minh')) setSelectedCategory('Cửa thông minh');
    }
  }, [catParam, initialCategory]);

  const categories = language === 'ENG'
    ? ['All', 'Aluminum Doors', 'uPVC Doors & Windows', 'Wooden Doors', 'Rolling Shutters', 'Automatic Doors', 'Glass Products', 'Smart Doors']
    : ['Tất cả', 'Cửa nhôm', 'Cửa uPVC', 'Cửa gỗ', 'Cửa cuốn', 'Cửa tự động', 'Sản phẩm kính', 'Cửa thông minh'];

  const filteredProducts = productsData.filter((p) => {
    if (selectedCategory === 'Tất cả' || selectedCategory === 'All') return true;
    if (language === 'ENG') {
      return p.categoryEn.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes(p.categoryEn.toLowerCase());
    }
    return p.category === selectedCategory;
  });

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">
              {language === 'ENG' ? 'Eurowindow Product Line' : 'Sản phẩm Eurowindow'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'ENG' ? 'Home / Products' : 'Trang chủ / Sản phẩm'}
            </p>
          </div>

          {/* Product Category Filter Tabs */}
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
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative w-full h-60">
                    <ImageWithFallback
                      src={prod.image}
                      alt={language === 'ENG' ? prod.nameEn : prod.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#005ba7] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md shadow">
                      {language === 'ENG' ? prod.categoryEn : prod.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#005ba7] transition-colors mb-2">
                      <Link href={`/san-pham/${prod.slug}`}>
                        {language === 'ENG' ? prod.nameEn : prod.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {language === 'ENG' ? prod.descriptionEn : prod.description}
                    </p>

                    <ul className="text-xs text-gray-500 space-y-1">
                      {(language === 'ENG' ? prod.featuresEn : prod.features).slice(0, 2).map((feat, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="text-[#005ba7] font-bold mr-1.5">•</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <Link 
                    href={`/san-pham/${prod.slug}`} 
                    className="inline-block w-full py-2.5 bg-[#005ba7] hover:bg-[#004077] text-white text-xs font-extrabold text-center rounded-xl transition-all shadow hover:scale-[1.02] uppercase"
                  >
                    {t('read_more')}
                  </Link>
                </div>
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

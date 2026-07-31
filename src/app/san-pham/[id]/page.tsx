'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { productsData } from '@/data/products';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';
import { use } from 'react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const { language, t } = useLanguage();
  const isEn = language === 'ENG';

  const product = productsData.find(
    (p) => p.slug === resolvedParams.id || p.id === resolvedParams.id
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-white font-sans">
        <Header />
        <div className="pt-[150px] pb-16 text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {isEn ? 'Product Not Found' : 'Sản phẩm không tồn tại'}
          </h1>
          <Link href="/san-pham" className="text-sm text-[#005ba7] underline mt-4 inline-block">
            ← {isEn ? 'Back to product list' : 'Quay lại danh sách sản phẩm'}
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const productName = isEn ? product.nameEn : product.name;
  const productCat = isEn ? product.categoryEn : product.category;
  const productDesc = isEn ? product.descriptionEn : product.description;
  const productBody = isEn ? product.contentEn : product.content;
  const productFeatures = isEn ? product.featuresEn : product.features;
  const productSpecs = isEn ? product.specificationsEn : product.specifications;

  const [activeGalleryIdx, setActiveGalleryIdx] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const galleryList = React.useMemo(() => {
    if (!product) return [];
    const list = [product.image, ...(product.gallery || [])];
    return Array.from(new Set(list));
  }, [product]);

  // Related products (same category, different item)
  const related = productsData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Product JSON-LD Schema.org
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: galleryList.map((img) => `https://eurowindowdoor.com${img}`),
    description: productDesc,
    brand: {
      '@type': 'Brand',
      name: 'Eurowindow',
    },
    category: productCat,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: '0',
      availability: 'https://schema.org/InStock',
      url: `https://eurowindowdoor.com/san-pham/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Eurowindow Việt Nam',
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : 'Trang chủ',
        item: 'https://eurowindowdoor.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Products' : 'Sản phẩm',
        item: 'https://eurowindowdoor.com/san-pham',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: productName,
        item: `https://eurowindowdoor.com/san-pham/${product.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <div className="pt-[130px] pb-20">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-[#005ba7]">{isEn ? 'Home' : 'Trang chủ'}</Link>
            <span>/</span>
            <Link href="/san-pham" className="hover:text-[#005ba7]">{isEn ? 'Products' : 'Sản phẩm'}</Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">{productName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ===== LEFT / MAIN COLUMN ===== */}
            <div className="lg:col-span-2 space-y-8">

              {/* Category badge + title */}
              <div>
                <span className="inline-block bg-[#005ba7] text-white text-[11px] font-bold uppercase px-3 py-1 rounded-md mb-3">
                  {productCat}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                  {productName}
                </h1>
              </div>

              {/* Featured image */}
              <div className="relative w-full h-[320px] sm:h-[500px] rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={isEn ? (product.imageAltEn || productName) : (product.imageAlt || productName)}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              {/* Short description */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  {productDesc}
                </p>
              </div>

              {/* ===== Full article body ===== */}
              {productBody && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 space-y-5">
                  <h2 className="text-lg font-bold text-[#005ba7] pb-2 border-b border-gray-100">
                    {isEn ? 'Detailed Product Information' : 'Thông tin chi tiết sản phẩm'}
                  </h2>
                  {productBody.split(/\n\s*\n|\n/).map((block, idx) => {
                    const trimmed = block.trim();
                    if (trimmed.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-base font-bold text-gray-900 pt-3 pb-1 border-b border-gray-100">
                          {trimmed.replace('### ', '')}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith('#### ')) {
                      return (
                        <h4 key={idx} className="text-sm font-bold text-[#005ba7] pt-2">
                          {trimmed.replace('#### ', '')}
                        </h4>
                      );
                    }
                    if (trimmed.startsWith('- ')) {
                      const items = trimmed.split('\n').map(item => item.replace(/^- /, '').trim());
                      return (
                        <ul key={idx} className="space-y-2 my-3 pl-2">
                          {items.map((it, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                              <span className="w-1.5 h-1.5 bg-[#005ba7] rounded-full mt-2 shrink-0" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} className="text-sm text-gray-700 leading-[1.85]">
                        {trimmed}
                      </p>
                    );
                  })}
                </div>
              )}

              {/* ===== Key Features ===== */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                <h2 className="text-lg font-bold text-[#005ba7] pb-2 border-b border-gray-100 mb-4">
                  {isEn ? 'Key Features & Advantages' : 'Đặc điểm & Ưu điểm nổi bật'}
                </h2>
                <ul className="space-y-3">
                  {productFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 bg-[#005ba7] rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ===== Technical Specifications ===== */}
              {productSpecs && Object.keys(productSpecs).length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                  <h2 className="text-lg font-bold text-[#005ba7] pb-2 border-b border-gray-100 mb-4">
                    {isEn ? 'Technical Specifications' : 'Bảng thông số kỹ thuật'}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <tbody>
                        {Object.entries(productSpecs).map(([key, val], idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className={`py-3 pr-4 font-semibold text-gray-600 w-2/5 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-3`}>
                              {key}
                            </td>
                            <td className={`py-3 text-gray-800 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-3`}>
                              {val}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ===== Photo Gallery & Interactive Lightbox ===== */}
              {galleryList.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h2 className="text-lg font-bold text-[#005ba7]">
                      {isEn ? 'Product Gallery & Installation Specs' : 'Hình ảnh sản phẩm thực tế'}
                    </h2>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {galleryList.length} {isEn ? 'Photos' : 'Hình ảnh'}
                    </span>
                  </div>

                  {/* Selected Gallery Preview */}
                  <div className="relative w-full h-[300px] sm:h-[420px] rounded-xl overflow-hidden shadow-md bg-gray-900 group cursor-pointer"
                       onClick={() => setIsLightboxOpen(true)}>
                    <ImageWithFallback
                      src={galleryList[activeGalleryIdx]}
                      alt={`${productName} ${activeGalleryIdx + 1}`}
                      fill
                      sizes="(max-width: 1200px) 100vw, 800px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#005ba7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        {isEn ? 'Click to Enlarge' : 'Xem phóng to HD'}
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded-full">
                      {activeGalleryIdx + 1} / {galleryList.length}
                    </span>
                  </div>

                  {/* Thumbnail Row */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {galleryList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveGalleryIdx(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-200 ${
                          activeGalleryIdx === idx
                            ? 'ring-2 ring-[#005ba7] ring-offset-2 scale-[1.02] shadow-md'
                            : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        <ImageWithFallback
                          src={img}
                          alt={`${productName} thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 33vw, 25vw"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== RIGHT SIDEBAR ===== */}
            <div className="space-y-5 lg:sticky lg:top-[140px] self-start">

              {/* Contact CTA */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#005ba7] uppercase tracking-wide border-b border-gray-100 pb-3">
                  {isEn ? 'Request Quote & Advice' : 'Tư vấn & Báo giá miễn phí'}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {isEn
                    ? 'Contact our specialist team for site survey and free 3D design consultation.'
                    : 'Liên hệ chuyên viên để khảo sát và tư vấn bản vẽ 3D miễn phí tận nơi.'}
                </p>
                <div className="space-y-2.5">
                  <a
                    href="tel:0966994338"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-extrabold uppercase rounded-xl shadow transition-all hover:scale-[1.02]"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                    </svg>
                    Hotline: 0966 994 338
                  </a>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-ai-chat', {
                          detail: { initialPrompt: `Báo giá và tư vấn chi tiết cho sản phẩm: ${productName}` }
                        }));
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#005ba7] hover:bg-[#004077] text-white text-xs font-bold uppercase rounded-xl shadow transition-all hover:scale-[1.02]"
                  >
                    💬 {t('nav_consultation')}
                  </button>
                </div>
              </div>

              {/* Related products */}
              {related.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">
                    {isEn ? 'Related Products' : 'Sản phẩm liên quan'}
                  </h3>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/san-pham/${rel.slug}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={rel.image}
                            alt={isEn ? rel.nameEn : rel.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-[#005ba7] leading-tight">
                          {isEn ? rel.nameEn : rel.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/san-pham"
                    className="mt-4 block text-center text-xs text-[#005ba7] font-bold hover:underline"
                  >
                    {isEn ? 'View all products →' : 'Xem tất cả sản phẩm →'}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== HD Lightbox Fullscreen Modal ===== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 transition-all duration-300">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <span className="text-sm font-semibold tracking-wide">
              {productName} — ({activeGalleryIdx + 1} / {galleryList.length})
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Center Image Display */}
          <div className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] mx-auto my-auto flex items-center justify-center">
            <ImageWithFallback
              src={galleryList[activeGalleryIdx]}
              alt={`${productName} HD ${activeGalleryIdx + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {/* Prev Button */}
            {galleryList.length > 1 && (
              <button
                onClick={() => setActiveGalleryIdx((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1))}
                className="absolute left-2 sm:left-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {/* Next Button */}
            {galleryList.length > 1 && (
              <button
                onClick={() => setActiveGalleryIdx((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 sm:right-4 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2 z-10">
            {galleryList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGalleryIdx(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden transition-all ${
                  activeGalleryIdx === idx ? 'ring-2 ring-amber-400 scale-105' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <ImageWithFallback src={img} alt={`Thumb ${idx}`} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
      <FloatingContact />
    </main>
  );
}

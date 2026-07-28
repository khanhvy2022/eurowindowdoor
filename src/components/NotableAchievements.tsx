'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

interface AchievementItem {
  id: string;
  name: string;
  nameEn: string;
  detail: string;
  detailEn: string;
  image?: string;
  isTopBadge?: boolean;
}

const achievementsData: AchievementItem[] = [
  {
    id: '1',
    name: 'Top 5 Thương Hiệu VLXD Uy Tín',
    nameEn: 'Top 5 Reputable Building Material Brands',
    detail: 'Top 5 Công ty Vật liệu Xây dựng Uy tín Việt Nam',
    detailEn: 'Top 5 Reputable Building Material Companies in Vietnam',
    isTopBadge: true,
  },
  {
    id: '2',
    name: 'Huân Chương Lao Động Hạng Nhất',
    nameEn: 'First-Class Labor Order',
    detail: 'Huân chương Lao động hạng Nhất do Chủ tịch nước trao tặng',
    detailEn: 'First-Class Labor Order awarded by the State President',
    image: '/images/eurowindow-huan-chuong-lao-dong-hang-nhat.png.webp',
  },
  {
    id: '3',
    name: 'Thương Hiệu Quốc Gia (Vietnam Value)',
    nameEn: 'Vietnam Value National Brand',
    detail: '14 năm liên tiếp đạt Thương hiệu Quốc gia Việt Nam',
    detailEn: '14 consecutive years awarded Vietnam Value National Brand',
    image: '/images/eurowindow-thuong-hieu-gia-tri-viet-nam.png.webp',
  },
  {
    id: '4',
    name: 'Hàng Việt Nam Chất Lượng Cao',
    nameEn: 'High Quality Vietnamese Goods',
    detail: 'Giải thưởng Hàng Việt Nam Chất Lượng Cao do người tiêu dùng bình chọn',
    detailEn: 'High Quality Vietnamese Goods voted by consumers',
    image: '/images/eurowindow-hang-viet-nam-chat-luong-cao.png.webp',
  },
  {
    id: '5',
    name: 'Chứng Nhận ISO 9001:2015 DNV UKAS',
    nameEn: 'ISO 9001:2015 DNV UKAS Certified',
    detail: 'Hệ thống quản lý chất lượng tiêu chuẩn quốc tế ISO 9001:2015',
    detailEn: 'International quality management system ISO 9001:2015',
    image: '/images/eurowindow-chung-nhan-ukas-iso.png.webp',
  },
];

export const NotableAchievements: React.FC = () => {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % achievementsData.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? achievementsData.length - 1 : prev - 1));
  }, []);

  // Auto-play achievements slider every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="py-28 relative overflow-hidden bg-gradient-to-r from-blue-50/80 via-white to-blue-50/50 border-y border-gray-100 select-none">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-extrabold text-[#005ba7] uppercase tracking-wider inline-block">
            {t('achieve_title')}
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-2 rounded-full" />
          <p className="text-xs text-gray-600 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('achieve_desc')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-5xl mx-auto px-10"
        >

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="btn-tactile absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md hover:bg-[#005ba7] hover:text-white text-gray-700 rounded-full flex items-center justify-center border border-gray-200 transition-all hover:scale-110 z-20"
            aria-label="Previous achievement"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Track */}
          <div className="overflow-hidden py-4">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] -mx-3"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {achievementsData.concat(achievementsData).map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-full group hover:-translate-y-1">
                    
                    {/* Image / Custom Badge */}
                    <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
                      {item.isTopBadge ? (
                        <div className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-inner border border-amber-300 w-full h-full group-hover:scale-105 transition-transform">
                          <span className="text-red-600 font-black text-xl block leading-none mb-1">TOP 5</span>
                          <span className="text-[#005ba7] font-extrabold text-[9px] uppercase leading-tight tracking-wider">
                            {language === 'ENG' ? 'VIETNAM REPUTABLE BRAND' : 'VLXD UY TÍN VIỆT NAM'}
                          </span>
                        </div>
                      ) : (
                        <ImageWithFallback
                          src={item.image!}
                          alt={language === 'ENG' ? item.nameEn : item.name}
                          fill
                          sizes="112px"
                          className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>

                    {/* Achievement Details */}
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#005ba7] transition-colors leading-snug mb-2">
                      {language === 'ENG' ? item.nameEn : item.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {language === 'ENG' ? item.detailEn : item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="btn-tactile absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-md hover:bg-[#005ba7] hover:text-white text-gray-700 rounded-full flex items-center justify-center border border-gray-200 transition-all hover:scale-110 z-20"
            aria-label="Next achievement"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {achievementsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-[#005ba7]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

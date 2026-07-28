'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

interface VideoItem {
  id: string;
  title: string;
  titleEn: string;
  thumbnail: string;
  videoUrl: string;
}

const videos: VideoItem[] = [
  {
    id: '1',
    title: 'CỬA GẤP TRƯỢT DỌC TỰ ĐỘNG',
    titleEn: 'AUTOMATIC VERTICAL FOLD-SLIDING DOOR',
    thumbnail: '/images/eurowindow-product-cua-thong-minh-the-he-moi-1.jpg.webp',
    videoUrl: 'https://www.youtube.com/embed/du5sAdXUgxc'
  },
  {
    id: '2',
    title: 'CỬA SỔ ĐIỀU KHIỂN BẰNG GIỌNG NÓI',
    titleEn: 'VOICE-CONTROLLED SMART WINDOW',
    thumbnail: '/images/eurowindow-product-cua-thong-minh-the-he-moi-2.jpg.webp',
    videoUrl: 'https://www.youtube.com/embed/6QQiQ_QF5tE'
  },
  {
    id: '3',
    title: 'VÁCH KÍNH TRƯỢT DỌC TỰ ĐỘNG',
    titleEn: 'AUTOMATIC VERTICAL SLIDING GLASS WALL',
    thumbnail: '/images/eurowindow-product-cua-thong-minh-the-he-moi-3.jpg.webp',
    videoUrl: 'https://www.youtube.com/embed/SKMVNIX6iUw'
  },
  {
    id: '4',
    title: 'KÍNH ĐIỆN ĐỔI MÀU',
    titleEn: 'SWITCHABLE SMART PRIVACY GLASS',
    thumbnail: '/images/eurowindow-product-cua-thong-minh-the-he-moi-4.jpg.webp',
    videoUrl: 'https://www.youtube.com/embed/maaXB3BnJvE'
  },
  {
    id: '5',
    title: 'PHIM TỰ GIỚI THIỆU EUROWINDOW - 20 NĂM TIÊN PHONG KẾ THỪA',
    titleEn: 'EUROWINDOW CORPORATE FILM - 22 YEARS OF PIONEERING HERITAGE',
    thumbnail: 'https://img.youtube.com/vi/q8uRfhneDhI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/q8uRfhneDhI'
  },
  {
    id: '7',
    title: 'LÝ DO TẠO NÊN THƯƠNG HIỆU EUROWINDOW? BẠN ĐÃ BIẾT CHƯA?',
    titleEn: 'WHAT MAKES THE EUROWINDOW BRAND LEADING IN VIETNAM?',
    thumbnail: 'https://img.youtube.com/vi/45-sfRgn-Tk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/45-sfRgn-Tk'
  },
  {
    id: '8',
    title: 'NHỮNG YẾU TỐ KHIẾN SẢN PHẨM EUROWINDOW CHINH PHỤC KHÁCH HÀNG',
    titleEn: 'KEY ELEMENTS THAT MAKE EUROWINDOW PRODUCTS WIN CUSTOMERS',
    thumbnail: 'https://img.youtube.com/vi/Bbpu-y3F2lA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/Bbpu-y3F2lA'
  }
];

export const FeaturedVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isEn = language === 'ENG';

  const handleNext = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0;
      scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.children[0]?.clientWidth || 0;
      scrollRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-28 bg-[#005ba7] text-white relative overflow-hidden select-none">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-blue-600/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold uppercase tracking-wider inline-block">
            {isEn ? 'FEATURED VIDEOS' : 'VIDEO NỔI BẬT'}
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Video Carousel Track */}
        <div className="relative px-6">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="btn-tactile absolute -left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 hover:bg-amber-400 hover:text-gray-900 text-white rounded-full flex items-center justify-center shadow-xl z-30 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            aria-label="Previous Video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="-mx-3">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 pt-2 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {videos.map((vid, idx) => {
                const vidTitle = isEn ? vid.titleEn : vid.title;
                return (
                  <div
                    key={`${vid.id}-${idx}`}
                    className="w-[90%] sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3 snap-center sm:snap-start"
                  >
                    <div
                      onClick={() => setSelectedVideo(vid)}
                      className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer bg-blue-900 border border-white/10 flex flex-col justify-end"
                    >
                      <ImageWithFallback
                        src={vid.thumbnail}
                        alt={vidTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#003366] via-[#003366]/40 to-transparent" />

                      {/* Play Icon */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 group-hover:bg-amber-400 rounded-full flex items-center justify-center transition-colors shadow-lg">
                        <svg className="w-5 h-5 text-[#005ba7] ml-0.5 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      {/* Title */}
                      <div className="relative p-4 z-10">
                        <h3 className="text-xs font-bold uppercase leading-snug line-clamp-3 group-hover:text-amber-300 transition-colors">
                          {vidTitle}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="btn-tactile absolute -right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/30 hover:bg-amber-400 hover:text-gray-900 text-white rounded-full flex items-center justify-center shadow-xl z-30 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            aria-label="Next Video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-black rounded-xl max-w-3xl w-full relative overflow-hidden shadow-2xl animate-fade-in">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-3 text-white text-2xl font-bold z-10 hover:text-amber-400"
            >
              &times;
            </button>
            <div className="p-4 bg-[#004077] text-white">
              <h3 className="text-sm font-bold">{isEn ? selectedVideo.titleEn : selectedVideo.title}</h3>
            </div>
            <div className="relative w-full aspect-video">
              <iframe
                src={selectedVideo.videoUrl}
                title={isEn ? selectedVideo.titleEn : selectedVideo.title}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

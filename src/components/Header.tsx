'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchIcon, ChevronDownIcon } from './icons';
import { useLanguage } from '@/context/LanguageContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileSubmenu = (menu: string) => {
    setMobileSubmenu(mobileSubmenu === menu ? null : menu);
  };

  const isEn = language === 'ENG';

  return (
    <header className="w-full fixed top-0 left-0 z-50 transition-all duration-300 font-sans">
      
      {/* 1. TOP UTILITY BAR (Cát Mộc & Corporate Style) */}
      <div className="bg-slate-900 text-gray-300 text-[11px] py-1.5 border-b border-slate-800">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Left: Contact Info & Hotline */}
          <div className="flex items-center space-x-2 md:space-x-6 whitespace-nowrap">
            <a href="tel:0966994338" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
              <span className="font-semibold text-white">Hotline: 0966 994 338</span>
            </a>
            <span className="hidden md:inline text-slate-700">|</span>
            <a href="mailto:thangtq2@eurowindow.biz" className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
              <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>thangtq2@eurowindow.biz</span>
            </a>
            <span className="hidden lg:inline text-slate-700">|</span>
            <span className="hidden lg:inline text-gray-400">
              {isEn ? 'Southern Branch: 39 Bis Mac Dinh Chi, Tan Dinh Ward, HCMC' : 'Chi Nhánh Miền Nam: 39 Bis Mạc Đĩnh Chi, P.Tân Định, TP.HCM'}
            </span>
          </div>

          {/* Right: Working Hours & Language Switcher */}
          <div className="flex items-center space-x-3 whitespace-nowrap">
            <span className="hidden sm:inline text-gray-400">
              {isEn ? 'Mon - Sat: 08:00 - 17:30' : 'T2 - T7: 08:00 - 17:30'}
            </span>
            <div className="flex items-center space-x-1 bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold">
              <button
                onClick={() => setLanguage('VN')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'VN' ? 'bg-[#005ba7] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                VN
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => setLanguage('ENG')}
                className={`px-1.5 py-0.5 rounded transition-colors ${language === 'ENG' ? 'bg-[#005ba7] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className={`transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/95 shadow-md py-2' : 'bg-white/90 shadow-sm py-3'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-4 xl:mr-16 2xl:mr-20 group">
            <Image 
              src="/images/logo-high-res.png"
              alt="Eurowindow Logo"
              width={360}
              height={66}
              priority
              unoptimized
              className="h-9 sm:h-10 xl:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-5 2xl:space-x-8 text-[11px] 2xl:text-xs font-bold uppercase tracking-wider text-gray-800 whitespace-nowrap">
            
            {/* GIỚI THIỆU (Dropdown) */}
            <div className="relative group py-2">
              <Link href="/gioi-thieu" className="hover:text-[#005ba7] transition-colors flex items-center gap-1 border-b-2 border-transparent hover:border-[#005ba7]">
                {t('nav_about')} <ChevronDownIcon className="w-2.5 h-2.5 text-gray-400 group-hover:text-[#005ba7]" />
              </Link>
              <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 normal-case font-medium text-xs text-gray-700 z-50">
                <Link href="/gioi-thieu#ve-eurowindow" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7]" />
                  {isEn ? 'About Eurowindow Brand' : 'Về thương hiệu Eurowindow'}
                </Link>
                <Link href="/gioi-thieu#hanh-trinh" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7]" />
                  {isEn ? '22-Year Pioneer Journey' : 'Hành trình 22 năm tiên phong'}
                </Link>
                <Link href="/gioi-thieu#thanh-tich" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7]" />
                  {isEn ? 'National Awards & Achievements' : 'Thành tích & Bằng khen Quốc gia'}
                </Link>
                <Link href="/showroom" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7]" />
                  {isEn ? 'Factories & Showrooms Network' : 'Hệ thống Nhà máy & Showroom'}
                </Link>
                <Link href="/tai-lieu" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#005ba7]" />
                  {isEn ? 'Technical Documents' : 'Tài liệu kỹ thuật & Hồ sơ'}
                </Link>
              </div>
            </div>

            {/* SẢN PHẨM (Professional Mega Menu) */}
            <div className="relative group py-2">
              <Link href="/san-pham" className="hover:text-[#005ba7] transition-colors flex items-center gap-1 border-b-2 border-transparent hover:border-[#005ba7]">
                {t('nav_products')} <ChevronDownIcon className="w-2.5 h-2.5 text-gray-400 group-hover:text-[#005ba7]" />
              </Link>
              <div className="absolute top-full -left-20 w-[840px] bg-white shadow-2xl rounded-b-2xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 normal-case font-normal text-xs text-gray-700 z-50 grid grid-cols-3 gap-6 whitespace-normal">
                
                {/* Column 1: Cửa nhôm & uPVC */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#005ba7] flex items-center justify-center font-bold text-sm">🚪</span>
                    <span className="font-extrabold text-[#005ba7] uppercase tracking-wide text-xs">
                      {isEn ? 'Aluminum & uPVC Doors' : 'Cửa Nhôm & uPVC'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li><Link href="/san-pham/cua-di-nhom-1-canh-mo-quay-trong" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '1-2 Sash Casement Aluminum Doors' : 'Cửa đi nhôm mở quay 1-2 cánh'}</Link></li>
                    <li><Link href="/san-pham/cua-di-nhom-2-canh-mo-truot" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '2-4 Sash Sliding Aluminum Doors' : 'Cửa đi nhôm mở trượt 2-4 cánh'}</Link></li>
                    <li><Link href="/san-pham/cua-so-nhom-mo-quay-lat-trong" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? 'European Tilt & Turn Aluminum Windows' : 'Cửa sổ nhôm mở quay lật Châu Âu'}</Link></li>
                    <li><Link href="/san-pham/cua-di-upvc-4-canh-xep-truot" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '4-6 Sash Folding uPVC Doors' : 'Cửa đi uPVC xếp trượt 4-6 cánh'}</Link></li>
                    <li><Link href="/san-pham/cua-so-mo-truot-upvc-4-canh" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '45dB Soundproof uPVC Windows' : 'Cửa sổ uPVC lõi thép cách âm 45dB'}</Link></li>
                  </ul>
                  <div className="pt-1">
                    <Link href="/san-pham?cat=Cửa+nhôm" className="text-[11px] font-bold text-[#005ba7] hover:underline flex items-center gap-1">
                      {isEn ? 'View All Aluminum Doors (20 models) →' : 'Xem tất cả Cửa nhôm (20 dòng) →'}
                    </Link>
                  </div>
                </div>

                {/* Column 2: Cửa Gỗ & Cửa Cuốn */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">🪵</span>
                    <span className="font-extrabold text-[#005ba7] uppercase tracking-wide text-xs">
                      {isEn ? 'Wooden & Roller Shutters' : 'Cửa Gỗ & Cửa Cuốn'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li><Link href="/san-pham/cua-go-tu-nhien" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? 'Thermally Modified Solid Wood Doors' : 'Cửa gỗ tự nhiên biến tính nhiệt'}</Link></li>
                    <li><Link href="/san-pham/cua-go-cong-nghiep" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? 'MDF Veneer Engineered Wood Doors' : 'Cửa gỗ công nghiệp MDF veneer'}</Link></li>
                    <li><Link href="/san-pham/cua-go-chong-chay" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '60-120 Min Fire-Rated Wooden Doors' : 'Cửa gỗ chống cháy 60-120 phút QCVN'}</Link></li>
                    <li><Link href="/san-pham/cua-go-composite" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? '100% Waterproof WPC Composite Doors' : 'Cửa gỗ WPC Composite kháng nước 100%'}</Link></li>
                    <li><Link href="/san-pham/cua-cuon-nhom-khe-thoang-easd45" className="hover:text-[#005ba7] hover:font-semibold flex items-center gap-1.5"><span>•</span> {isEn ? 'Safety Vent Aluminum Roller Shutters' : 'Cửa cuốn khe thoáng EASD45 chống giật'}</Link></li>
                  </ul>
                  <div className="pt-1">
                    <Link href="/san-pham?cat=Cửa+gỗ" className="text-[11px] font-bold text-[#005ba7] hover:underline flex items-center gap-1">
                      {isEn ? 'View All Wood & Roller Shutters →' : 'Xem tất cả Cửa gỗ & Cửa cuốn →'}
                    </Link>
                  </div>
                </div>

                {/* Column 3: Kính & Cửa Thông Minh 2026 */}
                <div className="space-y-3 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">⚡</span>
                    <span className="font-extrabold text-[#005ba7] uppercase tracking-wide text-xs">
                      {isEn ? 'Glass & Smart Doors' : 'Kính & Cửa Thông Minh'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <li><Link href="/san-pham/kinh-dien-doi-mau" className="hover:text-[#005ba7] font-semibold flex items-center gap-1.5"><span>★</span> {isEn ? 'Switchable Smart Privacy Glass' : 'Kính điện đổi màu riêng tư'}</Link></li>
                    <li><Link href="/san-pham/hop-kinh-va-hop-kinh-kho-lon" className="hover:text-[#005ba7] font-semibold flex items-center gap-1.5"><span>★</span> {isEn ? 'IGU & Low-E Insulated Safety Glass' : 'Hộp kính & Kính an toàn Low-E'}</Link></li>
                    <li><Link href="/san-pham/cua-truot-tu-dong-2-canh" className="hover:text-[#005ba7] font-semibold flex items-center gap-1.5"><span>★</span> {isEn ? 'Automatic Sensor Sliding Doors' : 'Cửa trượt tự động cảm biến 2 cánh'}</Link></li>
                    <li><Link href="/san-pham/cua-truot-slim-ray-treo" className="hover:text-[#005ba7] font-semibold flex items-center gap-1.5"><span>★</span> {isEn ? 'Modern Overhead Slim Sliding Doors' : 'Cửa trượt Slim ray treo hiện đại'}</Link></li>
                    <li><Link href="/san-pham/rem-trong-hop-kinh" className="hover:text-[#005ba7] font-semibold flex items-center gap-1.5"><span>★</span> {isEn ? 'Motorized Blinds Inside IGU Glass' : 'Rèm trong hộp kính điều khiển điện'}</Link></li>
                  </ul>
                  <div className="pt-1">
                    <Link href="/san-pham?cat=Cửa+thông+minh" className="text-[11px] font-bold text-[#005ba7] hover:underline flex items-center gap-1">
                      {isEn ? 'Explore Smart Doors 2026 →' : 'Khám phá Cửa thông minh 2026 →'}
                    </Link>
                  </div>
                </div>

              </div>
            </div>

            {/* CÔNG TRÌNH TIÊU BIỂU */}
            <div className="relative group py-2">
              <Link href="/cong-trinh-tieu-bieu" className="hover:text-[#005ba7] transition-colors flex items-center gap-1 border-b-2 border-transparent hover:border-[#005ba7]">
                {t('nav_projects')} <ChevronDownIcon className="w-2.5 h-2.5 text-gray-400 group-hover:text-[#005ba7]" />
              </Link>
              <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-b-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 normal-case font-medium text-xs text-gray-700 z-50 whitespace-normal">
                <Link href="/cong-trinh-tieu-bieu/quoc-gia" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'National Key Projects' : 'Công trình cấp Quốc gia'}
                </Link>
                <Link href="/cong-trinh-tieu-bieu/chung-cu" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'High-rise Towers & Apartments' : 'Tòa nhà VP - Chung cư cao tầng'}
                </Link>
                <Link href="/cong-trinh-tieu-bieu/dan-dung" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'Villas & Residential Projects' : 'Biệt thự & Công trình Dân dụng'}
                </Link>
              </div>
            </div>

            {/* TIN TỨC */}
            <div className="relative group py-2">
              <Link href="/tin-tuc" className="hover:text-[#005ba7] transition-colors flex items-center gap-1 border-b-2 border-transparent hover:border-[#005ba7]">
                {t('nav_news')} <ChevronDownIcon className="w-2.5 h-2.5 text-gray-400 group-hover:text-[#005ba7]" />
              </Link>
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 normal-case font-medium text-xs text-gray-700 z-50 whitespace-normal">
                <Link href="/tin-tuc/su-kien" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'Events & Corporate News' : 'Tin tức sự kiện'}
                </Link>
                <Link href="/tin-tuc/tin-du-an" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'Project & Construction News' : 'Tin dự án & Thi công'}
                </Link>
                <Link href="/tin-tuc/tu-van" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'Consulting & Guidelines' : 'Tư vấn & Hướng dẫn'}
                </Link>
                <Link href="/tin-tuc/tin-khuyen-mai" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 hover:text-[#005ba7]">
                  {isEn ? 'Promotions & Offers' : 'Tin khuyến mãi'}
                </Link>
              </div>
            </div>

            {/* SHOWROOM & LIÊN HỆ */}
            <Link href="/showroom" className="hover:text-[#005ba7] transition-colors py-2 border-b-2 border-transparent hover:border-[#005ba7]">
              {t('nav_showroom')}
            </Link>

            <Link href="/lien-he" className="hover:text-[#005ba7] transition-colors py-2 border-b-2 border-transparent hover:border-[#005ba7]">
              {t('nav_contact')}
            </Link>

          </nav>

          {/* Right Action Section */}
          <div className="flex items-center space-x-2 xl:space-x-3 flex-shrink-0 ml-2 xl:ml-8">
            
            {/* Search Pill Input */}
            <form 
              onSubmit={(e) => { e.preventDefault(); if (searchQuery) window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery)}`; }}
              className="hidden xl:block relative w-28 2xl:w-36 transition-all duration-300 focus-within:w-44"
            >
              <input 
                type="text" 
                placeholder={t('nav_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-7 py-1 text-[11px] bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#005ba7] focus:bg-white text-gray-700 placeholder-gray-400 shadow-none"
              />
              <button type="submit" aria-label="Tìm kiếm sản phẩm" className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#005ba7] p-2">
                <SearchIcon className="w-4 h-4" />
              </button>
            </form>

            {/* Advice Button CTA */}
            <Link 
              href="/lien-he" 
              className="btn-tactile hidden sm:inline-flex items-center justify-center bg-gradient-to-r from-[#005ba7] to-blue-700 hover:from-[#004077] hover:to-blue-800 text-white text-xs font-bold uppercase rounded-full px-4 xl:px-5 py-2.5 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 tracking-wider gap-1.5 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.2-.6-2.4-.6-3.6 0-.6-.4-1-1-1H3.5c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
              </svg>
              <span>{t('nav_consultation')}</span>
            </Link>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-gray-700 hover:text-[#005ba7] rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

          </div>
        </div>
      </div>

      {/* Golden Accent Line */}
      <div className="w-full h-[2px] bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500" />

      {/* MOBILE ACCORDION NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 max-h-[85vh] overflow-y-auto px-4 py-4 space-y-3 shadow-2xl font-sans text-xs">
          
          {/* Mobile Search */}
          <form 
            onSubmit={(e) => { e.preventDefault(); if (searchQuery) window.location.href = `/san-pham?search=${encodeURIComponent(searchQuery)}`; }}
            className="relative w-full mb-3"
          >
            <input 
              type="text" 
              placeholder={t('nav_search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-8 py-2 text-xs bg-gray-100 border border-gray-200 rounded-lg text-gray-800"
            />
            <button type="submit" aria-label="Tìm kiếm sản phẩm" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 p-3">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>

          {/* Links list */}
          <div className="space-y-1 font-bold uppercase text-gray-800">

            {/* Mobile About Accordion */}
            <div>
              <button 
                onClick={() => toggleMobileSubmenu('about')} 
                className="flex items-center justify-between w-full py-2.5 border-b border-gray-100 hover:text-[#005ba7]"
              >
                <span>{t('nav_about')}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${mobileSubmenu === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'about' && (
                <div className="pl-4 py-2 space-y-2 normal-case font-normal text-gray-600 bg-gray-50 rounded-lg my-1">
                  <Link href="/gioi-thieu" className="block py-1 hover:text-[#005ba7]">{isEn ? 'About Eurowindow Brand' : 'Về thương hiệu Eurowindow'}</Link>
                  <Link href="/gioi-thieu" className="block py-1 hover:text-[#005ba7]">{isEn ? '22-Year Pioneer Journey' : 'Hành trình 22 năm tiên phong'}</Link>
                  <Link href="/gioi-thieu" className="block py-1 hover:text-[#005ba7]">{isEn ? 'National Awards' : 'Thành tích & Bằng khen Quốc gia'}</Link>
                </div>
              )}
            </div>

            {/* Mobile Products Accordion */}
            <div>
              <button 
                onClick={() => toggleMobileSubmenu('products')} 
                className="flex items-center justify-between w-full py-2.5 border-b border-gray-100 hover:text-[#005ba7]"
              >
                <span>{t('nav_products')}</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${mobileSubmenu === 'products' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenu === 'products' && (
                <div className="pl-4 py-2 space-y-2 normal-case font-normal text-gray-600 bg-gray-50 rounded-lg my-1">
                  <Link href="/san-pham?cat=Cửa+nhôm" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'Aluminum Doors & Windows' : 'Cửa nhôm cao cấp'}</Link>
                  <Link href="/san-pham?cat=Cửa+uPVC" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'uPVC Doors & Windows' : 'Cửa uPVC lõi thép'}</Link>
                  <Link href="/san-pham?cat=Cửa+gỗ" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'Wooden Doors' : 'Cửa gỗ cao cấp'}</Link>
                  <Link href="/san-pham?cat=Cửa+cuốn" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'Roller Shutters' : 'Cửa cuốn nhôm'}</Link>
                  <Link href="/san-pham?cat=Cửa+tự+động" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'Automatic Doors' : 'Cửa tự động cảm biến'}</Link>
                  <Link href="/san-pham?cat=Sản+phẩm+kính" className="block py-1 font-semibold text-[#005ba7]">{isEn ? 'Glass Products & Smart Glass' : 'Sản phẩm kính & Kính điện'}</Link>
                </div>
              )}
            </div>

            <Link href="/cong-trinh-tieu-bieu" className="block py-2.5 border-b border-gray-100 hover:text-[#005ba7]">{t('nav_projects')}</Link>
            <Link href="/showroom" className="block py-2.5 border-b border-gray-100 hover:text-[#005ba7]">{t('nav_showroom')}</Link>
            <Link href="/tin-tuc" className="block py-2.5 border-b border-gray-100 hover:text-[#005ba7]">{t('nav_news')}</Link>
            <Link href="/lien-he" className="block py-2.5 border-b border-gray-100 hover:text-[#005ba7]">{t('nav_contact')}</Link>
          </div>

          <div className="pt-2">
            <Link 
              href="/lien-he" 
              className="btn-tactile flex items-center justify-center w-full py-3 bg-[#005ba7] text-white font-bold uppercase rounded-lg shadow text-center"
            >
              {t('nav_consultation')}
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};

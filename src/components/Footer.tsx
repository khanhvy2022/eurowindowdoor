'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#004077] text-white pt-12 pb-6 border-t border-blue-900">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
        {/* Col 1: About & Info */}
        <div>
          <div className="mb-4 inline-block bg-white rounded-lg px-3 py-2 shadow-md">
            <Image
              src="/images/logo-high-res.png"
              alt="Eurowindow Logo"
              width={220}
              height={44}
              unoptimized
              className="object-contain w-auto h-10"
            />
          </div>
          <p className="text-xs text-white/80 leading-relaxed mb-4">
            <strong>{t('footer_company')}</strong><br />
            {t('footer_slogan')}
          </p>
          <div className="text-xs text-white/80 space-y-1.5">
            <p><strong>{t('footer_main_hq')}</strong> {t('footer_main_hq_address')}</p>
            <p><strong>{t('footer_headquarter')}</strong> {t('footer_hq_address')}</p>
            <p><strong>Hotline:</strong> 0966 994 338</p>
            <p><strong>Email:</strong> thangtq2@eurowindow.biz</p>
          </div>
        </div>

        {/* Col 2: Products Links */}
        <div>
          <h4 className="text-sm font-bold uppercase mb-4 tracking-wide border-b border-white/20 pb-2">
            {t('nav_products')}
          </h4>
          <ul className="text-xs space-y-2 text-white/80">
            <li><Link href="/san-pham?cat=Cửa+nhôm" className="hover:text-white transition-colors">{t('footer_prod1')}</Link></li>
            <li><Link href="/san-pham?cat=Cửa+uPVC" className="hover:text-white transition-colors">{t('footer_prod2')}</Link></li>
            <li><Link href="/san-pham?cat=Cửa+gỗ" className="hover:text-white transition-colors">{t('footer_prod3')}</Link></li>
            <li><Link href="/san-pham?cat=Cửa+cuốn" className="hover:text-white transition-colors">{t('footer_prod4')}</Link></li>
            <li><Link href="/san-pham?cat=Sản+phẩm+kính" className="hover:text-white transition-colors">{t('footer_prod5')}</Link></li>
            <li><Link href="/san-pham?cat=Cửa+thông+minh" className="hover:text-white transition-colors">{t('footer_prod6')}</Link></li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 className="text-sm font-bold uppercase mb-4 tracking-wide border-b border-white/20 pb-2">
            {t('footer_quick_links')}
          </h4>
          <ul className="text-xs space-y-2 text-white/80">
            <li><Link href="/gioi-thieu" className="hover:text-white transition-colors">{t('nav_about')}</Link></li>
            <li><Link href="/showroom" className="hover:text-white transition-colors">{t('nav_showroom')}</Link></li>
            <li><Link href="/cong-trinh-tieu-bieu" className="hover:text-white transition-colors">{t('nav_projects')}</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white transition-colors">{t('nav_news')}</Link></li>
            <li><Link href="/chinh-sach" className="hover:text-white transition-colors">{t('nav_policies')}</Link></li>
            <li><Link href="/lien-he" className="hover:text-white transition-colors">{t('nav_contact')}</Link></li>
          </ul>
        </div>

        {/* Col 4: External Links */}
        <div>
          <h4 className="text-sm font-bold uppercase mb-4 tracking-wide border-b border-white/20 pb-2">
            Trang Liên Kết
          </h4>
          <ul className="text-xs space-y-2 text-white/80">
            <li><a href="https://www.euroowindow.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Eurowindow-Nhà Cung Cấp Cửa Hàng Đầu Việt Nam</a></li>
            <li><a href="https://www.eurowindowvn.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Eurowindow-Chi Nhánh Miền Nam</a></li>
            <li><a href="https://www.eurowindowhcm.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cửa Eurowindow Hồ Chí Minh</a></li>
            <li><a href="https://www.eurowindow.top/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cửa Eurowindow Miền Nam</a></li>
            <li><a href="https://eurowindow.asia/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Eurowindow Asia</a></li>
          </ul>
        </div>

        {/* Col 5: Support Hotline */}
        <div>
          <h4 className="text-sm font-bold uppercase mb-4 tracking-wide border-b border-white/20 pb-2">
            {t('footer_support')}
          </h4>
          <div className="bg-white/10 p-4 rounded-lg mb-4 text-center">
            <span className="text-xs text-white/70 block mb-1">{t('footer_hotline_label')}</span>
            <a href="tel:0966994338" className="text-xl font-bold text-yellow-400 hover:underline">0966 994 338</a>
          </div>
          <p className="text-xs text-white/70">
            {t('footer_working_hours')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 border-t border-white/10 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} Eurowindow.biz. {t('footer_rights')}
      </div>
    </footer>
  );
};

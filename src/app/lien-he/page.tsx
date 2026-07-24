'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { useLanguage } from '@/context/LanguageContext';

export default function LienHePage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-bold text-[#005ba7] uppercase">{t('contact_title')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('home')} / {t('nav_contact')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#005ba7] mb-4">{t('contact_form_title')}</h2>
              <form className="space-y-4 text-xs" onSubmit={(e) => { e.preventDefault(); alert(t('float_modal_badge')); }}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_name_label')}</label>
                  <input type="text" required placeholder={t('contact_name_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_phone_label')}</label>
                  <input type="tel" required placeholder={t('contact_phone_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_email_label')}</label>
                  <input type="email" placeholder={t('contact_email_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_message_label')}</label>
                  <textarea rows={4} placeholder={t('contact_message_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-[#005ba7] hover:bg-[#004077] text-white font-bold uppercase rounded transition-colors shadow">
                  {t('contact_submit_btn')}
                </button>
              </form>
            </div>

            {/* Direct Info & Map */}
            <div className="space-y-6 text-xs text-gray-700">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-[#005ba7] border-b pb-2">{t('contact_hq_title')}</h3>
                <p><strong>{t('sr_address_label')}</strong> {t('footer_hq_address')}</p>
                <p><strong>Hotline:</strong> 0966 994 338</p>
                <p><strong>Email:</strong> thangtq2@eurowindow.biz</p>
                <p><strong>Website:</strong> https://eurowindow.biz</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-[#005ba7] border-b pb-2">{t('contact_south_title')}</h3>
                <p><strong>{t('sr_address_label')}</strong> 39 Bis Mạc Đĩnh Chi, P.Tân Định, TP.HCM</p>
                <p><strong>Hotline Miền Nam:</strong> 028 3930 2708</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

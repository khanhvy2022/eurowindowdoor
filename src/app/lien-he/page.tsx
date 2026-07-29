'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { useLanguage } from '@/context/LanguageContext';
import { submitToGoogleForms } from '@/utils/googleForms';

export default function LienHePage() {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    const success = await submitToGoogleForms(data);
    setIsSubmitting(false);

    if (success) {
      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
      (e.target as HTMLFormElement).reset();
    } else {
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

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
              <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_name_label')}</label>
                  <input name="name" type="text" required placeholder={t('contact_name_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_phone_label')}</label>
                  <input name="phone" type="tel" required placeholder={t('contact_phone_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_email_label')}</label>
                  <input name="email" type="email" placeholder={t('contact_email_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">{t('contact_message_label')}</label>
                  <textarea name="message" rows={4} placeholder={t('contact_message_ph')} className="w-full border border-gray-300 rounded p-2.5 bg-white focus:outline-none focus:border-[#005ba7]"></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-[#005ba7] hover:bg-[#004077] text-white font-bold uppercase rounded transition-colors shadow disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'ĐANG GỬI...' : t('contact_submit_btn')}
                </button>
              </form>
            </div>

            {/* Direct Info & Map */}
            <div className="space-y-6 text-xs text-gray-700">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-[#005ba7] border-b pb-2">{t('contact_hq_title')}</h3>
                <p><strong>{t('sr_address_label')}</strong> {t('contact_hq_address')}</p>
                <p><strong>Hotline:</strong> 0966 994 338</p>
                <p><strong>Email:</strong> thangtq2@eurowindow.biz</p>
                <p><strong>Website:</strong> https://eurowindow.biz</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <h3 className="text-lg font-bold text-[#005ba7] border-b pb-2">{t('contact_south_title')}</h3>
                <p><strong>{t('sr_address_label')}</strong> {t('contact_south_address')}</p>
                <p><strong>Hotline:</strong> 0966 994 338</p>
                <p><strong>Email:</strong> thangtq2@eurowindow.biz</p>
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

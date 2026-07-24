'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { useLanguage } from '@/context/LanguageContext';

export default function ChinhSachPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">{t('policy_title')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('home')} / {t('nav_policies')}</p>
          </div>

          <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-[#005ba7]">{t('policy_s1_title')}</h2>
              <p>{t('policy_s1_p1')}</p>
              <ul className="list-disc pl-5 text-xs space-y-1">
                <li>{t('policy_s1_li1')}</li>
                <li>{t('policy_s1_li2')}</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-[#005ba7]">{t('policy_s2_title')}</h2>
              <p>{t('policy_s2_p1')}</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
              <h2 className="text-xl font-bold text-[#005ba7]">{t('policy_s3_title')}</h2>
              <p>{t('policy_s3_p1')}</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

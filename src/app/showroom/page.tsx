'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { showroomsData } from '@/data/showrooms';
import { useLanguage } from '@/context/LanguageContext';

export default function ShowroomPage() {
  const { language, t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const regionMap: Record<string, string> = {
    'Tất cả': t('sr_all_regions'),
    'Miền Bắc': t('sr_north'),
    'Miền Trung': t('sr_central'),
    'Miền Nam': t('sr_south'),
  };

  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

  const filteredShowrooms = showroomsData.filter((sr) => {
    const matchesRegion = selectedRegion === 'Tất cả' || sr.region === selectedRegion;
    const matchesQuery = searchQuery === '' || 
      sr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sr.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sr.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">{t('sr_title')}</h1>
            <p className="text-xs text-gray-500 mt-1">{t('sr_breadcrumb')} ({showroomsData.length} {t('sr_locations')})</p>
          </div>

          {/* Controls & Search Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Region Tabs */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-full transition-all ${
                    selectedRegion === reg
                      ? 'bg-[#005ba7] text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {regionMap[reg] || reg}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-72 relative">
              <input
                type="text"
                placeholder={t('sr_search_ph')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#005ba7]"
              />
            </div>
          </div>

          {/* Showroom Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShowrooms.map((sr) => (
              <div key={sr.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#005ba7] text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
                      {sr.city} • {regionMap[sr.region] || sr.region}
                    </span>
                    {sr.isHeadquarter && (
                      <span className="bg-amber-400 text-gray-900 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow-sm">
                        {t('sr_headquarter')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#005ba7] transition-colors mb-3">
                    {language === 'ENG' && sr.nameEn ? sr.nameEn : sr.name}
                  </h3>

                  <div className="text-xs text-gray-600 space-y-2 mb-4">
                    <p className="flex items-start">
                      <span className="font-bold text-gray-800 min-w-[65px]">{t('sr_address_label')}</span>
                      <span>{language === 'ENG' && sr.addressEn ? sr.addressEn : sr.address}</span>
                    </p>
                    <p className="flex items-center">
                      <span className="font-bold text-gray-800 min-w-[65px]">{t('sr_hotline_label')}</span>
                      <a href={`tel:${sr.phone.replace(/\s+/g, '')}`} className="text-[#005ba7] font-bold hover:underline">
                        {sr.phone}
                      </a>
                    </p>
                    {sr.hours && (
                      <p className="flex items-center text-gray-500">
                        <span className="font-semibold min-w-[65px]">{t('sr_hours_label')}</span>
                        <span>{sr.hours}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={`tel:${sr.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center px-4 py-2 bg-[#005ba7] hover:bg-[#004077] text-white text-xs font-bold uppercase rounded-lg shadow transition-colors"
                  >
                    {t('sr_call_btn')}
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sr.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-gray-500 hover:text-[#005ba7] transition-colors"
                  >
                    {t('sr_directions')} &rarr;
                  </a>
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

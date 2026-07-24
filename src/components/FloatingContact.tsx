'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PHONE = '0966994338';
const PHONE_DISPLAY = '0966 994 338';
const ZALO_LINK = `https://zalo.me/${PHONE}`;

export const FloatingContact: React.FC = () => {
  const { t } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @keyframes sonar {
          0%   { transform: scale(1);   opacity: .55; }
          100% { transform: scale(2.2); opacity: 0;   }
        }
        @keyframes sonar2 {
          0%   { transform: scale(1);   opacity: .35; }
          100% { transform: scale(2.6); opacity: 0;   }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0);      }
        }
        .sonar-1 { animation: sonar  2.2s ease-out infinite; }
        .sonar-2 { animation: sonar2 2.2s ease-out infinite .55s; }
        .sonar-red-1 { animation: sonar  2s ease-out infinite .2s; }
        .sonar-red-2 { animation: sonar2 2s ease-out infinite .85s; }
        .modal-in { animation: modalIn .35s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* ── Floating Buttons ── */}
      <div
        className={`fixed bottom-6 right-5 z-50 flex flex-col items-center gap-4 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >

        {/* ── ZALO ── */}
        <div className="relative flex items-center justify-center">
          <span className="sonar-1 absolute inset-0 rounded-full bg-[#0068ff]/40 pointer-events-none" />
          <span className="sonar-2 absolute inset-0 rounded-full bg-[#0068ff]/25 pointer-events-none" />

          <a
            href={ZALO_LINK}
            target="_blank"
            rel="noopener noreferrer"
            title={`Chat Zalo: ${PHONE_DISPLAY}`}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #1a8cff 0%, #0052cc 100%)' }}
          >
            <span
              className="text-white font-black select-none"
              style={{ fontSize: 16, letterSpacing: '-0.5px', fontFamily: 'Arial Black, Arial, sans-serif' }}
            >
              Zalo
            </span>
          </a>
        </div>

        {/* ── CALL ── */}
        <div className="relative flex items-center justify-center">
          <span className="sonar-red-1 absolute inset-0 rounded-full bg-red-500/45 pointer-events-none" />
          <span className="sonar-red-2 absolute inset-0 rounded-full bg-red-500/25 pointer-events-none" />

          <a
            href={`tel:${PHONE}`}
            title={`${t('float_call_free')}: ${PHONE_DISPLAY}`}
            className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{ background: 'linear-gradient(145deg, #ff4444 0%, #cc0000 100%)' }}
          >
            <PhoneIcon />
          </a>
        </div>

        {/* ── Tư Vấn Báo Giá pill ── */}
        <button
          onClick={() => setModalOpen(true)}
          className="mt-1 flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#005ba7] text-[10px] font-black uppercase tracking-wide rounded-full shadow-lg px-3.5 py-2 border border-blue-100 transition-all hover:scale-105"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          {t('float_consult')}
        </button>
      </div>

      {/* ── Consultation Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="modal-in bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="relative px-6 pt-6 pb-5 text-white" style={{ background: 'linear-gradient(135deg,#005ba7 0%,#1a6fd8 100%)' }}>
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <CloseIcon />
              </button>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">{t('float_modal_badge')}</p>
              <h3 className="text-xl font-black leading-snug">{t('float_modal_title')}</h3>
              <p className="text-xs text-blue-100/80 mt-1">{t('float_modal_sub')}</p>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); alert(t('float_modal_badge')); setModalOpen(false); }}
              className="px-6 py-5 space-y-4"
            >
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('float_label_name')}</label>
                <input type="text" placeholder={t('float_ph_name')} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('float_label_phone')}</label>
                <input type="tel" placeholder={t('float_ph_phone')} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800 transition-all" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{t('float_label_product')}</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#005ba7]/40 focus:border-[#005ba7] focus:bg-white text-gray-800 transition-all">
                  <option>{t('float_opt1')}</option>
                  <option>{t('float_opt2')}</option>
                  <option>{t('float_opt3')}</option>
                  <option>{t('float_opt4')}</option>
                  <option>{t('float_opt5')}</option>
                </select>
              </div>

              <button type="submit"
                className="w-full py-3.5 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-blue-600/40 hover:scale-[1.01]"
                style={{ background: 'linear-gradient(135deg,#005ba7 0%,#1a6fd8 100%)' }}
              >
                {t('float_submit')}
              </button>

              <p className="text-center text-[10px] text-gray-400">
                {t('float_or_call')}{' '}
                <a href={`tel:${PHONE}`} className="text-[#005ba7] font-bold hover:underline">{PHONE_DISPLAY}</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

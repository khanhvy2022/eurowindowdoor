'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const InteractiveEstimator: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'ENG';

  const [doorType, setDoorType] = useState<'nhom' | 'upvc' | 'go' | 'thong-minh'>('nhom');
  const [area, setArea] = useState<number>(25);
  const [glassType, setGlassType] = useState<'low-e' | 'hop-kinh' | 'cuong-luc' | 'dien-doi-mau'>('low-e');

  // Calculation estimates
  const getNoiseReduction = () => {
    let base = 30;
    if (doorType === 'upvc') base += 5;
    if (doorType === 'thong-minh') base += 8;
    if (glassType === 'low-e') base += 10;
    if (glassType === 'hop-kinh') base += 12;
    if (glassType === 'dien-doi-mau') base += 15;
    return Math.min(base, 48);
  };

  const getEnergySavings = () => {
    let percentage = 20;
    if (glassType === 'low-e') percentage += 15;
    if (glassType === 'hop-kinh') percentage += 12;
    if (glassType === 'dien-doi-mau') percentage += 20;
    if (doorType === 'upvc') percentage += 8;
    return Math.min(percentage, 55);
  };

  const getEstCostPerM2 = () => {
    let price = 2500000;
    if (doorType === 'nhom') price = 3200000;
    if (doorType === 'upvc') price = 2800000;
    if (doorType === 'go') price = 4500000;
    if (doorType === 'thong-minh') price = 6800000;

    if (glassType === 'low-e') price += 1200000;
    if (glassType === 'hop-kinh') price += 900000;
    if (glassType === 'dien-doi-mau') price += 3500000;

    return price;
  };

  const totalEst = area * getEstCostPerM2();

  return (
    <section className="py-20 bg-[#004077] text-white relative overflow-hidden font-sans border-t border-blue-900">
      
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full inline-block mb-3 border border-white/20">
            {isEn ? 'EUROWINDOW CALCULATOR TOOL' : 'BỘ TÍNH TOÁN DỰ TOÁN & CÁCH ÂM'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wide text-white drop-shadow">
            {isEn ? 'Estimate Noise Reduction & Energy Savings' : 'Tính Ước Tính Chi Phí & Hiệu Quả Cách Âm'}
          </h2>
          <p className="text-blue-100 text-sm mt-3 leading-relaxed max-w-2xl mx-auto">
            {isEn 
              ? 'Select your door requirements to calculate noise insulation (dB reduction), electric savings %, and estimated budget.' 
              : 'Tùy chọn loại cửa và loại kính để tính toán khả năng giảm tiếng ồn, tiết kiệm điện năng điều hòa và dự toán ngân sách.'}
          </p>
        </div>

        {/* Interactive Estimator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Controls Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-xl border border-white/20 p-7 rounded-3xl space-y-6 shadow-2xl">
            
            {/* Step 1: Select Door Type */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-3">
                1. {isEn ? 'Select Door System' : 'Chọn Hệ Cửa Eurowindow'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'nhom', label: isEn ? 'Aluminum Door' : 'Cửa Nhôm' },
                  { id: 'upvc', label: isEn ? 'uPVC Door' : 'Cửa uPVC' },
                  { id: 'go', label: isEn ? 'Wood Door' : 'Cửa Gỗ' },
                  { id: 'thong-minh', label: isEn ? 'Smart Door' : 'Cửa Thông Minh' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDoorType(item.id as any)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                      doorType === item.id 
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg scale-105' 
                        : 'bg-white/5 text-white border-white/15 hover:bg-white/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Glass Type */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-amber-300 mb-3">
                2. {isEn ? 'Select Glass Technology' : 'Chọn Công Nghệ Kính'}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'low-e', label: isEn ? 'Low-E Heat Reflective Glass' : 'Kính Hộp Low-E Cản Nhiệt' },
                  { id: 'hop-kinh', label: isEn ? 'Double Glazing Soundproof' : 'Hộp Kính Cách Âm Chân Không' },
                  { id: 'cuong-luc', label: isEn ? 'Tempered Safety Glass' : 'Kính Cường Lực An Toàn' },
                  { id: 'dien-doi-mau', label: isEn ? 'Smart Electrochromic Glass' : 'Kính Điện Thông Minh Đổi Màu' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGlassType(item.id as any)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold text-left transition-all border ${
                      glassType === item.id 
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg' 
                        : 'bg-white/5 text-white border-white/15 hover:bg-white/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Area Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-amber-300">
                  3. {isEn ? 'Total Surface Area' : 'Tổng Diện Tích Cửa'}
                </label>
                <span className="text-sm font-black text-amber-300 font-mono bg-white/15 px-3 py-1 rounded-lg">
                  {area} m²
                </span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="200" 
                value={area} 
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-blue-200 mt-1">
                <span>5 m²</span>
                <span>100 m²</span>
                <span>200 m²</span>
              </div>
            </div>

          </div>

          {/* Results Summary Box (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-amber-400/40 p-7 rounded-3xl flex flex-col justify-between shadow-2xl relative">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full inline-block mb-4 shadow">
                {isEn ? 'CALCULATED METRICS' : 'KẾT QUẢ DỰ TOÁN NĂNG LƯỢNG'}
              </span>

              <div className="space-y-5">
                {/* Metric 1: Noise Reduction */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-300 font-bold uppercase">{isEn ? 'Noise Reduction Level' : 'Khả Năng Cách Âm Giảm Tiếng Ồn'}</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1 flex items-baseline gap-1">
                    <span>-{getNoiseReduction()} dB</span>
                    <span className="text-xs font-normal text-slate-300">({isEn ? 'Quiet indoor comfort' : 'Giảm 95% tiếng ồn phố'})</span>
                  </div>
                </div>

                {/* Metric 2: Energy Savings */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <div className="text-[11px] text-slate-300 font-bold uppercase">{isEn ? 'AC Electricity Savings' : 'Tiết Kiệm Điện Năng Điều Hòa'}</div>
                  <div className="text-3xl font-black text-amber-300 mt-1 flex items-baseline gap-1">
                    <span>~{getEnergySavings()}%</span>
                    <span className="text-xs font-normal text-slate-300">({isEn ? 'Per year' : 'Mỗi năm'})</span>
                  </div>
                </div>

                {/* Metric 3: Estimated Price */}
                <div className="bg-blue-950/80 border border-blue-500/40 p-4 rounded-2xl">
                  <div className="text-[11px] text-blue-200 font-bold uppercase">{isEn ? 'Estimated Total Budget' : 'Dự Toán Ngân Sách Ước Tính'}</div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {totalEst.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="text-[10px] text-blue-300 mt-1">
                    ~{(getEstCostPerM2()).toLocaleString('vi-VN')} VNĐ / m²
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/15">
              <a
                href={`https://zalo.me/0966994338`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all hover:scale-[1.02] gap-2"
              >
                <span>{isEn ? 'Get Official Quote & Consultation' : 'Nhận Báo Giá Chính Thức Qua Zalo'}</span>
                <span>&rarr;</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

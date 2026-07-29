'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLanguage } from '@/context/LanguageContext';

export default function GioiThieuPage() {
  const { language } = useLanguage();
  const isEn = language === 'ENG';

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />

      {/* Main Content Padding */}
      <div className="pt-[130px] pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Page Title & Breadcrumb Header */}
          <div className="border-b border-gray-200 pb-5 mb-10">
            <nav className="text-xs text-gray-500 mb-2 flex items-center gap-2">
              <Link href="/" className="hover:text-[#005ba7]">{isEn ? 'Home' : 'Trang chủ'}</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{isEn ? 'About Us' : 'Giới thiệu'}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#005ba7] uppercase tracking-wide">
              {isEn ? 'About Eurowindow Corporation' : 'Giới Thiệu Về Công Ty Cổ Phần Eurowindow'}
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              {isEn 
                ? '22-year pioneering brand creating total solutions for doors and glass curtain walls in Vietnam'
                : 'Thương hiệu 22 năm tiên phong kiến tạo giải pháp tổng thể về cửa và vách nhôm kính hàng đầu Việt Nam'
              }
            </p>
          </div>

          {/* Hero Banner Image */}
          <div className="relative w-full h-[360px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl mb-12 bg-slate-100">
            <ImageWithFallback
              src="/images/eurowindow-banner-cua-nhom-kinh-trang-chu.png.webp"
              alt="Eurowindow Office Building"
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1000px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex items-end p-8 sm:p-12">
              <div className="text-white max-w-3xl">
                <span className="inline-block bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full mb-3 tracking-wider">
                  {isEn ? '2002 - 2026 • 22 Years of Pioneering' : '2002 - 2026 • 22 Năm Tiên Phong'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                  {isEn 
                    ? 'Creative Openings - Elevating Vietnamese Living Spaces'
                    : 'Mở Cửa Sáng Tạo - Nâng Tầm Không Gian Sống Việt'
                  }
                </h2>
              </div>
            </div>
          </div>

          {/* Key Quick Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#005ba7] mb-1">22+</div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                {isEn ? 'Years of Leadership' : 'Năm Tiên Phong'}
              </div>
            </div>
            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-600 mb-1">5</div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                {isEn ? 'Major Factories (>50 ha)' : 'Nhà Máy Lớn (>50 ha)'}
              </div>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">14</div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                {isEn ? 'Yrs National Brand' : 'Năm Thương Hiệu QG'}
              </div>
            </div>
            <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-5 text-center">
              <div className="text-3xl sm:text-4xl font-black text-purple-700 mb-1">10.000+</div>
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                {isEn ? 'Completed Projects' : 'Dự Án Hoàn Thành'}
              </div>
            </div>
          </div>

          {/* ARTICLE BODY SECTIONS */}
          <div className="space-y-12 text-gray-700 text-base leading-relaxed">
            
            {/* Section 1: Overview & History */}
            <section id="ve-eurowindow" className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#005ba7] font-black flex items-center justify-center text-base">01</span>
                <h2 className="text-2xl font-bold text-[#005ba7]">
                  {isEn ? 'Brand Overview & Corporate History' : 'Tổng Quan Thương Hiệu & Lịch Sử Hình Thành'}
                </h2>
              </div>

              <div className="bg-slate-50 border-l-4 border-[#005ba7] p-6 rounded-r-2xl mb-6">
                <p className="font-medium text-gray-800 text-base sm:text-lg leading-relaxed">
                  {isEn ? (
                    <><strong>Eurowindow Joint Stock Company</strong> was established on <strong>August 29, 2002</strong>. Over 22 years of development, Eurowindow is proud to be the leading brand in Vietnam in manufacturing and supplying total solutions for doors, large glass curtain walls, and modern green building materials.</>
                  ) : (
                    <><strong>Công ty Cổ phần Eurowindow</strong> được thành lập ngày <strong>29/08/2002</strong>. Trải qua hơn 22 năm phát triển, Eurowindow tự hào là thương hiệu hàng đầu Việt Nam trong lĩnh vực sản xuất và cung cấp các giải pháp tổng thể về cửa, vách nhôm kính lớn và vật liệu xây dựng xanh hiện đại.</>
                  )}
                </p>
              </div>

              <p className="mb-4">
                {isEn 
                  ? 'In the early 2000s, when the Vietnamese market was accustomed to traditional wooden doors or simple iron gates, Eurowindow initiated a revolution by introducing European standard uPVC doors into Vietnam. Outstanding soundproofing up to 45dB, energy-saving thermal insulation, and decades of durability quickly reshaped consumer mindsets and defined modern architectural standards.'
                  : 'Vào đầu những năm 2000, khi thị trường Việt Nam vẫn còn quen thuộc với các dòng cửa gỗ truyền thống hoặc cửa sắt đơn sơ, Eurowindow đã mở ra một cuộc cách mạng bằng việc đưa sản phẩm cửa nhựa uPVC tiêu chuẩn Châu Âu vào Việt Nam. Khả năng cách âm vượt trội tới 45dB, cách nhiệt tiết kiệm điện năng và độ bền hàng chục năm đã nhanh chóng làm thay đổi tư duy tiêu dùng và định hình tiêu chuẩn kiến trúc hiện đại.'
                }
              </p>
              <p>
                {isEn
                  ? 'Following that success, Eurowindow continued to expand research and master high-end aluminum door technology (aluminum with Thermal Break), Unitized glass curtain walls for high-rise skyscrapers, fireproof wooden doors, smart automatic doors, and switchable smart glass blocking 99% of UV rays.'
                  : 'Tiếp nối thành công đó, Eurowindow tiếp tục mở rộng nghiên cứu và làm chủ công nghệ sản xuất cửa nhôm cao cấp (nhôm có cầu cách nhiệt Thermal Break), vách mặt dựng kính Unitized tòa nhà cao tầng, cửa gỗ chống cháy, cửa tự động thông minh và các giải pháp kính điện đổi màu cản tia UV 99%.'
                }
              </p>
            </section>

            {/* Section 2: Vision & Mission */}
            <section id="hanh-trinh" className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-base">02</span>
                <h2 className="text-2xl font-bold text-[#005ba7]">
                  {isEn ? 'Vision, Mission & Core Values' : 'Tầm Nhìn, Sứ Mệnh & Giá Trị Cốt Lõi'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">👁️</div>
                  <h3 className="text-lg font-bold text-[#005ba7] mb-2">{isEn ? 'Strategic Vision' : 'Tầm Nhìn'}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {isEn 
                      ? 'Maintain the position as the leading total solution provider for green building materials & doors in Vietnam, establishing international brand prestige.'
                      : 'Giữ vững vị thế là nhà cung cấp giải pháp tổng thể về vật liệu xây dựng xanh & cửa hàng đầu Việt Nam, khẳng định uy tín thương hiệu vươn tầm quốc tế.'
                    }
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-2xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-[#005ba7] mb-2">{isEn ? 'Serving Mission' : 'Sứ Mệnh'}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {isEn
                      ? 'Create comfortable, safe, energy-efficient living spaces and enhance the quality of life for the Vietnamese community.'
                      : 'Kiến tạo những không gian sống tiện nghi, an toàn, tiết kiệm năng lượng và nâng cao chất lượng cuộc sống cho cộng đồng người Việt.'
                    }
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl mb-4">💎</div>
                  <h3 className="text-lg font-bold text-[#005ba7] mb-2">{isEn ? '5 Core Values' : '5 Giá Trị Cốt Lõi'}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-semibold text-[#005ba7]">
                    {isEn ? 'QUALITY • PROFESSIONALISM • EFFICIENCY • INNOVATION • COMPANIONSHIP' : 'CHẤT LƯỢNG • CHUYÊN NGHIỆP • HIỆU QUẢ • ĐỔI MỚI • ĐỒNG HÀNH'}
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3: Factories & Production Capacity */}
            <section id="nha-may" className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-xl bg-blue-100 text-[#005ba7] font-black flex items-center justify-center text-base">03</span>
                <h2 className="text-2xl font-bold text-[#005ba7]">
                  {isEn ? 'Factory Network & Automated Manufacturing Capacity' : 'Hệ Thống Nhà Máy & Năng Lực Sản Xuất Tự Động Hóa'}
                </h2>
              </div>

              <p className="mb-6">
                {isEn
                  ? 'Eurowindow owns 5 major manufacturing complexes with a total area of over 50 hectares in Hanoi, Binh Duong, and Da Nang. All factories are equipped with modern automated technology imported from world-leading corporations in Germany, Italy, and Switzerland (Elumatec, Lisec, Biesse, Haupt).'
                  : 'Eurowindow sở hữu 5 cụm nhà máy sản xuất quy mô lớn với tổng diện tích hơn 50 ha tại Hà Nội, Bình Dương và Đà Nẵng. Toàn bộ nhà máy được trang bị dây chuyền công nghệ tự động hóa hiện đại nhập khẩu đồng bộ từ các tập đoàn hàng đầu thế giới tại Đức, Ý, Thụy Sĩ (Elumatec, Lisec, Biesse, Haupt).'
                }
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#005ba7] text-white flex items-center justify-center font-bold shrink-0">F1</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{isEn ? 'Factory 1 (Quang Minh IZ, Me Linh, Hanoi)' : 'Nhà máy 1 (KCN Quang Minh, Mê Linh, Hà Nội)'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEn 
                        ? 'Specializes in producing galvanized steel core uPVC doors, automatic sensor doors, and soundproof Low-E double glass units.'
                        : 'Chuyên sản xuất cửa nhựa uPVC lõi thép mạ kẽm, cửa tự động cảm biến và hộp kính cách âm Low-E.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#005ba7] text-white flex items-center justify-center font-bold shrink-0">F2</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{isEn ? 'Factory 2 (Dong Anh IZ, Hanoi)' : 'Nhà máy 2 (KCN Đông Anh, Hà Nội)'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEn 
                        ? 'Processing center for high-end aluminum doors and Unitized glass curtain walls for skyscrapers.'
                        : 'Trung tâm gia công cửa nhôm cao cấp, vách nhôm kính mặt dựng Unitized cho các tòa nhà chọc trời.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#005ba7] text-white flex items-center justify-center font-bold shrink-0">F3</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{isEn ? 'Factory 3 (Tan Uyen IZ, Binh Duong)' : 'Nhà máy 3 (KCN Tân Uyên, Bình Dương)'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEn
                        ? 'Specializes in thermally modified solid wood processing, MDF veneer doors, and 60-120 min fire-resistant doors.'
                        : 'Chuyên chế biến gỗ tự nhiên biến tính nhiệt, cửa gỗ MDF veneer và cửa gỗ chống cháy 60-120 phút.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#005ba7] text-white flex items-center justify-center font-bold shrink-0">F4</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{isEn ? 'Factory 4 (Hoa Khanh IZ, Da Nang)' : 'Nhà máy 4 (KCN Hòa Khánh, Đà Nẵng)'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEn
                        ? 'Supplying aluminum glass doors & wooden doors for Central Vietnam and Central Highlands markets.'
                        : 'Cung ứng toàn bộ hệ thống cửa nhôm kính & cửa gỗ cho thị trường Miền Trung và Tây Nguyên.'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-[#005ba7] text-white flex items-center justify-center font-bold shrink-0">F5</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{isEn ? 'Factory 5 (Di An IZ, Binh Duong)' : 'Nhà máy 5 (KCN Dĩ An, Bình Dương)'}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {isEn
                        ? 'Complex for manufacturing Unitized curtain walls and aluminum roller shutters.'
                        : 'Tổ hợp sản xuất vách nhôm kính lớn Unitized và cửa cuốn nhôm khe thoáng chống giật.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: National Achievements & Awards */}
            <section id="thanh-tich" className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-base">04</span>
                <h2 className="text-2xl font-bold text-[#005ba7]">
                  {isEn ? 'National Achievements & Awards' : 'Thành Tích & Giải Thưởng Quốc Gia'}
                </h2>
              </div>

              <p className="mb-6">
                {isEn
                  ? 'Eurowindow product quality and brand prestige have been proven through a series of noble titles awarded by the Party, State, and prestigious domestic & international organizations:'
                  : 'Chất lượng sản phẩm và uy tín thương hiệu Eurowindow đã được chứng minh qua hàng loạt danh hiệu cao quý do Đảng, Nhà nước và các tổ chức uy tín trong & ngoài nước trao tặng:'
                }
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl flex items-start gap-3 bg-white">
                  <span className="text-xl">🏆</span>
                  <div>
                    <h4 className="font-bold text-[#005ba7] text-sm">{isEn ? 'First-Class Labor Order' : 'Huân Chương Lao Động Hạng Nhất'}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{isEn ? 'Awarded by the President of the Socialist Republic of Vietnam.' : 'Do Chủ tịch nước Cộng hòa Xã hội Chủ nghĩa Việt Nam trao tặng.'}</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl flex items-start gap-3 bg-white">
                  <span className="text-xl">🇻🇳</span>
                  <div>
                    <h4 className="font-bold text-[#005ba7] text-sm">{isEn ? '14 Consecutive Years National Brand' : '14 Năm Liên Tiếp Thương Hiệu Quốc Gia'}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{isEn ? 'Honored by the Ministry of Industry and Trade.' : 'Do Bộ Công Thương vinh danh và chứng nhận sản phẩm đạt chuẩn quốc gia.'}</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl flex items-start gap-3 bg-white">
                  <span className="text-xl">🌟</span>
                  <div>
                    <h4 className="font-bold text-[#005ba7] text-sm">{isEn ? 'Top 10 Reputable Building Material Companies' : 'Top 10 Công Ty Vật Liệu Xây Dựng Uy Tín'}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{isEn ? 'Reported by Vietnam Report for consecutive years.' : 'Báo cáo xếp hạng uy tín ngành VLXD của Vietnam Report nhiều năm liền.'}</p>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl flex items-start gap-3 bg-white">
                  <span className="text-xl">📜</span>
                  <div>
                    <h4 className="font-bold text-[#005ba7] text-sm">{isEn ? 'International Quality Certifications' : 'Chứng Nhận Chất Lượng Quốc Tế'}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{isEn ? 'ISO 9001:2015, ISO 14001:2015, CE Mark for European Export.' : 'ISO 9001:2015, ISO 14001:2015, Tiêu chuẩn CE Mark xuất khẩu Châu Âu.'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: HQ & Showroom Network */}
            <section className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
              <h3 className="text-xl font-bold text-amber-400">
                {isEn ? 'Headquarters & Distribution Network Information' : 'Thông Tin Trụ Sở & Mạng Lưới Phân Phối'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div className="space-y-2">
                  <p className="text-white font-bold">🏢 {isEn ? 'Headquarters:' : 'Trụ sở chính:'}</p>
                  <p>{isEn ? 'Eurowindow Office Building, No. 02 Ton That Tung, Kim Lien, Hanoi' : 'Tòa nhà Văn phòng Eurowindow Office Building, Số 02 Tôn Thất Tùng, Kim Liên, Hà Nội'}</p>
                  <p className="text-white font-bold pt-2">🏬 {isEn ? 'Southern Branch:' : 'Chi nhánh Miền Nam:'}</p>
                  <p>{isEn ? '39 Bis Mac Dinh Chi St., Tan Dinh Ward, HCMC' : '39 Bis Mạc Đĩnh Chi, P. Tân Định, TP.HCM'}</p>
                  <p>☎️ {isEn ? 'Hotline:' : 'Hotline:'} 0966 994 338</p>
                  <p>📧 Email: thangtq2@eurowindow.biz</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-bold">🌐 {isEn ? 'Branch & Showroom Network:' : 'Mạng lưới Showroom & Chi nhánh:'}</p>
                  <p>• {isEn ? 'Branches in North, Central & South Vietnam' : 'Chi nhánh Miền Bắc, Miền Trung, Miền Nam'}</p>
                  <p>• {isEn ? 'Over 40 official showrooms nationwide' : 'Hơn 40 Showroom chính hãng trải dài toàn quốc'}</p>
                  <p>• {isEn ? 'Hundreds of authorized dealers in 63 provinces' : 'Hệ thống đại lý ủy quyền trên 34 tỉnh thành'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-800 text-center">
                <Link 
                  href="/lien-he" 
                  className="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs uppercase px-8 py-3 rounded-full hover:scale-105 transition-transform"
                >
                  {isEn ? 'Contact Us Today For Consultation & Quotation' : 'Liên Hệ Ngay Để Được Tư Vấn & Báo Giá'}
                </Link>
              </div>
            </section>

          </div>

        </div>
      </div>

      <Footer />
      <FloatingContact />
    </main>
  );
}

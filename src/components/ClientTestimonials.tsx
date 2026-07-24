'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  avatar: string;
  content: string;
  contentEn: string;
  rating: number;
  project: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ông Nguyễn Văn Thành',
    role: 'Chủ biệt thự Vinhomes Riverside Long Biên',
    roleEn: 'Villa Owner - Vinhomes Riverside Hanoi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    content: 'Sau 5 năm lắp đặt toàn bộ hệ cửa nhôm có cầu cách nhiệt Eurowindow cho căn biệt thự, gia đình tôi rất hài lòng. Nhà quay mặt đường lớn nhưng khi đóng cửa là không gian tuyệt đối yên tĩnh, điều hòa bật mùa hè giữ nhiệt cực tốt.',
    contentEn: 'After 5 years of installing Eurowindow thermal-break aluminum doors for our villa, my family is extremely satisfied. The house faces a busy road, but closing the doors creates pure silence inside, and AC efficiency is exceptional.',
    rating: 5,
    project: 'Vinhomes Riverside Villa',
  },
  {
    id: '2',
    name: 'KTS. Lê Hoàng Nam',
    role: 'Giám đốc Kiến trúc Tập đoàn tư vấn xây dựng',
    roleEn: 'Principal Architect - Design & Construction Consultancy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    content: 'Eurowindow luôn là lựa chọn ưu tiên hàng đầu của chúng tôi trong các dự án công trình xanh tiêu chuẩn LEED. Thanh profile cao cấp, hệ phụ kiện kim khí đồng bộ và kính Low-E cản nhiệt đáp ứng hoàn hảo các chỉ số khắt khe nhất.',
    contentEn: 'Eurowindow is always our top choice for LEED-certified green building projects. High-grade profiles, synchronized hardware, and Low-E heat-reflective glass perfectly meet the strictest specifications.',
    rating: 5,
    project: 'Landmark Tower & Eco Projects',
  },
  {
    id: '3',
    name: 'Bà Trần Mai Phương',
    role: 'Chủ biệt thự nghỉ dưỡng Chateau Phú Mỹ Hưng',
    roleEn: 'Luxury Villa Owner - Chateau Phu My Hung HCMC',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    content: 'Cửa vách kính bản lớn Eurowindow mở ra tầm nhìn hướng sông tuyệt đẹp cho căn villa. Dù thời tiết Sài Gòn nắng nóng quanh năm nhưng bên trong nhà luôn mát mẻ dễ chịu.',
    contentEn: 'Eurowindow floor-to-ceiling glass walls open up a stunning river view for our villa. Despite Saigon heat all year round, the interior remains remarkably cool and pleasant.',
    rating: 5,
    project: 'Chateau Villa HCMC',
  },
];

const partners = [
  'VINGROUP', 'SUN GROUP', 'MASTERISE HOMES', 'BITEXCO', 'BIM GROUP', 'NOVLAND'
];

export const ClientTestimonials: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'ENG';

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden font-sans border-b border-slate-200/80">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#005ba7] font-bold text-xs uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full inline-block mb-3 border border-blue-200">
            {isEn ? 'CLIENT & PARTNER TESTIMONIALS' : 'ĐÁNH GIÁ TỪ KHÁCH HÀNG & ĐỐI TÁC'}
          </span>
          <h2 className="home_title text-3xl sm:text-4xl font-black text-[#005ba7] uppercase tracking-wide">
            {isEn ? 'Trusted By 50,000+ Luxury Projects' : 'Tin Dùng Bởi 50.000+ Công Trình Đỉnh Cao'}
          </h2>
          <p className="text-slate-600 text-sm mt-3 max-w-xl mx-auto">
            {isEn 
              ? 'Real feedback from luxury villa owners, leading architects, and major real estate developers across Vietnam.' 
              : 'Chia sẻ thực tế từ các chủ nhân biệt thự, kiến trúc sư hàng đầu và các tập đoàn bất động sản lớn tại Việt Nam.'}
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>

                {/* Quote Content */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic mb-6">
                  "{isEn ? item.contentEn : item.content}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-full object-cover shadow border-2 border-blue-100"
                />
                <div>
                  <h4 className="text-xs font-black text-slate-900 group-hover:text-[#005ba7] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {isEn ? item.roleEn : item.role}
                  </p>
                  <span className="inline-block text-[9px] font-bold text-[#005ba7] bg-blue-50 px-2 py-0.5 rounded mt-1">
                    {item.project}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Partners Ribbon */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200/80 max-w-5xl mx-auto">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {isEn ? 'STRATEGIC REAL ESTATE DEVELOPERS' : 'ĐỐI TÁC CHỦ ĐẦU TƯ BẤT ĐỘNG SẢN CHÍNH THỨC'}
          </p>
          <div className="flex flex-wrap items-center justify-around gap-6 text-slate-700 font-black text-sm sm:text-base opacity-75">
            {partners.map((p, idx) => (
              <span key={idx} className="hover:text-[#005ba7] transition-colors tracking-wider">
                {p}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

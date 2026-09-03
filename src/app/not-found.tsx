import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';

export default function NotFound() {
  const quickLinks = [
    { name: 'Cửa nhôm Eurowindow', href: '/san-pham/cua-nhom', icon: '🚪', desc: 'Hệ nhôm cao cấp tiêu chuẩn Châu Âu' },
    { name: 'Cửa nhựa uPVC', href: '/san-pham/cua-upvc', icon: '🛡️', desc: 'Cách âm, cách nhiệt vượt trội' },
    { name: 'Cửa gỗ & Chống cháy', href: '/san-pham/cua-go', icon: '🌲', desc: 'Gỗ tự nhiên & chống cháy 60-120p' },
    { name: 'Cửa cuốn & Tự động', href: '/san-pham/cua-cuon', icon: '⚡', desc: 'Hiện đại, an toàn và thông minh' },
    { name: 'Báo giá & Ưu đãi', href: '/bao-gia', icon: '💰', desc: 'Bảng giá mới nhất & khuyến mãi vàng' },
    { name: 'Tin tức & Công trình', href: '/tin-tuc', icon: '📰', desc: 'Dự án thực tế & tin tức sự kiện' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Header />
      
      <main className="container mx-auto px-4 pt-[140px] pb-20 flex flex-col items-center justify-center text-center">
        {/* 404 Badge */}
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl font-black text-slate-200 tracking-tighter select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-1.5 bg-[#005ba7] text-white text-xs sm:text-sm font-bold uppercase rounded-full shadow-lg">
              Trang không tìm thấy
            </span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Đường Dẫn Không Tồn Tại Hoặc Đã Bị Thay Đổi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-8 leading-relaxed">
          Nội dung bạn đang tìm kiếm có thể đã được cập nhật đường dẫn mới trên hệ thống <strong>Eurowindow</strong>. Bạn có thể khám phá các danh mục nổi bật dưới đây hoặc quay về trang chủ.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#005ba7] hover:bg-[#004077] text-white font-bold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>🏠</span> Về Trang Chủ
          </Link>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#005ba7] border-2 border-[#005ba7] font-bold text-sm rounded-xl hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 shadow-sm"
          >
            <span>🚪</span> Xem Tất Cả Sản Phẩm
          </Link>
          <a
            href="tel:0966994338"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <span>📞</span> Hotline: 0966 994 338
          </a>
        </div>

        {/* Quick Discovery Cards */}
        <div className="w-full max-w-4xl bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-left">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🔍</span> Gợi Ý Danh Mục Phổ Biến
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-start gap-3"
              >
                <span className="text-2xl p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors">{item.icon}</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#005ba7] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingContact />
    </div>
  );
}

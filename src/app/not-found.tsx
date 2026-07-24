import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <Header />
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-4xl font-extrabold mb-6 shadow-inner">
          404
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Trang Bạn Tìm Kiếm Không Tồn Tại
        </h1>
        <p className="text-base text-gray-600 max-w-lg mb-8 leading-relaxed">
          Đường dẫn có thể đã thay đổi hoặc không còn tồn tại trên hệ thống Eurowindow. Hãy thử tìm kiếm sản phẩm hoặc quay lại trang chủ.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#004077] text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-200"
          >
            Về Trang Chủ
          </Link>
          <Link
            href="/san-pham"
            className="px-6 py-3 bg-white text-[#004077] border border-[#004077] font-bold rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            Xem Sản Phẩm Eurowindow
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

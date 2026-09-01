import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';
import {
  doorTypes,
  doorTypesEA60i,
  doorTypesKommerling,
  doorTypesAsia,
  pricing,
  pricingEA60i,
  pricingKommerling,
  pricingAsia,
  glassTypes,
  glassTypesEA60i,
  glassTypesKommerling,
  glassTypesAsia,
  fmt,
} from './pricing';

export const metadata: Metadata = {
  title: 'Báo Giá Cửa Nhôm Kính & Cửa Nhựa uPVC Eurowindow',
  description:
    'Bảng giá tham khảo cửa nhôm EA55, EA60i và cửa nhựa uPVC Kommerling, uPVC Asia theo m². Hotline 0966 994 338 để nhận báo giá chi tiết chính xác.',
  keywords: [
    'Báo giá cửa Eurowindow',
    'Giá cửa nhôm EA55',
    'Báo giá cửa nhôm EA60i',
    'Báo giá cửa nhựa uPVC Kommerling',
    'Giá cửa nhựa uPVC Asia'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/bao-gia',
  },
  openGraph: {
    title: 'Báo Giá Cửa Nhôm Kính & Cửa Nhựa uPVC Eurowindow Mới Nhất',
    description: 'Bảng giá tham khảo hệ cửa nhôm cao cấp và cửa uPVC lõi thép tiêu chuẩn Châu Âu.',
    url: 'https://eurowindowdoor.com/bao-gia',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Báo Giá Cửa Nhôm Kính & Cửa Nhựa uPVC Eurowindow',
    description: 'Bảng giá tham khảo hệ cửa nhôm cao cấp và cửa uPVC lõi thép tiêu chuẩn Châu Âu.',
  },
};

interface SystemSectionProps {
  id: string;
  title: string;
  doors: { key: string; label: string }[];
  prices: Record<string, number>;
  glasses: { key: string; label: string }[];
  glassPrices: Record<string, number>;
}

function SystemSection({ id, title, doors, prices, glasses, glassPrices }: SystemSectionProps) {
  return (
    <section id={id} className="scroll-mt-32">
      <h2 className="text-xl font-extrabold text-[#005ba7] uppercase mb-4">{title}</h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#005ba7] text-white text-left">
              <th className="px-4 py-3 font-bold">Loại cửa</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Đơn giá cơ bản (VNĐ/m²)</th>
            </tr>
          </thead>
          <tbody>
            {doors.map((door, i) => (
              <tr key={door.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-800">{door.label}</td>
                <td className="px-4 py-3 text-gray-900 font-semibold whitespace-nowrap">
                  {fmt(prices[door.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-3 font-bold">Loại kính</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Phụ phí (VNĐ/m²)</th>
            </tr>
          </thead>
          <tbody>
            {glasses.map((glass, i) => (
              <tr key={glass.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-800">{glass.label}</td>
                <td className="px-4 py-3 text-gray-900 font-semibold whitespace-nowrap">
                  {fmt(glassPrices[glass.key])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function BaoGiaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="pt-[130px] pb-16">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-[#005ba7] uppercase">
              Bảng Báo Giá Cửa Nhôm Kính & Cửa Nhựa uPVC
            </h1>
            <p className="text-xs text-gray-500 mt-1">Báo giá cửa Eurowindow (tham khảo)</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 text-sm text-gray-700">
            <p className="font-bold text-[#005ba7] mb-1">Lưu ý:</p>
            <p>
              Giá trên là đơn giá tham khảo theo m², chưa gồm VAT và chi phí vận chuyển, lắp đặt.
              Giá thực tế phụ thuộc vào kích thước, số lượng, phụ kiện và khu vực thi công. Liên hệ
              hotline <a href="tel:0966994338" className="font-bold text-[#005ba7]">0966 994 338</a>{' '}
              để được tư vấn và báo giá chính xác.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <a
              href="#he-ea55"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="font-extrabold text-[#005ba7]">Hệ nhôm EA55</h3>
              <p className="text-xs text-gray-500 mt-1">Cửa nhôm thường, hệ cơ bản phổ biến</p>
            </a>
            <a
              href="#he-ea60i"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="font-extrabold text-[#005ba7]">Hệ nhôm EA60i</h3>
              <p className="text-xs text-gray-500 mt-1">Cửa nhôm cầu cách nhiệt cao cấp</p>
            </a>
            <a
              href="#he-kommerling"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="font-extrabold text-[#005ba7]">Cửa nhựa uPVC Kommerling</h3>
              <p className="text-xs text-gray-500 mt-1">Công nghệ Đức, cách âm cách nhiệt</p>
            </a>
            <a
              href="#he-asia"
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all"
            >
              <h3 className="font-extrabold text-[#005ba7]">Cửa nhựa uPVC Asia</h3>
              <p className="text-xs text-gray-500 mt-1">Giải pháp kinh tế cho công trình dân dụng</p>
            </a>
          </div>

          <SystemSection
            id="he-ea55"
            title="1. Hệ Nhôm EA55"
            doors={doorTypes}
            prices={pricing.basePrice}
            glasses={glassTypes}
            glassPrices={pricing.glassExtra}
          />
          <SystemSection
            id="he-ea60i"
            title="2. Hệ Nhôm EA60i"
            doors={doorTypesEA60i}
            prices={pricingEA60i.basePrice}
            glasses={glassTypesEA60i}
            glassPrices={pricingEA60i.glassExtra}
          />
          <SystemSection
            id="he-kommerling"
            title="3. Cửa Nhựa uPVC Kommerling"
            doors={doorTypesKommerling}
            prices={pricingKommerling.basePrice}
            glasses={glassTypesKommerling}
            glassPrices={pricingKommerling.glassExtra}
          />
          <SystemSection
            id="he-asia"
            title="4. Cửa Nhựa uPVC Asia"
            doors={doorTypesAsia}
            prices={pricingAsia.basePrice}
            glasses={glassTypesAsia}
            glassPrices={pricingAsia.glassExtra}
          />

          <div className="bg-[#005ba7] text-white rounded-2xl p-6 text-center">
            <h2 className="text-lg font-extrabold uppercase mb-2">Cần báo giá chi tiết?</h2>
            <p className="text-sm text-white/90 mb-4">
              Gửi kích thước, vị trí và yêu cầu của bạn — chúng tôi sẽ tư vấn và báo giá trong 24h.
            </p>
            <a
              href="/lien-he"
              className="inline-block bg-white text-[#005ba7] px-6 py-3 text-sm font-bold uppercase rounded-xl hover:bg-gray-100 transition-colors"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingContact />
    </main>
  );
}

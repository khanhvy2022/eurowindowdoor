import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tin Tức Eurowindow - Khuyến Mãi, Sự Kiện & Công Nghệ Cửa Mới Nhất',
  description: 'Cập nhật tin tức mới nhất về thương hiệu Eurowindow, các chương trình khuyến mãi tri ân khách hàng, sự kiện và xu hướng công nghệ cửa Châu Âu.',
  keywords: [
    'Tin tức Eurowindow',
    'Khuyến mãi Eurowindow',
    'Sự kiện Eurowindow',
    'Công nghệ cửa nhôm kính',
    'Xu hướng kiến trúc 2026'
  ],
  alternates: {
    canonical: 'https://eurowindow.biz/tin-tuc',
  },
  openGraph: {
    title: 'Tin Tức Eurowindow - Khuyến Mãi & Công Nghệ Cửa Mới Nhất',
    description: 'Cập nhật sự kiện, thông tin báo chí và ưu đãi mới nhất từ Eurowindow.',
    url: 'https://eurowindow.biz/tin-tuc',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

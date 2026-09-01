import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Showroom - Hệ Thống Trưng Bày & Trải Nghiệm Toàn Quốc',
  description: 'Danh sách hệ thống Showroom Eurowindow trên toàn quốc. Hãy đến trải nghiệm trực tiếp các giải pháp cửa thông minh và vách kính công nghệ Châu Âu.',
  keywords: [
    'Showroom Eurowindow',
    'Địa chỉ showroom Eurowindow',
    'Showroom cửa nhôm kính',
    'Eurowindow Hà Nội',
    'Eurowindow TP.HCM'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/showroom',
  },
  openGraph: {
    title: 'Showroom Eurowindow - Trải Nghiệm Thực Tế Sản Phẩm Cao Cấp',
    description: 'Hệ thống Showroom hiện đại trải dài từ Bắc vào Nam.',
    url: 'https://eurowindowdoor.com/showroom',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Showroom Eurowindow - Trải Nghiệm Thực Tế Sản Phẩm Cao Cấp',
    description: 'Hệ thống Showroom hiện đại trải dài từ Bắc vào Nam.',
  },
};

export default function ShowroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

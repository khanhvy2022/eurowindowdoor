import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Công Trình Tiêu Biểu - 50.000+ Dự Án Khắp Việt Nam',
  description: 'Tổng hợp các công trình và dự án tiêu biểu ứng dụng sản phẩm cửa nhôm kính, cửa uPVC, vách mặt dựng Eurowindow như Sân bay Phú Bài, Landmark 81, Vinhomes.',
  keywords: [
    'Công trình Eurowindow',
    'Dự án Eurowindow',
    'Vách kính mặt dựng Unitized',
    'Cửa nhôm biệt thự',
    'Công trình sân bay Phú Bài'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/cong-trinh-tieu-bieu',
  },
  openGraph: {
    title: 'Công Trình Tiêu Biểu Eurowindow - 50.000+ Dự Án Đỉnh Cao',
    description: 'Dấu ấn Eurowindow tại các công trình trọng điểm quốc gia và khu đô thị cao cấp.',
    url: 'https://eurowindowdoor.com/cong-trinh-tieu-bieu',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

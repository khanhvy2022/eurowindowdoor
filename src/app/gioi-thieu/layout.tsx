import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu - 23 Năm Tiên Phong Công Nghệ Châu Âu',
  description: 'Tìm hiểu hành trình 23 năm phát triển của Eurowindow - nhà cung cấp giải pháp tổng thể về cửa và vật liệu xây dựng xanh hàng đầu Việt Nam.',
  keywords: [
    'Giới thiệu Eurowindow',
    'Lịch sử Eurowindow',
    'Thương hiệu Eurowindow',
    'Năng lực sản xuất Eurowindow',
    'Nhà máy Eurowindow'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/gioi-thieu',
  },
  openGraph: {
  title: 'Giới Thiệu - 23 Năm Tiên Phong Công Nghệ Châu Âu',
    description: 'Hành trình tiên phong kiến tạo không gian sống xanh và hiện đại.',
    url: 'https://eurowindowdoor.com/gioi-thieu',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

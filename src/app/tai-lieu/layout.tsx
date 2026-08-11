import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài Liệu Kỹ Thuật - Catalog & Brochure Sản Phẩm',
  description: 'Tải về catalog, thông số kỹ thuật, bản vẽ chi tiết và tài liệu hướng dẫn sử dụng các giải pháp cửa nhôm kính, cửa uPVC Eurowindow.',
  keywords: [
    'Catalog Eurowindow',
    'Tài liệu kỹ thuật cửa nhôm',
    'Brochure cửa uPVC',
    'Bản vẽ cửa Eurowindow',
    'Thông số kỹ thuật kính Low-E'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/tai-lieu',
  },
  openGraph: {
    title: 'Tài Liệu Kỹ Thuật Eurowindow - Tải Catalog Chính Thức',
    description: 'Thư viện tài liệu kỹ thuật và brochure giải pháp vật liệu xây dựng xanh.',
    url: 'https://eurowindowdoor.com/tai-lieu',
  },
};

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

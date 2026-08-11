import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản Phẩm - Cửa Nhôm, uPVC, Gỗ, Vách Kính Low-E',
  description: 'Khám phá các dòng sản phẩm cửa nhựa uPVC, cửa nhôm cao cấp, cửa gỗ, cửa cuốn, vách kính mặt dựng và kính cản nhiệt Low-E Eurowindow chính hãng.',
  keywords: [
    'Sản phẩm Eurowindow',
    'Cửa nhôm Eurowindow',
    'Cửa nhựa uPVC',
    'Cửa gỗ chống cháy',
    'Cửa cuốn khe thoáng',
    'Kính cản nhiệt Low-E',
    'Cửa tự động Eurowindow'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/san-pham',
  },
  openGraph: {
  title: 'Sản Phẩm - Cửa Nhôm, uPVC, Gỗ, Vách Kính Low-E',
    description: 'Các giải pháp cửa và vách kính công nghệ Châu Âu hàng đầu Việt Nam.',
    url: 'https://eurowindowdoor.com/san-pham',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

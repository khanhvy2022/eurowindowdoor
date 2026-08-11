import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chính Sách - Bảo Hành, Đổi Trả & Vận Chuyển',
  description: 'Thông tin chi tiết về chính sách bảo hành dài hạn, bảo trì định kỳ, chính sách chất lượng và vận chuyển các sản phẩm cửa Eurowindow.',
  keywords: [
    'Chính sách bảo hành Eurowindow',
    'Bảo trì cửa Eurowindow',
    'Quy định chất lượng Eurowindow',
    'Hỗ trợ kỹ thuật Eurowindow'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/chinh-sach',
  },
  openGraph: {
    title: 'Chính Sách Eurowindow - Cam Kết Chất Lượng & Bảo Hành Uy Tín',
    description: 'Chính sách bảo hành và bảo trì hàng đầu ngành cửa tại Việt Nam.',
    url: 'https://eurowindowdoor.com/chinh-sach',
  },
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

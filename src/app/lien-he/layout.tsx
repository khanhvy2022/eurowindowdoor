import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ - Hotline 0966 994 338',
  description: 'Liên hệ tư vấn, báo giá cửa nhôm kính, cửa nhựa uPVC Eurowindow chính hãng. Hotline: 0966 994 338. Email: thangtq2@eurowindow.biz.',
  keywords: [
    'Liên hệ Eurowindow',
    'Hotline Eurowindow',
    'Báo giá cửa Eurowindow',
    'Tư vấn cửa Eurowindow',
    'Eurowindow TP.HCM'
  ],
  alternates: {
    canonical: 'https://eurowindowdoor.com/lien-he',
  },
  openGraph: {
    title: 'Liên Hệ Eurowindow - Hotline 0966 994 338 | Tư Vấn Báo Giá',
    description: 'Liên hệ ngay để nhận hỗ trợ tư vấn giải pháp cửa và vách kính tiêu chuẩn Châu Âu.',
    url: 'https://eurowindowdoor.com/lien-he',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdContact = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Liên hệ Eurowindow Việt Nam',
    url: 'https://eurowindowdoor.com/lien-he',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Eurowindow - Chi Nhánh Miền Nam',
      image: 'https://eurowindowdoor.com/images/logo-high-res.png',
      telephone: '+84-966994338',
      email: 'thangtq2@eurowindow.biz',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '39 Bis Mạc Đĩnh Chi, P.Tân Định',
        addressLocality: 'Quận 1 / TP.HCM',
        addressRegion: 'Thành phố Hồ Chí Minh',
        addressCountry: 'VN',
      },
      priceRange: '$$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '17:30',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdContact) }}
      />
      {children}
    </>
  );
}

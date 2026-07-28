import type { Metadata } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

const siteUrl = 'https://eurowindow.biz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Eurowindow - Cửa Nhôm, Cửa uPVC, Cửa Gỗ, Vách Kính Tiêu Chuẩn Châu Âu',
    template: '%s | Eurowindow Việt Nam',
  },
  description: 'Eurowindow - Nhà cung cấp giải pháp tổng thể về cửa nhựa uPVC, cửa nhôm cao cấp, cửa gỗ, cửa cuốn, cửa tự động, kính cản nhiệt Low-E hàng đầu Việt Nam.',
  keywords: [
    'Eurowindow',
    'Cửa nhôm Eurowindow',
    'Cửa uPVC Eurowindow',
    'Cửa gỗ Eurowindow',
    'Cửa gỗ chống cháy',
    'Vách nhôm kính lớn Unitized',
    'Kính cản nhiệt Low-E',
    'Cửa tự động',
    'Cửa cuốn khe thoáng',
    'Cửa thông minh thế hệ mới 2026',
    'Báo giá cửa Eurowindow'
  ],
  authors: [{ name: 'Eurowindow Việt Nam', url: siteUrl }],
  creator: 'Eurowindow Việt Nam',
  publisher: 'Eurowindow Việt Nam',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'vi-VN': siteUrl,
      'en-US': `${siteUrl}/en`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: 'Eurowindow Việt Nam',
    title: 'Eurowindow - Cửa Nhôm, Cửa uPVC, Cửa Gỗ, Vách Kính Tiêu Chuẩn Châu Âu',
    description: 'Nhà cung cấp giải pháp tổng thể về vật liệu xây dựng xanh và hệ thống cửa cao cấp hàng đầu Việt Nam.',
    images: [
      {
        url: '/images/eurowindow-khuyen-mai-2025.png.webp',
        width: 1200,
        height: 630,
        alt: 'Eurowindow Tiên Phong Công Nghệ Châu Âu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eurowindow - Giải Pháp Cửa & Vách Nhôm Kính Tiêu Chuẩn Châu Âu',
    description: 'Cửa nhôm, cửa uPVC lõi thép, cửa gỗ biến tính nhiệt, vách kính mặt dựng Unitized Eurowindow.',
    images: ['/images/eurowindow-khuyen-mai-2025.png.webp'],
    site: '@EurowindowMN',
    creator: '@EurowindowMN',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/seo/apple-touch-icon.png',
  },
  verification: {
    google: 'w26lI5Kb1KKM0E2aqDdq5mLrAf8ZRrRdztLSRsCcpkE',
    yandex: '834c943a00f8fb16',
    other: {
      'msvalidate.01': 'CB4464617018E36643BCA09836EAC288',
      'p:domain_verify': '3419c68192e353bd14adda3f92d6306a',
    },
  },
  other: {
    'geo.placename': 'Vietnam',
    'geo.country': 'VN',
    'fb:admins': '3371215466542032',
    'fb:pages': '416052529237542',
    'fb:app_id': '416052529237542',
    'article:author': 'https://www.facebook.com/eurowindowhcmmn/',
    'article:publisher': 'https://www.facebook.com/eurowindow.biz',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eurowindow Việt Nam',
    url: siteUrl,
    logo: `${siteUrl}/images/logo-eurowindow.png.webp`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-966994338',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/eurowindow.biz',
      'https://www.youtube.com/eurowindow',
    ],
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Eurowindow Việt Nam',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/san-pham?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdLocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Eurowindow - Chi Nhánh Miền Nam',
    image: `${siteUrl}/images/logo-high-res.png`,
    telephone: '+84-966994338',
    email: 'thangtq2@eurowindow.biz',
    url: siteUrl,
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
  };

  return (
    <html lang="vi">
      <head>
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://blogger.googleusercontent.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }}
        />
      </head>
      <body className={`${jakarta.className} antialiased bg-white text-gray-900`}>
        {/* Google Analytics - Optimized lazy load */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y2F739JNDJ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y2F739JNDJ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

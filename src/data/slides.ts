export interface Slide {
  id: string;
  image: string;
  title: string;
  titleEn: string;
  alt: string;
  link: string;
}

export const slidesData: Slide[] = [
  {
    id: '1',
    image: '/images/eurowindow-banner-cua-nhom-kinh-trang-chu.png.webp',
    title: 'EUROWINDOW - 22 NĂM TIÊN PHONG CỬA THÔNG MINH VÀ VẬT LIỆU XÂY DỰNG XANH',
    titleEn: 'EUROWINDOW - 22 YEARS PIONEERING SMART DOORS & GREEN BUILDING MATERIALS',
    alt: 'Eurowindow 22 năm tiên phong',
    link: '/gioi-thieu'
  },
  {
    id: '2',
    image: '/images/nha-may-gia-cong-kinh-eurowindow-hung-yen.jpg.webp',
    title: 'BỘ GIẢI PHÁP CỬA NHÔM KÍNH TIÊU CHUẨN CHÂU ÂU CAO CẤP',
    titleEn: 'PREMIUM EUROPEAN STANDARD ALUMINUM GLASS DOOR SOLUTIONS',
    alt: 'Cửa nhôm kính Eurowindow',
    link: '/san-pham/cua-nhom'
  },
  {
    id: '3',
    image: '/images/eurowindow-thuong-hieu-quoc-gia-viet-nam.jpg.webp',
    title: 'EUROWINDOW 14 NĂM LIÊN TIẾP ĐẠT THƯƠNG HIỆU QUỐC GIA VIỆT NAM',
    titleEn: 'EUROWINDOW HONORED AS VIETNAM NATIONAL BRAND FOR 14 CONSECUTIVE YEARS',
    alt: 'Thương hiệu quốc gia',
    link: '/tin-tuc'
  },
  {
    id: '4',
    image: '/images/eurowindow-cua-tu-dong-tai-cong-trinh.jpg.webp',
    title: 'CỬA THÔNG MINH BẢO MẬT VÂN TAY & KHUÔN MẶT CÔNG NGHỆ 4.0',
    titleEn: 'SMART DOORS WITH FINGERPRINT & FACE RECOGNITION 4.0 TECHNOLOGY',
    alt: 'Cửa thông minh 4.0',
    link: '/san-pham/cua-thong-minh'
  }
];

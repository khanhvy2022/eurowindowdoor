import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enable gzip/brotli compression

  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first = better compression
    minimumCacheTTL: 31536000, // Cache images 1 year
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.sudospaces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sudospaces.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'eurowindowdoor.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blogger.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.bp.blogspot.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '*.bp.blogspot.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
  {
    "source": "/2024/11/eurowindow-22-nam-dong-hanh-cung-nganh-vat-lieu-xay-dung-phat-trien-ben-vung.html",
    "destination": "/tin-tuc/eurowindow-22-nam-dong-hanh-cung-nganh-vat-lieu-xay-dung-phat-trien-ben-vung",
    "permanent": true
  },
  {
    "source": "/2024/11/eurowindow-22-nam-dong-hanh-cung-nganh-vat-lieu-xay-dung-phat-trien-ben-vung",
    "destination": "/tin-tuc/eurowindow-22-nam-dong-hanh-cung-nganh-vat-lieu-xay-dung-phat-trien-ben-vung",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-khai-truong-van-phong-kinh-doanh-tai-phu-yen.html",
    "destination": "/tin-tuc/eurowindow-khai-truong-van-phong-kinh-doanh-tai-phu-yen",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-khai-truong-van-phong-kinh-doanh-tai-phu-yen",
    "destination": "/tin-tuc/eurowindow-khai-truong-van-phong-kinh-doanh-tai-phu-yen",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-vinh-danh-trong-top-500-nha-tuyen-dung-hang-dau-viet-nam-nam-2024.html",
    "destination": "/tin-tuc/eurowindow-vinh-danh-trong-top-500-nha-tuyen-dung-hang-dau-viet-nam-nam-2024",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-vinh-danh-trong-top-500-nha-tuyen-dung-hang-dau-viet-nam-nam-2024",
    "destination": "/tin-tuc/eurowindow-vinh-danh-trong-top-500-nha-tuyen-dung-hang-dau-viet-nam-nam-2024",
    "permanent": true
  },
  {
    "source": "/2025/02/eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong.html",
    "destination": "/tin-tuc/eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong",
    "permanent": true
  },
  {
    "source": "/2025/02/eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong",
    "destination": "/tin-tuc/eurowindow-cung-cap-cua-du-an-midori-park-the-ten-binh-duong",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-cuon-va-cua-tu-dong.html",
    "destination": "/tin-tuc/cua-cuon-va-cua-tu-dong",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-cuon-va-cua-tu-dong",
    "destination": "/tin-tuc/cua-cuon-va-cua-tu-dong",
    "permanent": true
  },
  {
    "source": "/2024/11/tien-ich-cua-cua-thong-minh-eurowindow-trong-cuoc-song-hien-dai.html",
    "destination": "/tin-tuc/tien-ich-cua-cua-thong-minh-eurowindow-trong-cuoc-song-hien-dai",
    "permanent": true
  },
  {
    "source": "/2024/11/tien-ich-cua-cua-thong-minh-eurowindow-trong-cuoc-song-hien-dai",
    "destination": "/tin-tuc/tien-ich-cua-cua-thong-minh-eurowindow-trong-cuoc-song-hien-dai",
    "permanent": true
  },
  {
    "source": "/2025/10/cua-nhom-3-lop-cau-tao-khac-biet-cach-am-uu-viet.html",
    "destination": "/tin-tuc/cua-nhom-3-lop-cau-tao-khac-biet-cach-am-uu-viet",
    "permanent": true
  },
  {
    "source": "/2025/10/cua-nhom-3-lop-cau-tao-khac-biet-cach-am-uu-viet",
    "destination": "/tin-tuc/cua-nhom-3-lop-cau-tao-khac-biet-cach-am-uu-viet",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-duoc-vinh-danh-top-10-doanh-nghiep-uy-tin-nganh-kinh-va-thuy-tinh-viet-nam.html",
    "destination": "/tin-tuc/eurowindow-duoc-vinh-danh-top-10-doanh-nghiep-uy-tin-nganh-kinh-va-thuy-tinh-viet-nam",
    "permanent": true
  },
  {
    "source": "/2024/12/eurowindow-duoc-vinh-danh-top-10-doanh-nghiep-uy-tin-nganh-kinh-va-thuy-tinh-viet-nam",
    "destination": "/tin-tuc/eurowindow-duoc-vinh-danh-top-10-doanh-nghiep-uy-tin-nganh-kinh-va-thuy-tinh-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/08/khong-gian-an-yen-song-mat-lanh-cung-cua-nhom-kinh-eurowindow.html",
    "destination": "/tin-tuc/khong-gian-an-yen-song-mat-lanh-cung-cua-nhom-kinh-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/08/khong-gian-an-yen-song-mat-lanh-cung-cua-nhom-kinh-eurowindow",
    "destination": "/tin-tuc/khong-gian-an-yen-song-mat-lanh-cung-cua-nhom-kinh-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/02/eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my.html",
    "destination": "/tin-tuc/eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my",
    "permanent": true
  },
  {
    "source": "/2025/02/eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my",
    "destination": "/tin-tuc/eurowindow-ky-ket-hop-tac-chien-luoc-voi-cong-ty-qstone-usa-llc-my",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-ban-le-san-tu-dong-eurowindow-giai-phap-gon-gang-an-toan-cho-moi-khong-gian.html",
    "destination": "/tin-tuc/cua-ban-le-san-tu-dong-eurowindow-giai-phap-gon-gang-an-toan-cho-moi-khong-gian",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-ban-le-san-tu-dong-eurowindow-giai-phap-gon-gang-an-toan-cho-moi-khong-gian",
    "destination": "/tin-tuc/cua-ban-le-san-tu-dong-eurowindow-giai-phap-gon-gang-an-toan-cho-moi-khong-gian",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-nhom-cao-cap-eurowindow-la-chan-an-toan-vuot-troi-mua-mua-bao.html",
    "destination": "/tin-tuc/cua-nhom-cao-cap-eurowindow-la-chan-an-toan-vuot-troi-mua-mua-bao",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-nhom-cao-cap-eurowindow-la-chan-an-toan-vuot-troi-mua-mua-bao",
    "destination": "/tin-tuc/cua-nhom-cao-cap-eurowindow-la-chan-an-toan-vuot-troi-mua-mua-bao",
    "permanent": true
  },
  {
    "source": "/2025/04/eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat.html",
    "destination": "/tin-tuc/eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat",
    "permanent": true
  },
  {
    "source": "/2025/04/eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat",
    "destination": "/tin-tuc/eurowindow-duoc-vinh-danh-tai-vietnam-esg-awards-lan-thu-nhat",
    "permanent": true
  },
  {
    "source": "/2025/01/eurowindow-tong-thau-thi-cong-gan-1700-m2-cua-nhom-kinh-mat-dung-toa-nha-misa-da-nang.html",
    "destination": "/tin-tuc/eurowindow-tong-thau-thi-cong-gan-1700-m2-cua-nhom-kinh-mat-dung-toa-nha-misa-da-nang",
    "permanent": true
  },
  {
    "source": "/2025/01/eurowindow-tong-thau-thi-cong-gan-1700-m2-cua-nhom-kinh-mat-dung-toa-nha-misa-da-nang",
    "destination": "/tin-tuc/eurowindow-tong-thau-thi-cong-gan-1700-m2-cua-nhom-kinh-mat-dung-toa-nha-misa-da-nang",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-go.html",
    "destination": "/tin-tuc/cua-go",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-go",
    "destination": "/tin-tuc/cua-go",
    "permanent": true
  },
  {
    "source": "/2025/11/cua-nhom-cua-upvc-eurowindow-duoc-vinh-danh-la-san-pham-cong-nghiep-chu-luc-ha-noi-2025.html",
    "destination": "/tin-tuc/cua-nhom-cua-upvc-eurowindow-duoc-vinh-danh-la-san-pham-cong-nghiep-chu-luc-ha-noi-2025",
    "permanent": true
  },
  {
    "source": "/2025/11/cua-nhom-cua-upvc-eurowindow-duoc-vinh-danh-la-san-pham-cong-nghiep-chu-luc-ha-noi-2025",
    "destination": "/tin-tuc/cua-nhom-cua-upvc-eurowindow-duoc-vinh-danh-la-san-pham-cong-nghiep-chu-luc-ha-noi-2025",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-nhua-upvc.html",
    "destination": "/tin-tuc/cua-nhua-upvc",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-nhua-upvc",
    "destination": "/tin-tuc/cua-nhua-upvc",
    "permanent": true
  },
  {
    "source": "/2025/03/kinh-dien-thong-minh-ung-dung-hien-dai-cho-khong-gian-song-tien-nghi.html",
    "destination": "/tin-tuc/kinh-dien-thong-minh-ung-dung-hien-dai-cho-khong-gian-song-tien-nghi",
    "permanent": true
  },
  {
    "source": "/2025/03/kinh-dien-thong-minh-ung-dung-hien-dai-cho-khong-gian-song-tien-nghi",
    "destination": "/tin-tuc/kinh-dien-thong-minh-ung-dung-hien-dai-cho-khong-gian-song-tien-nghi",
    "permanent": true
  },
  {
    "source": "/2025/09/cua-chong-chay-eurowindow-giai-phap-an-toan-cho-ngoi-nha-viet.html",
    "destination": "/tin-tuc/cua-chong-chay-eurowindow-giai-phap-an-toan-cho-ngoi-nha-viet",
    "permanent": true
  },
  {
    "source": "/2025/09/cua-chong-chay-eurowindow-giai-phap-an-toan-cho-ngoi-nha-viet",
    "destination": "/tin-tuc/cua-chong-chay-eurowindow-giai-phap-an-toan-cho-ngoi-nha-viet",
    "permanent": true
  },
  {
    "source": "/2025/12/cai-tao-khong-gian-song-voi-cua-nhom-slim-va-kinh-dien.html",
    "destination": "/tin-tuc/cai-tao-khong-gian-song-voi-cua-nhom-slim-va-kinh-dien",
    "permanent": true
  },
  {
    "source": "/2025/12/cai-tao-khong-gian-song-voi-cua-nhom-slim-va-kinh-dien",
    "destination": "/tin-tuc/cai-tao-khong-gian-song-voi-cua-nhom-slim-va-kinh-dien",
    "permanent": true
  },
  {
    "source": "/2025/12/cua-cach-am-kinh-hop-eurowindow-cho-khong-gian-song-yen-tinh.html",
    "destination": "/tin-tuc/cua-cach-am-kinh-hop-eurowindow-cho-khong-gian-song-yen-tinh",
    "permanent": true
  },
  {
    "source": "/2025/12/cua-cach-am-kinh-hop-eurowindow-cho-khong-gian-song-yen-tinh",
    "destination": "/tin-tuc/cua-cach-am-kinh-hop-eurowindow-cho-khong-gian-song-yen-tinh",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-nhom.html",
    "destination": "/tin-tuc/cua-nhom",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-nhom",
    "destination": "/tin-tuc/cua-nhom",
    "permanent": true
  },
  {
    "source": "/2024/12/cua-eurowindow-giai-phap-toi-uu-cho-cong-trinh-hien-dai.html",
    "destination": "/tin-tuc/cua-eurowindow-giai-phap-toi-uu-cho-cong-trinh-hien-dai",
    "permanent": true
  },
  {
    "source": "/2024/12/cua-eurowindow-giai-phap-toi-uu-cho-cong-trinh-hien-dai",
    "destination": "/tin-tuc/cua-eurowindow-giai-phap-toi-uu-cho-cong-trinh-hien-dai",
    "permanent": true
  },
  {
    "source": "/2025/06/vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap.html",
    "destination": "/tin-tuc/vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap",
    "permanent": true
  },
  {
    "source": "/2025/06/vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap",
    "destination": "/tin-tuc/vi-sao-kien-truc-su-uu-tien-chon-cua-eurowindow-cho-cong-trinh-cao-cap",
    "permanent": true
  },
  {
    "source": "/2025/03/eurowindow-nang-tam-dang-cap-biet-thu-nghi-duong-5-sao-mandarin-oriental-da-nang.html",
    "destination": "/tin-tuc/eurowindow-nang-tam-dang-cap-biet-thu-nghi-duong-5-sao-mandarin-oriental-da-nang",
    "permanent": true
  },
  {
    "source": "/2025/03/eurowindow-nang-tam-dang-cap-biet-thu-nghi-duong-5-sao-mandarin-oriental-da-nang",
    "destination": "/tin-tuc/eurowindow-nang-tam-dang-cap-biet-thu-nghi-duong-5-sao-mandarin-oriental-da-nang",
    "permanent": true
  },
  {
    "source": "/2024/12/khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang.html",
    "destination": "/tin-tuc/khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang",
    "permanent": true
  },
  {
    "source": "/2024/12/khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang",
    "destination": "/tin-tuc/khuyen-mai-tri-an-khach-hang-ngan-qua-tang-sang",
    "permanent": true
  },
  {
    "source": "/2025/01/cua-upvc-eurowindow-giai-phap-so-1-cho-trai-nghiem-song-thuong-luu.html",
    "destination": "/tin-tuc/cua-upvc-eurowindow-giai-phap-so-1-cho-trai-nghiem-song-thuong-luu",
    "permanent": true
  },
  {
    "source": "/2025/01/cua-upvc-eurowindow-giai-phap-so-1-cho-trai-nghiem-song-thuong-luu",
    "destination": "/tin-tuc/cua-upvc-eurowindow-giai-phap-so-1-cho-trai-nghiem-song-thuong-luu",
    "permanent": true
  },
  {
    "source": "/2025/01/eurowindow-tu-hao-15-nam-xep-hang-top-500-doanh-nghiep-lon-nhat-viet-nam.html",
    "destination": "/tin-tuc/eurowindow-tu-hao-15-nam-xep-hang-top-500-doanh-nghiep-lon-nhat-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/01/eurowindow-tu-hao-15-nam-xep-hang-top-500-doanh-nghiep-lon-nhat-viet-nam",
    "destination": "/tin-tuc/eurowindow-tu-hao-15-nam-xep-hang-top-500-doanh-nghiep-lon-nhat-viet-nam",
    "permanent": true
  },
  {
    "source": "/2024/10/he-vach-nhom-kinh-lon.html",
    "destination": "/tin-tuc/he-vach-nhom-kinh-lon",
    "permanent": true
  },
  {
    "source": "/2024/10/he-vach-nhom-kinh-lon",
    "destination": "/tin-tuc/he-vach-nhom-kinh-lon",
    "permanent": true
  },
  {
    "source": "/2025/05/hanh-trinh-van-hoa-eurowindow-2025-nang-luong-lan-toa-tu-nhung-nguoi-dung-dau.html",
    "destination": "/tin-tuc/hanh-trinh-van-hoa-eurowindow-2025-nang-luong-lan-toa-tu-nhung-nguoi-dung-dau",
    "permanent": true
  },
  {
    "source": "/2025/05/hanh-trinh-van-hoa-eurowindow-2025-nang-luong-lan-toa-tu-nhung-nguoi-dung-dau",
    "destination": "/tin-tuc/hanh-trinh-van-hoa-eurowindow-2025-nang-luong-lan-toa-tu-nhung-nguoi-dung-dau",
    "permanent": true
  },
  {
    "source": "/2024/11/tai-sao-cua-thong-minh-eurowindow-la-lua-chon-hang-dau-cho-ngoi-nha-cua-ban.html",
    "destination": "/tin-tuc/tai-sao-cua-thong-minh-eurowindow-la-lua-chon-hang-dau-cho-ngoi-nha-cua-ban",
    "permanent": true
  },
  {
    "source": "/2024/11/tai-sao-cua-thong-minh-eurowindow-la-lua-chon-hang-dau-cho-ngoi-nha-cua-ban",
    "destination": "/tin-tuc/tai-sao-cua-thong-minh-eurowindow-la-lua-chon-hang-dau-cho-ngoi-nha-cua-ban",
    "permanent": true
  },
  {
    "source": "/2024/10/anh-cong-trinh.html",
    "destination": "/tin-tuc/anh-cong-trinh",
    "permanent": true
  },
  {
    "source": "/2024/10/anh-cong-trinh",
    "destination": "/tin-tuc/anh-cong-trinh",
    "permanent": true
  },
  {
    "source": "/2025/08/kinh-solar-giai-phap-thong-minh-cho-ngoi-nha-hien-dai.html",
    "destination": "/tin-tuc/kinh-solar-giai-phap-thong-minh-cho-ngoi-nha-hien-dai",
    "permanent": true
  },
  {
    "source": "/2025/08/kinh-solar-giai-phap-thong-minh-cho-ngoi-nha-hien-dai",
    "destination": "/tin-tuc/kinh-solar-giai-phap-thong-minh-cho-ngoi-nha-hien-dai",
    "permanent": true
  },
  {
    "source": "/2024/11/sinh-vien-dh-kinh-te-quoc-dan-tham-quan-nha-may-eurowindow-va-dinh-huong-nghe-nghiep-cung-eurowindow-holding.html",
    "destination": "/tin-tuc/sinh-vien-dh-kinh-te-quoc-dan-tham-quan-nha-may-eurowindow-va-dinh-huong-nghe-nghiep-cung-eurowindow-holding",
    "permanent": true
  },
  {
    "source": "/2024/11/sinh-vien-dh-kinh-te-quoc-dan-tham-quan-nha-may-eurowindow-va-dinh-huong-nghe-nghiep-cung-eurowindow-holding",
    "destination": "/tin-tuc/sinh-vien-dh-kinh-te-quoc-dan-tham-quan-nha-may-eurowindow-va-dinh-huong-nghe-nghiep-cung-eurowindow-holding",
    "permanent": true
  },
  {
    "source": "/2025/02/khai-truong-dau-xuan-2025-chi-nhanh-mien-nam-eurowindow.html",
    "destination": "/tin-tuc/khai-truong-dau-xuan-2025-chi-nhanh-mien-nam-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/02/khai-truong-dau-xuan-2025-chi-nhanh-mien-nam-eurowindow",
    "destination": "/tin-tuc/khai-truong-dau-xuan-2025-chi-nhanh-mien-nam-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/11/cac-loi-thuong-gap-khi-tu-van-lap-dat-cua-eurowindow.html",
    "destination": "/tin-tuc/cac-loi-thuong-gap-khi-tu-van-lap-dat-cua-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/11/cac-loi-thuong-gap-khi-tu-van-lap-dat-cua-eurowindow",
    "destination": "/tin-tuc/cac-loi-thuong-gap-khi-tu-van-lap-dat-cua-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/01/kham-pha-bi-mat-cua-thong-minh-tien-nghi-moi-ngay-an-ninh-toi-uu.html",
    "destination": "/tin-tuc/kham-pha-bi-mat-cua-thong-minh-tien-nghi-moi-ngay-an-ninh-toi-uu",
    "permanent": true
  },
  {
    "source": "/2025/01/kham-pha-bi-mat-cua-thong-minh-tien-nghi-moi-ngay-an-ninh-toi-uu",
    "destination": "/tin-tuc/kham-pha-bi-mat-cua-thong-minh-tien-nghi-moi-ngay-an-ninh-toi-uu",
    "permanent": true
  },
  {
    "source": "/2024/10/he-thong-showroom-eurowindow.html",
    "destination": "/tin-tuc/he-thong-showroom-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/10/he-thong-showroom-eurowindow",
    "destination": "/tin-tuc/he-thong-showroom-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-thuy-luc-va-vach-kinh-phong-tam.html",
    "destination": "/tin-tuc/cua-thuy-luc-va-vach-kinh-phong-tam",
    "permanent": true
  },
  {
    "source": "/2024/10/cua-thuy-luc-va-vach-kinh-phong-tam",
    "destination": "/tin-tuc/cua-thuy-luc-va-vach-kinh-phong-tam",
    "permanent": true
  },
  {
    "source": "/2025/01/kinh-dien-doi-mau-the-he-moi.html",
    "destination": "/tin-tuc/kinh-dien-doi-mau-the-he-moi",
    "permanent": true
  },
  {
    "source": "/2025/01/kinh-dien-doi-mau-the-he-moi",
    "destination": "/tin-tuc/kinh-dien-doi-mau-the-he-moi",
    "permanent": true
  },
  {
    "source": "/2025/06/23-nam-khang-dinh-uy-tin-eurowindow-thuong-hieu-cua-hang-dau-viet-nam.html",
    "destination": "/tin-tuc/23-nam-khang-dinh-uy-tin-eurowindow-thuong-hieu-cua-hang-dau-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/06/23-nam-khang-dinh-uy-tin-eurowindow-thuong-hieu-cua-hang-dau-viet-nam",
    "destination": "/tin-tuc/23-nam-khang-dinh-uy-tin-eurowindow-thuong-hieu-cua-hang-dau-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-kinh-low-e-giai-phap-cach-nhiet-toi-uu-cho-nha-huong-tay.html",
    "destination": "/tin-tuc/cua-kinh-low-e-giai-phap-cach-nhiet-toi-uu-cho-nha-huong-tay",
    "permanent": true
  },
  {
    "source": "/2025/07/cua-kinh-low-e-giai-phap-cach-nhiet-toi-uu-cho-nha-huong-tay",
    "destination": "/tin-tuc/cua-kinh-low-e-giai-phap-cach-nhiet-toi-uu-cho-nha-huong-tay",
    "permanent": true
  },
  {
    "source": "/2025/06/cua-nhom-cau-cach-nhiet-lua-chon-hang-dau-cho-cong-trinh-xanh-ben-vung.html",
    "destination": "/tin-tuc/cua-nhom-cau-cach-nhiet-lua-chon-hang-dau-cho-cong-trinh-xanh-ben-vung",
    "permanent": true
  },
  {
    "source": "/2025/06/cua-nhom-cau-cach-nhiet-lua-chon-hang-dau-cho-cong-trinh-xanh-ben-vung",
    "destination": "/tin-tuc/cua-nhom-cau-cach-nhiet-lua-chon-hang-dau-cho-cong-trinh-xanh-ben-vung",
    "permanent": true
  },
  {
    "source": "/2025/09/chon-cua-xanh-tiet-kiem-nang-luong-bao-ve-hanh-tinh-xanh.html",
    "destination": "/tin-tuc/chon-cua-xanh-tiet-kiem-nang-luong-bao-ve-hanh-tinh-xanh",
    "permanent": true
  },
  {
    "source": "/2025/09/chon-cua-xanh-tiet-kiem-nang-luong-bao-ve-hanh-tinh-xanh",
    "destination": "/tin-tuc/chon-cua-xanh-tiet-kiem-nang-luong-bao-ve-hanh-tinh-xanh",
    "permanent": true
  },
  {
    "source": "/2024/10/san-pham-cua-thong-minh-eurowindow.html",
    "destination": "/tin-tuc/san-pham-cua-thong-minh-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/10/san-pham-cua-thong-minh-eurowindow",
    "destination": "/tin-tuc/san-pham-cua-thong-minh-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/07/eurowindow-tieu-chuan-cua-hien-dai-cho-moi-cong-trinh.html",
    "destination": "/tin-tuc/eurowindow-tieu-chuan-cua-hien-dai-cho-moi-cong-trinh",
    "permanent": true
  },
  {
    "source": "/2025/07/eurowindow-tieu-chuan-cua-hien-dai-cho-moi-cong-trinh",
    "destination": "/tin-tuc/eurowindow-tieu-chuan-cua-hien-dai-cho-moi-cong-trinh",
    "permanent": true
  },
  {
    "source": "/2025/08/eurowindow23-nam-dong-hanh-kien-tao-nhung-cong-trinh-bieu-tuong-viet-nam.html",
    "destination": "/tin-tuc/eurowindow23-nam-dong-hanh-kien-tao-nhung-cong-trinh-bieu-tuong-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/08/eurowindow23-nam-dong-hanh-kien-tao-nhung-cong-trinh-bieu-tuong-viet-nam",
    "destination": "/tin-tuc/eurowindow23-nam-dong-hanh-kien-tao-nhung-cong-trinh-bieu-tuong-viet-nam",
    "permanent": true
  },
  {
    "source": "/2025/05/top-5-ly-do-nen-chon-cua-eurowindow-giai-phap-toi-uu-cho-mua-he-nong-buc.html",
    "destination": "/tin-tuc/top-5-ly-do-nen-chon-cua-eurowindow-giai-phap-toi-uu-cho-mua-he-nong-buc",
    "permanent": true
  },
  {
    "source": "/2025/05/top-5-ly-do-nen-chon-cua-eurowindow-giai-phap-toi-uu-cho-mua-he-nong-buc",
    "destination": "/tin-tuc/top-5-ly-do-nen-chon-cua-eurowindow-giai-phap-toi-uu-cho-mua-he-nong-buc",
    "permanent": true
  },
  {
    "source": "/2025/02/cua-thong-minh-tuyet-tac-khong-gian-nha-o-duong-dai.html",
    "destination": "/tin-tuc/cua-thong-minh-tuyet-tac-khong-gian-nha-o-duong-dai",
    "permanent": true
  },
  {
    "source": "/2025/02/cua-thong-minh-tuyet-tac-khong-gian-nha-o-duong-dai",
    "destination": "/tin-tuc/cua-thong-minh-tuyet-tac-khong-gian-nha-o-duong-dai",
    "permanent": true
  },
  {
    "source": "/2025/01/cua-nhom-ew60i-giai-phap-cach-nhiet-va-cach-am-toi-uu-cho-ngoi-nha-ban.html",
    "destination": "/tin-tuc/cua-nhom-ew60i-giai-phap-cach-nhiet-va-cach-am-toi-uu-cho-ngoi-nha-ban",
    "permanent": true
  },
  {
    "source": "/2025/01/cua-nhom-ew60i-giai-phap-cach-nhiet-va-cach-am-toi-uu-cho-ngoi-nha-ban",
    "destination": "/tin-tuc/cua-nhom-ew60i-giai-phap-cach-nhiet-va-cach-am-toi-uu-cho-ngoi-nha-ban",
    "permanent": true
  },
  {
    "source": "/2024/11/cua-nhom-co-cau-cach-nhiet-eurowindow.html",
    "destination": "/tin-tuc/cua-nhom-co-cau-cach-nhiet-eurowindow",
    "permanent": true
  },
  {
    "source": "/2024/11/cua-nhom-co-cau-cach-nhiet-eurowindow",
    "destination": "/tin-tuc/cua-nhom-co-cau-cach-nhiet-eurowindow",
    "permanent": true
  },
  {
    "source": "/2025/10/eurowindow-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai.html",
    "destination": "/tin-tuc/eurowindow-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai",
    "permanent": true
  },
  {
    "source": "/2025/10/eurowindow-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai",
    "destination": "/tin-tuc/eurowindow-khuyen-mai-mo-cua-hom-nay-nhan-ngay-uu-dai",
    "permanent": true
  },
  {
    "source": "/2025/03/eurowindow-16-nam-lien-tiep-dat-danh-hieu-hang-viet-nam-chat-luong-cao-2025.html",
    "destination": "/tin-tuc/eurowindow-16-nam-lien-tiep-dat-danh-hieu-hang-viet-nam-chat-luong-cao-2025",
    "permanent": true
  },
  {
    "source": "/2025/03/eurowindow-16-nam-lien-tiep-dat-danh-hieu-hang-viet-nam-chat-luong-cao-2025",
    "destination": "/tin-tuc/eurowindow-16-nam-lien-tiep-dat-danh-hieu-hang-viet-nam-chat-luong-cao-2025",
    "permanent": true
  },
  {
    "source": "/:year(\\d{4})/:month(\\d{2})/:slug",
    "destination": "/tin-tuc/:slug",
    "permanent": true
  }
];
  },
  async headers() {
    return [
      {
        // Cache static assets 1 year
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache fonts and SVGs
        source: '/(.*\.(?:svg|woff|woff2|ttf|otf))',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Security headers for all routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;

import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eurowindow - Cửa Nhôm, Cửa uPVC, Cửa Gỗ Cao Cấp',
    short_name: 'Eurowindow',
    description: 'Nhà cung cấp giải pháp tổng thể về vật liệu xây dựng xanh và hệ thống cửa cao cấp hàng đầu Việt Nam.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#004077',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

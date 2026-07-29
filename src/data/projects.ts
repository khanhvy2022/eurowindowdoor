export interface Project {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  category: 'quoc-gia' | 'chung-cu' | 'dan-dung';
  categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA' | 'TÒA NHÀ VP - CHUNG CƯ' | 'CÔNG TRÌNH DÂN DỤNG';
  categoryLabelEn?: string;
  location: string;
  locationEn?: string;
  image: string;
  imageAlt?: string;
  gallery?: string[];
  year: string;
  description: string;
  descriptionEn?: string;
  solution: string;
  solutionEn?: string;
  featured?: boolean;
}

export const projectsData: Project[] = [
  {
    id: '1',
    slug: 'cang-hang-khong-phu-bai-hue',
    name: 'CẢNG HÀNG KHÔNG PHÚ BÀI HUẾ',
    nameEn: 'PHU BAI INTERNATIONAL AIRPORT HUE',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    categoryLabelEn: 'NATIONAL KEY PROJECT',
    location: 'Thừa Thiên Huế',
    locationEn: 'Thua Thien Hue',
    image: '/images/eurowindow-cang-hang-khong-phu-bai-hue-t2.png.webp',
    imageAlt: 'Eurowindow thi công vách nhôm kính Cảng hàng không Phú Bài Huế Nhà ga T2',
    gallery: [
      '/images/eurowindow-cang-hang-khong-phu-bai-hue-t2.png.webp',
      '/images/eurowindow-phu-bai-airport-nha-ga-t2-full.png.webp',
    ],
    year: '2023',
    description: 'Dự án Nhà ga T2 Cảng hàng không Quốc tế Phú Bài là công trình hạ tầng hàng không trọng điểm quốc gia, với tổng mức đầu tư 2.250 tỷ đồng, thiết kế lấy cảm hứng từ kiến trúc điện Hòn Chén cung đình Huế.',
    descriptionEn: 'Terminal T2 project at Phu Bai International Airport is a key national aviation infrastructure project with a total investment of VND 2,250 billion, inspired by Hon Chen Royal Palace architecture in Hue.',
    solution: 'Eurowindow vinh dự thi công hơn 15.000m2 vách nhôm kính lớn Unitized chịu áp lực gió cấp 12, kính hộp 3 lớp cản nhiệt Low-E nạp khí Argon và hệ thống cửa tự động mắt thần công nghệ Thụy Sĩ.',
    solutionEn: 'Eurowindow constructed over 15,000m2 of Unitized curtain wall withstanding level 12 wind pressure, 3-layer Argon-filled Low-E insulated glass, and Swiss sensor automatic doors.',
    featured: true
  },
  {
    id: '10',
    slug: 'benh-vien-nhi-dong-tp-ho-chi-minh',
    name: 'Bệnh viện Nhi đồng TP. Hồ Chí Minh',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/dji-0090-1-large.jpg.webp',
    year: '2023',
    description: 'Bệnh viện Nhi đồng TP. Hồ Chí Minh là một công trình cấp quốc gia tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '11',
    slug: 'benh-vien-ung-buou-da-nang',
    name: 'Bệnh viện ung bướu Đà Nẵng',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/benh-vien-ung-buou-da-nang-17-large.jpg.webp',
    year: '2023',
    description: 'Bệnh viện ung bướu Đà Nẵng là một công trình cấp quốc gia tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '12',
    slug: 'toa-nha-van-phong-chinh-phu',
    name: 'Công trình Tòa nhà văn phòng Chính phủ',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/20190612-hanoi-cityscape-7928-large.jpg.webp',
    year: '2023',
    description: 'Công trình có quy mô 9 tầng nổi và 3 tầng hầm, được thiết kế theo phong cách bán cổ điển, đề cao tính an toàn, tiện nghi.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '13',
    slug: 'tru-so-bo-ngoai-giao',
    name: 'Công trình Trụ sở Bộ Ngoại giao',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/20191030-tru-so-bo-ngoai-giao-0719-large.jpg.webp',
    year: '2023',
    description: 'Tại dự án này, Eurowindow thi công lắp đặt hoàn thiện hơn 8.000 m2 cửa nhôm và vách nhôm kính lớn, cửa chống cháy…',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '14',
    slug: 'tru-so-van-phong-vien-kiem-sat-nhan-dan-toi-cao',
    name: 'Trụ sở Văn phòng Viện kiểm sát nhân dân tối cao',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/20191115-vien-kiem-soat-nhan-dan-toi-cao-0038-large.jpg.webp',
    year: '2023',
    description: 'Trụ sở Văn phòng Viện kiểm sát nhân dân tối cao là một công trình cấp quốc gia tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '15',
    slug: 'chung-cu-6th-element',
    name: 'Chung cư 6th Element',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/dji-0664-large.jpg.webp',
    year: '2023',
    description: 'Chung cư 6th Element là một tòa nhà - chung cư tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '16',
    slug: 'diamond-crown-hai-phong',
    name: 'DIAMOND CROWN HẢI PHÒNG',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2025/02/viber-image-2025-02-05-13-31-03-196-large.png.webp',
    year: '2023',
    description: 'DIAMOND CROWN HẢI PHÒNG là một tòa nhà - chung cư tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '17',
    slug: 'khach-san-da-nang-golden-bay',
    name: 'Khách sạn Đà Nẵng Golden Bay',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/hoa-binh-green-large.jpg.webp',
    year: '2023',
    description: 'Khách sạn Đà Nẵng Golden Bay là một tòa nhà - chung cư tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '18',
    slug: 'toa-nha-geleximco-building',
    name: 'Tòa nhà Geleximco Building',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/20200218-geleximco-36-hoang-cau-9367-large.jpg.webp',
    year: '2023',
    description: 'Tòa nhà Geleximco Building là một tòa nhà - chung cư tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '19',
    slug: 'viglacera-tower-thang-long-number-one',
    name: 'Viglacera Tower - Thăng Long Number One',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/20191030-viglacera-tower-thang-long-number-one-0736-large.jpg.webp',
    year: '2023',
    description: 'Viglacera Tower - Thăng Long Number One là một tòa nhà - chung cư tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '20',
    slug: 'biet-thu-kdt-green-pearl-378-minh-khai-ha-noi',
    name: 'Biệt thự KĐT Green Pearl 378 Minh Khai, Hà Nội',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/03/1-large.jpg.webp',
    year: '2023',
    description: 'Sự kết hợp giữa màu vàng đồng của tường rào, cổng, lan can và màu vân gỗ của cửa tạo nên điểm nhấn nổi bật cho tổng thông trình.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '21',
    slug: 'biet-thu-kdt-phu-thinh-p-phu-thinh-tx-son-tay-ha-noi',
    name: 'Biệt thự KĐT Phú Thịnh, P. Phú Thịnh, TX. Sơn Tây, Hà Nội',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/03/1-1-large.jpg.webp',
    year: '2023',
    description: 'Căn biệt thự 3 tầng tại KĐT Phú Thịnh, Sơn Tây mang phong cách Tân cổ điển sang trọng, thanh lịch và hiện đại với gam màu trắng chủ đạo, mái mansard đặc trưng.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '22',
    slug: 'du-an-khai-son-hill',
    name: 'Dự án Khai Sơn Hill',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/dji-0470-hdr-large.jpg.webp',
    year: '2023',
    description: 'Dự án Khai Sơn Hill là một dự án tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '23',
    slug: 'khu-do-thi-sala',
    name: 'Khu đô thị Sala',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/07/dji-0155-large.jpg.webp',
    year: '2023',
    description: 'Khu đô thị Sala là một dự án tiêu biểu sử dụng các sản phẩm cửa và vách kính Eurowindow cao cấp, kiến tạo không gian kiến trúc hiện đại, sang trọng và đảm bảo tiêu chuẩn chất lượng vượt trội.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
  {
    id: '24',
    slug: 'nha-pho-chua-thong-tx-son-tay-ha-noi',
    name: 'Nhà phố Chùa Thông, TX. Sơn Tây, Hà Nội',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    location: 'Việt Nam',
    image: 'https://storage.sudospaces.com/eurowindow/2022/03/1-2-large.jpg.webp',
    year: '2023',
    description: 'Với mong muốn sở hữu một không gian sống hiện đại, tiện nghị và yên tĩnh, gia chủ đã lựa chọn lắp đặt toàn bộ hệ thống cửa và vách kính Eurowindow.',
    solution: 'Thi công lắp đặt cửa và vách nhôm kính'
  },
];

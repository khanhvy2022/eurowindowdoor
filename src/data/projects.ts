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
    id: '2',
    slug: 'nha-quoc-hoi-viet-nam',
    name: 'NHÀ QUỐC HỘI VIỆT NAM',
    nameEn: 'VIETNAM NATIONAL ASSEMBLY BUILDING',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    categoryLabelEn: 'NATIONAL KEY PROJECT',
    location: 'Hà Nội',
    locationEn: 'Hanoi',
    image: '/images/eurowindow-nha-quoc-hoi-viet-nam-ba-dinh.jpg.webp',
    imageAlt: 'Eurowindow thi công cửa uPVC cửa gỗ chống cháy Nhà Quốc hội Việt Nam Ba Đình',
    gallery: [
      '/images/eurowindow-nha-quoc-hoi-viet-nam-ba-dinh.jpg.webp',
    ],
    year: '2014',
    description: 'Tòa nhà Quốc hội là biểu tượng quyền lực nhà nước, nơi diễn ra các kỳ họp trọng thể của Quốc hội Việt Nam tại trung tâm Quảng trường Ba Đình.',
    descriptionEn: 'The National Assembly Building is the symbol of state power, hosting solemn sessions of the National Assembly of Vietnam at Ba Dinh Square.',
    solution: 'Eurowindow thi công toàn bộ hệ thống cửa uPVC cách âm tiêu chuẩn 45dB, cửa gỗ chống cháy 120 phút và vách kính chống đạn đạt tiêu chuẩn an ninh cấp quốc gia.',
    solutionEn: 'Eurowindow constructed soundproof uPVC doors (45dB), 120-minute fireproof wooden doors, and bulletproof glass curtain walls meeting national security standards.',
    featured: true
  },
  {
    id: '3',
    slug: 'tru-so-bo-ngoai-giao',
    name: 'TRỤ SỞ BỘ NGOẠI GIAO',
    nameEn: 'MINISTRY OF FOREIGN AFFAIRS HEADQUARTERS',
    category: 'quoc-gia',
    categoryLabel: 'CÔNG TRÌNH CẤP QUỐC GIA',
    categoryLabelEn: 'NATIONAL KEY PROJECT',
    location: 'Hà Nội',
    locationEn: 'Hanoi',
    image: '/images/eurowindow-tru-so-bo-ngoai-giao-ha-noi.jpg.webp',
    imageAlt: 'Eurowindow lắp đặt vách nhôm kính trụ sở Bộ Ngoại giao Hà Nội',
    gallery: [
      '/images/eurowindow-tru-so-bo-ngoai-giao-ha-noi.jpg.webp',
    ],
    year: '2019',
    description: 'Trụ sở mới Bộ Ngoại giao là công trình kiến trúc hiện đại hòa quyện đường nét truyền thống, cơ quan đối ngoại hàng đầu của Chính phủ Việt Nam.',
    descriptionEn: 'The new headquarters of the Ministry of Foreign Affairs is a modern architectural masterpiece blending traditional lines for Vietnam government foreign affairs.',
    solution: 'Eurowindow lắp đặt vách nhôm kính lớn Stick giấu đố chịu tải trọng gió lớn, kính hộp phản quang cản nhiệt và cửa nhôm sơn tĩnh điện cao cấp.',
    solutionEn: 'Eurowindow installed concealed Stick curtain walls withstanding heavy wind loads, reflective heat-blocking double glazing, and premium powder-coated aluminum doors.',
    featured: true
  },
  {
    id: '4',
    slug: 'fpt-telecom-tower',
    name: 'FPT TELECOM TOWER (TP.HCM)',
    nameEn: 'FPT TELECOM TOWER (HCMC)',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    categoryLabelEn: 'OFFICE & APARTMENT TOWER',
    location: 'TP. Hồ Chí Minh',
    locationEn: 'Ho Chi Minh City',
    image: '/images/eurowindow-fpt-telecom-tower-tphcm-vach-kinh.jpg.webp',
    imageAlt: 'Eurowindow vách nhôm kính FPT Telecom Tower TP Hồ Chí Minh',
    gallery: [
      '/images/eurowindow-fpt-telecom-tower-tphcm-ngoai-that.jpg.webp',
      '/images/z7066183703283-45ad935ecdb67f25c190efa261d7f10c.jpg.webp'
    ],
    year: '2026',
    description: 'Tổ hợp tòa nhà văn phòng công nghệ hiện đại bậc nhất của Tập đoàn FPT tại Quận 7, TP.HCM.',
    descriptionEn: 'State-of-the-art tech office building complex of FPT Corporation in District 7, HCMC.',
    solution: 'Eurowindow trúng thầu thi công toàn bộ hệ cửa và vách nhôm kính lớn mặt ngoài, kính phủ phản quang kết hợp lam chắn nắng tự động.',
    solutionEn: 'Eurowindow won the contract to install all exterior doors, large glass curtain walls, heat-reflective glazing, and automated sunshades.',
    featured: true
  },
  {
    id: '5',
    slug: 'the-residences-at-arbora-quang-nam',
    name: 'TỔ HỢP NGHỈ DƯỠNG THE RESIDENCES AT ARBORA',
    nameEn: 'THE RESIDENCES AT ARBORA RESORT COMPLEX',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    categoryLabelEn: 'OFFICE & APARTMENT TOWER',
    location: 'Quảng Nam',
    locationEn: 'Quang Nam',
    image: '/images/ew-proj-the-residences-at-arbora-quang-nam-1.jpg.webp',
    imageAlt: 'Eurowindow thi công TỔ HỢP NGHỈ DƯỠNG THE RESIDENCES AT ARBORA Quảng Nam',
    gallery: [
      '/images/ew-proj-the-residences-at-arbora-quang-nam-1.jpg.webp',
      '/images/ew-proj-the-residences-at-arbora-quang-nam-2.jpg.webp'
    ],
    year: '2026',
    description: 'Tổ hợp biệt thự nghỉ dưỡng và khách sạn 5 sao cao cấp ven biển Điện Bàn, Quảng Nam.',
    descriptionEn: 'Luxury beachfront villa resort and 5-star hotel complex in Dien Ban, Quang Nam.',
    solution: 'Cung cấp hệ cửa nhôm cao cấp chống ăn mòn muối biển AkzoNobel bảo hành 20 năm kết hợp kính hộp cản nhiệt an toàn.',
    solutionEn: 'Supplied sea-salt corrosion resistant AkzoNobel aluminum doors with 20-year warranty and insulated safety glass.',
    featured: true
  },
  {
    id: '6',
    slug: 'eurowindow-office-building',
    name: 'EUROWINDOW OFFICE BUILDING',
    nameEn: 'EUROWINDOW OFFICE BUILDING',
    category: 'chung-cu',
    categoryLabel: 'TÒA NHÀ VP - CHUNG CƯ',
    categoryLabelEn: 'OFFICE & APARTMENT TOWER',
    location: 'Hà Nội',
    locationEn: 'Hanoi',
    image: '/images/ew-proj-eurowindow-office-building-1.jpg.webp',
    imageAlt: 'Eurowindow thi công EUROWINDOW OFFICE BUILDING Hà Nội',
    gallery: [
      '/images/ew-proj-eurowindow-office-building-1.jpg.webp',
      '/images/ew-proj-eurowindow-office-building-2.jpg.webp',
      '/images/ew-proj-eurowindow-office-building-3.jpg.webp'
    ],
    year: '2017',
    description: 'Tòa nhà văn phòng hạng A tại số 39 Bis Mạc Đĩnh Chi, P.Tân Định, TP.HCM.',
    descriptionEn: 'Grade A office building located at No.2 Ton That Tung, Dong Da, Hanoi.',
    solution: 'Hệ thống vách kính bao che hai lớp double-skin façade cách âm và tiết kiệm 35% năng lượng tiêu thụ.',
    solutionEn: 'Double-skin glass facade system providing sound insulation and reducing 35% energy consumption.',
    featured: true
  },
  {
    id: '7',
    slug: 'biet-thu-vinhomes-riverside',
    name: 'BIỆT THỰ VINHOMES RIVERSIDE',
    nameEn: 'VINHOMES RIVERSIDE VILLAS',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    categoryLabelEn: 'CIVIL RESIDENTIAL PROJECT',
    location: 'Hà Nội',
    locationEn: 'Hanoi',
    image: '/images/ew-proj-biet-thu-vinhomes-riverside-1.jpg.webp',
    imageAlt: 'Eurowindow thi công BIỆT THỰ VINHOMES RIVERSIDE Hà Nội',
    gallery: [
      '/images/ew-proj-biet-thu-vinhomes-riverside-1.jpg.webp',
      '/images/ew-proj-biet-thu-vinhomes-riverside-2.jpg.webp'
    ],
    year: '2024',
    description: 'Quần thể biệt thự sinh thái cao cấp ven sông phong cách Venice tại Long Biên, Hà Nội.',
    descriptionEn: 'Luxury Venice-style riverside eco-villas in Long Bien, Hanoi.',
    solution: 'Cửa nhôm có cầu cách nhiệt cao cấp combined kính hộp 3 lớp nạp khí Argon, ngăn 99% tia UV.',
    solutionEn: 'Thermally broken aluminum doors combined with 3-layer Argon-filled insulated glass blocking 99% UV.',
    featured: true
  },
  {
    id: '8',
    slug: 'biet-thu-ocean-park',
    name: 'BIỆT THỰ BIỂN OCEAN PARK HẠ LONG',
    nameEn: 'OCEAN PARK HA LONG BEACH VILLAS',
    category: 'dan-dung',
    categoryLabel: 'CÔNG TRÌNH DÂN DỤNG',
    categoryLabelEn: 'CIVIL RESIDENTIAL PROJECT',
    location: 'Quảng Ninh',
    locationEn: 'Quang Ninh',
    image: '/images/ew-proj-biet-thu-ocean-park-1.jpg.webp',
    imageAlt: 'Eurowindow thi công BIỆT THỰ BIỂN OCEAN PARK HẠ LONG Quảng Ninh',
    gallery: [
      '/images/ew-proj-biet-thu-ocean-park-1.jpg.webp',
      '/images/ew-proj-biet-thu-ocean-park-2.jpg.webp'
    ],
    year: '2025',
    description: 'Biệt thự nghỉ dưỡng cao cấp trực diện biển Bãi Cháy, Hạ Long.',
    descriptionEn: 'Luxury beachfront resort villas in Bai Chay, Ha Long.',
    solution: 'Cửa nhôm sơn tĩnh điện bột sơn chống mặn kết hợp hệ cửa lùa nâng kéo sang trọng.',
    solutionEn: 'Anti-salt powder coated aluminum doors combined with elegant lift-and-slide door systems.',
    featured: true
  }
];

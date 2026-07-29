export interface Showroom {
  id: string;
  name: string;
  nameEn?: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  city: string;
  address: string;
  addressEn?: string;
  phone: string;
  email?: string;
  hours?: string;
  isHeadquarter?: boolean;
}

export const showroomsData: Showroom[] = [
  // Miền Bắc
  {
    id: 'hn-1',
    name: 'Showroom & Trụ sở chính',
    nameEn: 'Headquarters & Showroom',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Tòa nhà Văn phòng Eurowindow Office Building, Số 02 Tôn Thất Tùng, Kim Liên, Hà Nội',
    addressEn: 'Eurowindow Office Building, No. 02 Ton That Tung, Kim Lien, Hanoi',
    phone: '0966 994 338',
    email: 'thangtq2@eurowindow.biz',
    hours: '08:00 - 17:30 (Thứ 2 - Thứ 6)',
    isHeadquarter: true
  },
  {
    id: 'hn-2',
    name: 'Showroom Nguyễn Trãi',
    nameEn: 'Nguyen Trai Showroom',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Số 52 Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội',
    addressEn: '52 Nguyen Trai, Thuong Dinh Ward, Thanh Xuan District, Hanoi',
    phone: '024 3558 3588',
    hours: '08:00 - 18:00'
  },
  {
    id: 'hn-3',
    name: 'Showroom Hoàng Quốc Việt',
    nameEn: 'Hoang Quoc Viet Showroom',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Số 236 Hoàng Quốc Việt, Quận Cầu Giấy, Hà Nội',
    addressEn: '236 Hoang Quoc Viet, Cau Giay District, Hanoi',
    phone: '024 3791 2288',
    hours: '08:00 - 18:00'
  },
  {
    id: 'hn-4',
    name: 'Showroom Long Biên',
    nameEn: 'Long Bien Showroom',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Số 531 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội',
    addressEn: '531 Nguyen Van Cu, Long Bien District, Hanoi',
    phone: '024 3873 6688',
    hours: '08:00 - 18:00'
  },
  {
    id: 'hp-1',
    name: 'Showroom Lạch Tray',
    nameEn: 'Lach Tray Showroom',
    region: 'Miền Bắc',
    city: 'Hải Phòng',
    address: 'Số 314 Lạch Tray, Quận Ngô Quyền, TP. Hải Phòng',
    addressEn: '314 Lach Tray, Ngo Quyen District, Hai Phong',
    phone: '0225 373 7555',
    hours: '08:00 - 17:30'
  },
  {
    id: 'qn-1',
    name: 'Showroom Hạ Long',
    nameEn: 'Ha Long Showroom',
    region: 'Miền Bắc',
    city: 'Quảng Ninh',
    address: 'Số 586 Nguyễn Văn Cừ, TP. Hạ Long, Quảng Ninh',
    addressEn: '586 Nguyen Van Cu, Ha Long City, Quang Ninh',
    phone: '0203 383 8668',
    hours: '08:00 - 17:30'
  },
  {
    id: 'hy-1',
    name: 'Showroom Hưng Yên',
    nameEn: 'Hung Yen Showroom',
    region: 'Miền Bắc',
    city: 'Hưng Yên',
    address: 'Khu Công Nghiệp Như Quỳnh, Huyện Văn Lâm, Hưng Yên',
    addressEn: 'Nhu Quynh Industrial Zone, Van Lam District, Hung Yen',
    phone: '0221 398 7654',
    hours: '08:00 - 17:30'
  },

  // Miền Trung
  {
    id: 'dn-1',
    name: 'Showroom & Văn phòng Đà Nẵng',
    nameEn: 'Da Nang Branch Office & Showroom',
    region: 'Miền Trung',
    city: 'Đà Nẵng',
    address: 'Số 263 Nguyễn Văn Linh, Quận Thanh Khê, TP. Đà Nẵng',
    addressEn: '263 Nguyen Van Linh, Thanh Khe District, Da Nang',
    phone: '0236 374 7470',
    email: 'danang@eurowindowdoor.com',
    hours: '08:00 - 17:30'
  },
  {
    id: 'dn-2',
    name: 'Showroom Ngô Quyền',
    nameEn: 'Ngo Quyen Showroom',
    region: 'Miền Trung',
    city: 'Đà Nẵng',
    address: 'Số 120 Ngô Quyền, Quận Sơn Trà, TP. Đà Nẵng',
    addressEn: '120 Ngo Quyen, Son Tra District, Da Nang',
    phone: '0236 393 8888',
    hours: '08:00 - 17:30'
  },
  {
    id: 'na-1',
    name: 'Showroom TP. Vinh',
    nameEn: 'Vinh City Showroom',
    region: 'Miền Trung',
    city: 'Nghệ An',
    address: 'Số 150 Nguyễn Thị Minh Khai, TP. Vinh, Nghệ An',
    addressEn: '150 Nguyen Thi Minh Khai, Vinh City, Nghe An',
    phone: '0238 384 4567',
    hours: '08:00 - 17:30'
  },
  {
    id: 'nt-1',
    name: 'Showroom Nha Trang',
    nameEn: 'Nha Trang Showroom',
    region: 'Miền Trung',
    city: 'Khánh Hòa',
    address: 'Số 82 Lê Hồng Phong, TP. Nha Trang, Khánh Hòa',
    addressEn: '82 Le Hong Phong, Nha Trang City, Khanh Hoa',
    phone: '0258 387 2345',
    hours: '08:00 - 17:30'
  },

  // Miền Nam
  {
    id: 'hcm-1',
    name: 'Văn phòng Chi nhánh Miền Nam',
    nameEn: 'Southern Branch Office',
    region: 'Miền Nam',
    city: 'TP. Hồ Chí Minh',
    address: '39 Bis Mạc Đĩnh Chi, P. Tân Định, TP.HCM',
    addressEn: '39 Bis Mac Dinh Chi, Tan Dinh Ward, HCMC',
    phone: '0966 994 338',
    email: 'thangtq2@eurowindow.biz',
    hours: '08:00 - 17:30 (Thứ 2 - Thứ 6)'
  },
  {
    id: 'hcm-2',
    name: 'Showroom Tân Bình',
    nameEn: 'Tan Binh Showroom',
    region: 'Miền Nam',
    city: 'TP. Hồ Chí Minh',
    address: 'Số 284 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM',
    addressEn: '284 Ly Thuong Kiet, Ward 14, District 10, HCMC',
    phone: '028 3863 5888',
    hours: '08:00 - 18:00'
  },
  {
    id: 'hcm-3',
    name: 'Showroom Thủ Đức',
    nameEn: 'Thu Duc Showroom',
    region: 'Miền Nam',
    city: 'TP. Hồ Chí Minh',
    address: 'Số 562 Phước Long B, TP. Thủ Đức, TP.HCM',
    addressEn: '562 Phuoc Long B, Thu Duc City, HCMC',
    phone: '028 3728 1999',
    hours: '08:00 - 18:00'
  },
  {
    id: 'bd-1',
    name: 'Showroom & Nhà máy Bình Dương',
    nameEn: 'Binh Duong Factory & Showroom',
    region: 'Miền Nam',
    city: 'Bình Dương',
    address: 'Số 16 Đường ĐT 743, KCN Sóng Thần 1, Dĩ An, Bình Dương',
    addressEn: '16 DT 743 Street, Song Than 1 IP, Di An, Binh Duong',
    phone: '0274 379 0999',
    hours: '08:00 - 17:30'
  },
  {
    id: 'ct-1',
    name: 'Showroom Cần Thơ',
    nameEn: 'Can Tho Showroom',
    region: 'Miền Nam',
    city: 'Cần Thơ',
    address: 'Số 45 Đường 3 Tháng 2, Quận Ninh Kiều, TP. Cần Thơ',
    addressEn: '45 3 Thang 2 Street, Ninh Kieu District, Can Tho',
    phone: '0292 383 1234',
    hours: '08:00 - 17:30'
  }
];

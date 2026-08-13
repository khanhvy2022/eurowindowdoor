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
  // MIỀN BẮC - SHOWROOM
  {
    id: 'hn-ton-that-tung',
    name: 'SHOWROOM TÔN THẤT TÙNG',
    nameEn: 'TON THAT TUNG SHOWROOM',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Số 2 Tôn Thất Tùng, Phường Kim Liên, Thành phố Hà Nội',
    addressEn: 'No. 2 Ton That Tung, Kim Lien Ward, Hanoi',
    phone: '(84 - 24) 3 7 47 47 77 - 0909 888 000',
    email: 'Showroom.lnd@eurowindow.biz',
    hours: '08:00 - 18:00',
    isHeadquarter: true
  },
  {
    id: 'hn-multi-complex',
    name: 'SHOWROOM EUROWINDOW MULTI COMPLEX',
    nameEn: 'EUROWINDOW MULTI COMPLEX SHOWROOM',
    region: 'Miền Bắc',
    city: 'Hà Nội',
    address: 'Tầng 1 & 4, Tòa nhà Eurowindow Multi Complex, số 27 Trần Duy Hưng, Phường Cầu Giấy, Thành phố Hà Nội',
    addressEn: 'Floor 1 & 4, Eurowindow Multi Complex, 27 Tran Duy Hung, Cau Giay Ward, Hanoi',
    phone: '(84 - 24) 3577 4777 - 0909 888 000',
    email: 'Showroom.lnd@eurowindow.biz',
    hours: '08:00 - 18:00'
  },
  {
    id: 'hp-vo-nguyen-giap',
    name: 'SHOWROOM HẢI PHÒNG',
    nameEn: 'HAI PHONG SHOWROOM',
    region: 'Miền Bắc',
    city: 'Hải Phòng',
    address: '463 đường Võ Nguyên Giáp, Phường Lê Chân, Thành phố Hải Phòng',
    addressEn: '463 Vo Nguyen Giap Street, Le Chan Ward, Hai Phong',
    phone: '(84-225) 3 956 111/ 3 956 222 - 0909 888 000',
    email: 'Showroom.hp@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'qn-vinh-huy',
    name: 'SHOWROOM QUẢNG NINH',
    nameEn: 'QUANG NINH SHOWROOM',
    region: 'Miền Bắc',
    city: 'Quảng Ninh',
    address: 'Số 40, Đường Vĩnh Huy, Phường Hạ Long, Tỉnh Quảng Ninh',
    addressEn: 'No. 40, Vinh Huy Street, Ha Long Ward, Quang Ninh',
    phone: '(84-203) 3 55 66 69/ 3 55 66 89 - 0909 888 000',
    email: 'Showroom.qn@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'th-hoa-chau',
    name: 'SHOWROOM THANH HÓA',
    nameEn: 'THANH HOA SHOWROOM',
    region: 'Miền Bắc',
    city: 'Thanh Hóa',
    address: 'Căn SH 17, đường Hoa Châu, KĐT Eurowindow Garden City, phường Hạc Thành, Tỉnh Thanh Hóa',
    addressEn: 'SH 17, Hoa Chau Street, Eurowindow Garden City, Hac Thanh Ward, Thanh Hoa',
    phone: '(84 - 237) 3964 961 - 0909 888 000',
    email: 'Showroom.th@eurowindow.biz',
    hours: '08:00 - 17:30'
  },

  // MIỀN TRUNG - SHOWROOM / VĂN PHÒNG
  {
    id: 'na-thai-phien',
    name: 'SHOWROOM VINH',
    nameEn: 'VINH SHOWROOM',
    region: 'Miền Trung',
    city: 'Nghệ An',
    address: 'Căn 15NB Khu nhà Phố Vicentra, đường Thái Phiên, Phường Thành Vinh, Tỉnh Nghệ An',
    addressEn: '15NB Vicentra Townhouse, Thai Phien Street, Thanh Vinh Ward, Nghe An',
    phone: '(84 - 238) 3 588 808/3 588 807 - 0909 888 000',
    email: 'Showroom.vinh@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'qt-huu-nghi',
    name: 'VĂN PHÒNG QUẢNG TRỊ',
    nameEn: 'QUANG TRI OFFICE',
    region: 'Miền Trung',
    city: 'Quảng Trị',
    address: '126A đường Hữu Nghị, phường Đồng Hới, Tỉnh Quảng Trị',
    addressEn: '126A Huu Nghi Street, Dong Hoi Ward, Quang Tri',
    phone: '0913 543 138',
    email: 'tuanpv6@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'dn-phan-dang-luu',
    name: 'SHOWROOM PHAN ĐĂNG LƯU',
    nameEn: 'PHAN DANG LUU SHOWROOM',
    region: 'Miền Trung',
    city: 'Đà Nẵng',
    address: '152 Phan Đăng Lưu, Phường Hòa Cường, Thành phố Đà Nẵng',
    addressEn: '152 Phan Dang Luu, Hoa Cuong Ward, Da Nang',
    phone: '(84 - 236) 3 582 877/3 582 899 - 0906 000 111',
    email: 'cn-dn@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'dl-phan-chu-trinh',
    name: 'SHOWROOM BUÔN MA THUỘT',
    nameEn: 'BUON MA THUOT SHOWROOM',
    region: 'Miền Trung',
    city: 'Đắk Lắk',
    address: '42 Phan Chu Trinh, Phường Buôn Ma Thuột, Tỉnh Đắk Lắk',
    addressEn: '42 Phan Chu Trinh, Buon Ma Thuot Ward, Dak Lak',
    phone: '(84 - 262) 393 61 61 - 0903 11 8888',
    email: 'Showroom.bmt@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'kh-le-hong-phong',
    name: 'SHOWROOM NHA TRANG',
    nameEn: 'NHA TRANG SHOWROOM',
    region: 'Miền Trung',
    city: 'Khánh Hòa',
    address: '344 Lê Hồng Phong, phường Nam Nha Trang, Tỉnh Khánh Hòa',
    addressEn: '344 Le Hong Phong, Nam Nha Trang Ward, Khanh Hoa',
    phone: '(84 - 258) 6 250 289 - 0903 11 8888',
    email: 'showroom.nt@eurowindow.biz',
    hours: '08:00 - 17:30'
  },

  // MIỀN NAM - SHOWROOM
  {
    id: 'hcm-mac-dinh-chi',
    name: 'SHOWROOM MẠC ĐĨNH CHI',
    nameEn: 'MAC DINH CHI SHOWROOM',
    region: 'Miền Nam',
    city: 'TP. Hồ Chí Minh',
    address: '39 Bis Mạc Đĩnh Chi, Phường Tân Định, Thành phố Hồ Chí Minh',
    addressEn: '39 Bis Mac Dinh Chi, Tan Dinh Ward, HCMC',
    phone: '(84 - 28) 6278 8124 - 0903 11 8888',
    email: 'Showroom.mdc@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'dn-pham-van-thuan',
    name: 'SHOWROOM BIÊN HÒA',
    nameEn: 'BIEN HOA SHOWROOM',
    region: 'Miền Nam',
    city: 'Đồng Nai',
    address: '931 Phạm Văn Thuận, Phường Tam Hiệp, Tỉnh Đồng Nai',
    addressEn: '931 Pham Van Thuan, Tam Hiep Ward, Dong Nai',
    phone: '(84 - 251) 730 7368 - 0903 11 8888',
    email: 'showroom.bh@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'vt-huyen-tran-cong-chua',
    name: 'SHOWROOM VŨNG TÀU',
    nameEn: 'VUNG TAU SHOWROOM',
    region: 'Miền Nam',
    city: 'Bà Rịa - Vũng Tàu',
    address: '112 Huyền Trân Công Chúa, Phường Thắng Tam, Thành phố Vũng Tàu',
    addressEn: '112 Huyen Tran Cong Chua, Thang Tam Ward, Vung Tau',
    phone: '(84 - 254) 6 255 145 - 0903 11 8888',
    email: 'showroom.vt@eurowindow.biz',
    hours: '08:00 - 17:30'
  },
  {
    id: 'ct-hong-loan',
    name: 'SHOWROOM CẦN THƠ',
    nameEn: 'CAN THO SHOWROOM',
    region: 'Miền Nam',
    city: 'Cần Thơ',
    address: 'Lô số 12- Đường Số 03, Khu Dân Cư Hồng Loan – Lô Số 5C, Phường Cái Răng, Thành phố Cần Thơ',
    addressEn: 'Lot 12, Street 3, Hong Loan Res Area - Lot 5C, Cai Rang Ward, Can Tho',
    phone: '(84 - 292) 6 250 679 - 0903 11 8888',
    email: 'showroom.ct@eurowindow.biz',
    hours: '08:00 - 17:30'
  },

  // ĐIỂM BÁN (POS)
  {
    id: 'pos-hp-truong-chinh',
    name: 'POS HẢI PHÒNG',
    nameEn: 'HAI PHONG POS',
    region: 'Miền Bắc',
    city: 'Hải Phòng',
    address: 'Lô số 41.4, Đường Trường Chinh, Phường Lê Thanh Nghị, Thành phố Hải Phòng',
    addressEn: 'Lot 41.4, Truong Chinh Street, Le Thanh Nghi Ward, Hai Phong',
    phone: '0978 039 279',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-nb-hoa-lu',
    name: 'POS NINH BÌNH (HOA LƯ)',
    nameEn: 'NINH BINH POS (HOA LU)',
    region: 'Miền Bắc',
    city: 'Ninh Bình',
    address: 'Phố 11, Phường Hoa Lư, Tỉnh Ninh Bình',
    addressEn: 'Street 11, Hoa Lu Ward, Ninh Binh',
    phone: '0984 798 518',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-nb-le-cong-thanh',
    name: 'POS NINH BÌNH (LÊ CÔNG THÀNH)',
    nameEn: 'NINH BINH POS (LE CONG THANH)',
    region: 'Miền Bắc',
    city: 'Ninh Bình',
    address: 'Số 109 Đường Lê Công Thanh, Phường Hà Nam, Tỉnh Ninh Bình',
    addressEn: 'No. 109 Le Cong Thanh Street, Ha Nam Ward, Ninh Binh',
    phone: '0974 727 312 / 0984 764 568',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-lc-yen-bai',
    name: 'POS LÀO CAI',
    nameEn: 'LAO CAI POS',
    region: 'Miền Bắc',
    city: 'Lào Cai',
    address: 'Tổ 4, Phường Yên Bái, Tỉnh Lào Cai',
    addressEn: 'Group 4, Yen Bai Ward, Lao Cai',
    phone: '0906 074 268',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-cb-thuc-phan',
    name: 'POS CAO BẰNG',
    nameEn: 'CAO BANG POS',
    region: 'Miền Bắc',
    city: 'Cao Bằng',
    address: 'Lô 15, Khu TĐC số 01, Tổ 9, Phường Thục Phán, Tỉnh Cao Bằng',
    addressEn: 'Lot 15, Resettlement Area 01, Group 9, Thuc Phan Ward, Cao Bang',
    phone: '0914 246 366',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-bn-le-loi',
    name: 'POS BẮC NINH',
    nameEn: 'BAC NINH POS',
    region: 'Miền Bắc',
    city: 'Bắc Ninh',
    address: 'Số 800 Đường Lê Lợi, Phường Bắc Giang, Tỉnh Bắc Ninh',
    addressEn: 'No. 800 Le Loi Street, Bac Giang Ward, Bac Ninh',
    phone: '0974 636 525',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-tn-duc-xuan',
    name: 'POS THÁI NGUYÊN',
    nameEn: 'THAI NGUYEN POS',
    region: 'Miền Bắc',
    city: 'Thái Nguyên',
    address: 'Số 393, Tổ 9A, Phường Đức Xuân, Tỉnh Thái Nguyên',
    addressEn: 'No. 393, Group 9A, Duc Xuan Ward, Thai Nguyen',
    phone: '0967 916 660',
    hours: '08:00 - 17:30'
  },
  {
    id: 'pos-sl-chu-van-thinh',
    name: 'POS SƠN LA',
    nameEn: 'SON LA POS',
    region: 'Miền Bắc',
    city: 'Sơn La',
    address: 'Số 298 đường Chu Văn Thịnh, Phường Tô Hiệu, Tỉnh Sơn La',
    addressEn: 'No. 298 Chu Van Thinh Street, To Hieu Ward, Son La',
    phone: '0989 196 588',
    hours: '08:00 - 17:30'
  }
];

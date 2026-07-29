'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'VN' | 'ENG';

interface Translations {
  [key: string]: {
    VN: string;
    ENG: string;
  };
}

const translations: Translations = {
  // ── Navigation ──
  nav_about: { VN: 'GIỚI THIỆU', ENG: 'ABOUT US' },
  nav_products: { VN: 'SẢN PHẨM', ENG: 'PRODUCTS' },
  nav_showroom: { VN: 'SHOWROOM', ENG: 'SHOWROOMS' },
  nav_projects: { VN: 'CÔNG TRÌNH TIÊU BIỂU', ENG: 'PROJECTS' },
  nav_documents: { VN: 'TÀI LIỆU', ENG: 'DOCUMENTS' },
  nav_news: { VN: 'TIN TỨC', ENG: 'NEWS' },
  nav_policies: { VN: 'CHÍNH SÁCH', ENG: 'POLICIES' },
  nav_contact: { VN: 'LIÊN HỆ', ENG: 'CONTACT' },
  nav_consultation: { VN: 'NHẬN TƯ VẤN', ENG: 'GET ADVICE' },
  nav_search_placeholder: { VN: 'Tìm kiếm sản phẩm, tin tức...', ENG: 'Search products, news...' },

  // ── Hero & General ──
  hero_discover: { VN: 'Khám phá ngay', ENG: 'Discover Now' },
  view_all: { VN: 'Xem tất cả', ENG: 'View All' },
  read_more: { VN: 'Xem chi tiết', ENG: 'Read Details' },
  genuine: { VN: 'Chính Hãng', ENG: 'Genuine' },
  details: { VN: 'Chi tiết', ENG: 'Details' },
  see_all_models: { VN: 'Xem Tất Cả Mẫu', ENG: 'View All Models' },
  home: { VN: 'Trang chủ', ENG: 'Home' },

  // ── Showroom Page ──
  sr_title: { VN: 'Hệ thống Showroom & Chi nhánh', ENG: 'Showroom & Branch Network' },
  sr_breadcrumb: { VN: 'Trang chủ / Showroom', ENG: 'Home / Showroom' },
  sr_locations: { VN: 'địa điểm trên toàn quốc', ENG: 'locations nationwide' },
  sr_all_regions: { VN: 'Tất cả', ENG: 'All Regions' },
  sr_north: { VN: 'Miền Bắc', ENG: 'North' },
  sr_central: { VN: 'Miền Trung', ENG: 'Central' },
  sr_south: { VN: 'Miền Nam', ENG: 'South' },
  sr_search_ph: { VN: 'Tìm thành phố, địa chỉ...', ENG: 'Search city, address...' },
  sr_headquarter: { VN: 'Trụ sở chính', ENG: 'Headquarters' },
  sr_address_label: { VN: 'Địa chỉ:', ENG: 'Address:' },
  sr_hotline_label: { VN: 'Hotline:', ENG: 'Hotline:' },
  sr_hours_label: { VN: 'Giờ mở:', ENG: 'Hours:' },
  sr_call_btn: { VN: 'Gọi showroom', ENG: 'Call showroom' },
  sr_directions: { VN: 'Chỉ đường', ENG: 'Directions' },

  // ── Contact Page ──
  contact_title: { VN: 'Liên hệ với Eurowindow', ENG: 'Contact Eurowindow' },
  contact_form_title: { VN: 'Gửi thông tin liên hệ', ENG: 'Send Contact Request' },
  contact_name_label: { VN: 'Họ và tên *', ENG: 'Full Name *' },
  contact_name_ph: { VN: 'Nhập họ và tên', ENG: 'Enter full name' },
  contact_phone_label: { VN: 'Số điện thoại *', ENG: 'Phone Number *' },
  contact_phone_ph: { VN: 'Nhập số điện thoại', ENG: 'Enter phone number' },
  contact_email_label: { VN: 'Email', ENG: 'Email Address' },
  contact_email_ph: { VN: 'Nhập địa chỉ email', ENG: 'Enter email address' },
  contact_message_label: { VN: 'Nội dung liên hệ', ENG: 'Message' },
  contact_message_ph: { VN: 'Nhập nội dung cần tư vấn...', ENG: 'Enter your inquiry details...' },
  contact_submit_btn: { VN: 'Gửi yêu cầu', ENG: 'Submit Request' },
  contact_hq_title: { VN: 'Trụ sở chính', ENG: 'Headquarters' },
  contact_hq_address: { VN: 'Tòa nhà Văn phòng Eurowindow Office Building, Số 02 Tôn Thất Tùng, Kim Liên, Hà Nội', ENG: 'Eurowindow Office Building, No. 02 Ton That Tung, Kim Lien, Hanoi' },
  contact_south_title: { VN: 'Chi Nhánh Miền Nam', ENG: 'Southern Branch' },
  contact_south_address: { VN: '39 Bis Mạc Đĩnh Chi, P. Tân Định, TP.HCM', ENG: '39 Bis Mac Dinh Chi St., Tan Dinh Ward, HCMC' },

  // ── Documents Page ──
  doc_title: { VN: 'Tài liệu & Catalogue chính thức', ENG: 'Official Documents & Catalogues' },
  doc_breadcrumb: { VN: 'Trang chủ / Tài liệu', ENG: 'Home / Documents' },
  doc_count_label: { VN: 'tệp tài liệu', ENG: 'document files' },
  doc_cat_all: { VN: 'Tất cả', ENG: 'All Categories' },
  doc_cat_catalogue: { VN: 'Catalogue', ENG: 'Catalogue' },
  doc_cat_price: { VN: 'Báo giá', ENG: 'Price List' },
  doc_cat_guide: { VN: 'Hướng dẫn', ENG: 'User Guide' },
  doc_cat_cert: { VN: 'Chứng nhận', ENG: 'Certificates' },
  doc_download_btn: { VN: 'Tải về (PDF)', ENG: 'Download (PDF)' },
  doc_downloading: { VN: 'Đang tải...', ENG: 'Downloading...' },

  // ── Policies Page ──
  policy_title: { VN: 'Chính sách & Quy định', ENG: 'Policies & Regulations' },
  policy_s1_title: { VN: '1. Chính sách bảo hành sản phẩm', ENG: '1. Product Warranty Policy' },
  policy_s1_p1: {
    VN: 'Eurowindow cam kết bảo hành chính hãng lên đến 10 năm cho các dòng sản phẩm thanh profile uPVC và nhôm cao cấp, 5 năm cho phụ kiện kim khí đồng bộ.',
    ENG: 'Eurowindow commits to genuine warranty up to 10 years for uPVC profiles and high-grade aluminum product lines, 5 years for synchronized hardware accessories.'
  },
  policy_s1_li1: { VN: 'Bảo trì miễn phí định kỳ trong 2 năm đầu tiên kể từ ngày bàn giao.', ENG: 'Free periodic maintenance during the first 2 years from delivery date.' },
  policy_s1_li2: { VN: 'Hỗ trợ xử lý sự cố trong vòng 24h đối với khu vực nội thành.', ENG: 'Incident response support within 24 hours for urban areas.' },
  policy_s2_title: { VN: '2. Chính sách bảo mật thông tin', ENG: '2. Privacy & Information Security Policy' },
  policy_s2_p1: {
    VN: 'Mọi thông tin cá nhân của Quý khách hàng cung cấp qua website Eurowindow.biz được bảo mật tuyệt đối theo tiêu chuẩn ISO/IEC 27001 và không chia sẻ cho bất kỳ bên thứ ba nào.',
    ENG: 'All personal information provided by customers via Eurowindow.biz is strictly secured under ISO/IEC 27001 standards and never shared with third parties.'
  },
  policy_s3_title: { VN: '3. Quy trình thanh toán & Giao hàng', ENG: '3. Payment & Delivery Process' },
  policy_s3_p1: {
    VN: 'Eurowindow hỗ trợ thanh toán linh hoạt qua chuyển khoản ngân hàng, tiền mặt và hỗ trợ vận chuyển tận nơi công trình trên toàn quốc.',
    ENG: 'Eurowindow supports flexible payment via bank transfer or cash, alongside nationwide direct site delivery support.'
  },

  // ── Projects Listing & Detail Page ──
  proj_page_title: { VN: 'Công trình tiêu biểu Eurowindow', ENG: 'Eurowindow Featured Projects' },
  proj_completed_count: { VN: 'dự án hoàn thành', ENG: 'completed projects' },
  proj_view_detail: { VN: 'Xem chi tiết', ENG: 'View details' },
  proj_location_label: { VN: 'Địa điểm:', ENG: 'Location:' },
  proj_year_label: { VN: 'Năm hoàn thành:', ENG: 'Completion Year:' },
  proj_category_label: { VN: 'Phân loại:', ENG: 'Category:' },
  proj_consult_similar: { VN: 'Tư vấn công trình tương tự', ENG: 'Consult Similar Project' },
  proj_info_title: { VN: 'Thông tin dự án', ENG: 'Project Details' },
  proj_overview_title: { VN: 'Giới thiệu tổng quan dự án', ENG: 'Project Overview' },
  proj_solution_title: { VN: 'Giải pháp kỹ thuật Eurowindow thi công', ENG: 'Eurowindow Technical Solution' },
  proj_gallery_title: { VN: 'Hình ảnh thi công thực tế', ENG: 'Construction Gallery' },
  proj_other_title: { VN: 'Công trình tiêu biểu khác', ENG: 'Other Featured Projects' },
  proj_need_consult: { VN: 'Bạn cần tư vấn?', ENG: 'Need Consultation?' },
  proj_need_consult_desc: {
    VN: 'Liên hệ chuyên viên Eurowindow để được khảo sát và tư vấn giải pháp phù hợp nhất cho công trình của bạn.',
    ENG: 'Contact Eurowindow specialists for a survey and tailor-made solution for your project.'
  },
  proj_free_consult_btn: { VN: 'Nhận tư vấn miễn phí', ENG: 'Get Free Advice' },

  // ── Introduce Section ──
  intro_badge: { VN: 'Về Thương Hiệu Eurowindow', ENG: 'About Eurowindow Brand' },
  intro_title: { VN: 'Giới thiệu', ENG: 'About Us' },
  intro_highlight: {
    VN: 'Năm 2002, Eurowindow tiên phong đưa cửa hiện đại uPVC tiêu chuẩn Châu Âu vào thị trường trong nước, làm nên cuộc cách mạng về cửa và mở ra "kỷ nguyên mới" cho những ngôi nhà Việt.',
    ENG: 'In 2002, Eurowindow pioneered European-standard uPVC doors into Vietnam, creating a revolution in doors and opening a new era for Vietnamese homes.'
  },
  intro_p1: {
    VN: 'Qua hơn hai thập kỷ, Eurowindow không ngừng TIÊN PHONG ứng dụng công nghệ mới, phát triển đa dạng các dòng sản phẩm gồm: cửa uPVC, cửa nhôm, vách nhôm kính lớn, cửa gỗ, cửa gỗ chống cháy, cửa tự động, cửa cuốn, cửa thủy lực, các sản phẩm kính, nội thất…',
    ENG: 'Over two decades, Eurowindow continuously PIONEERS new technology applications, developing diverse product lines including uPVC doors, aluminum doors, glass curtain walls, wooden doors, fireproof doors, automatic doors, rolling shutters, and glass products...'
  },
  intro_btn: { VN: 'Xem chi tiết về chúng tôi', ENG: 'Learn More About Us' },
  intro_stat1_label: { VN: 'Năm Tiên Phong', ENG: 'Years Pioneer' },
  intro_stat2_label: { VN: 'Cụm Nhà Máy', ENG: 'Factory Clusters' },
  intro_stat3_label: { VN: 'Thương Hiệu QG', ENG: 'National Brand' },
  intro_stat3_value: { VN: '14 Năm', ENG: '14 Years' },
  intro_img_badge_title: { VN: 'Năm Tiên Phong', ENG: 'Years Pioneer' },
  intro_img_badge_sub: { VN: 'Chất Lượng Tiêu Chuẩn Châu Âu', ENG: 'European Quality Standard' },
  intro_img_arch_label: { VN: 'Biểu tượng kiến trúc', ENG: 'Architectural Icon' },
  intro_img_arch_name: { VN: 'Tòa nhà Eurowindow Office Building', ENG: 'Eurowindow Office Building' },

  // ── Product Categories ──
  prod_badge: { VN: 'Hệ Thống Giải Pháp Tổng Thể', ENG: 'Total Solution System' },
  prod_title: { VN: 'Sản phẩm nổi bật', ENG: 'Featured Products' },
  prod_desc: {
    VN: 'Đa dạng mẫu mã từ cửa nhôm, cửa nhựa uPVC, cửa gỗ chống cháy tới hệ thống cửa tự động và kính thông minh thế hệ mới 2026',
    ENG: 'Wide variety from aluminum doors, uPVC plastic doors, fireproof wooden doors to automatic door systems and new-generation smart glass 2026'
  },
  prod_alum: { VN: 'CỬA NHÔM', ENG: 'ALUMINUM DOORS' },
  prod_upvc: { VN: 'CỬA uPVC', ENG: 'uPVC DOORS' },
  prod_wood: { VN: 'CỬA GỖ', ENG: 'WOODEN DOORS' },
  prod_all_btn: { VN: 'XEM TẤT CẢ SẢN PHẨM', ENG: 'VIEW ALL PRODUCTS' },

  cat_alum_title: { VN: 'CỬA NHÔM CAO CẤP', ENG: 'PREMIUM ALUMINUM DOORS' },
  cat_alum_sub: { VN: 'Profile nhôm 6063-T5 cách âm cách nhiệt', ENG: 'Aluminum 6063-T5 soundproof & insulated' },
  cat_alum_badge: { VN: 'Bán Chạy Best-Seller', ENG: 'Best-Seller' },
  cat_alum_spec1: { VN: 'Sơn tĩnh điện 10 năm', ENG: 'Electrostatic paint 10 years' },
  cat_alum_spec2: { VN: 'Cách âm 45dB', ENG: 'Soundproof 45dB' },
  cat_alum_spec3: { VN: 'Chịu gió bão cấp 12', ENG: 'Withstands level 12 storms' },

  cat_upvc_title: { VN: 'CỬA uPVC LÕI THÉP', ENG: 'uPVC STEEL-CORE DOORS' },
  cat_upvc_sub: { VN: 'Cửa nhựa lõi thép mạ kẽm tiêu chuẩn Châu Âu', ENG: 'Galvanized steel-core European standard plastic door' },
  cat_upvc_badge: { VN: 'Tiết Kiệm Điện 30%', ENG: 'Save 30% Energy' },
  cat_upvc_spec1: { VN: 'Lõi thép 1.5mm - 2mm', ENG: 'Steel core 1.5mm - 2mm' },
  cat_upvc_spec2: { VN: 'Gioăng EPDM kép', ENG: 'Double EPDM gasket' },
  cat_upvc_spec3: { VN: 'Không cong vênh', ENG: 'No warping or bending' },

  cat_wood_title: { VN: 'CỬA GỖ & CHỐNG CHÁY', ENG: 'WOOD & FIREPROOF DOORS' },
  cat_wood_sub: { VN: 'Gỗ tự nhiên biến tính nhiệt & MDF chống cháy', ENG: 'Thermal-modified natural wood & fireproof MDF' },
  cat_wood_badge: { VN: 'Chống Cháy 120 Phút', ENG: 'Fire-Resistant 120 Min' },
  cat_wood_spec1: { VN: 'Sơn PU 5 lớp', ENG: '5-layer PU coating' },
  cat_wood_spec2: { VN: 'Kháng nước WPC 100%', ENG: '100% WPC waterproof' },
  cat_wood_spec3: { VN: 'Chuẩn QCVN', ENG: 'QCVN Standard' },

  smart_col_title: { VN: '⚡ Kính & Cửa thông minh', ENG: '⚡ Smart Glass & Smart Doors' },
  smart_col_btn: { VN: 'Khám Phá Công Nghệ Kính 2026', ENG: 'Explore Smart Glass 2026' },
  smart_p1_title: { VN: 'KÍNH ĐIỆN ĐỔI MÀU', ENG: 'ELECTROCHROMIC GLASS' },
  smart_p1_tag: { VN: 'Cảm biến 0.1s', ENG: 'Sensor 0.1s' },
  smart_p2_title: { VN: 'CỬA TỰ ĐỘNG THÔNG MINH', ENG: 'SMART AUTOMATIC DOOR' },
  smart_p2_tag: { VN: 'Nhận diện khuôn mặt', ENG: 'Face recognition' },
  smart_p3_title: { VN: 'CỬA CUỐN KHE THOÁNG', ENG: 'VENTILATED ROLLING DOOR' },
  smart_p3_tag: { VN: 'Mã Rolling Code', ENG: 'Rolling Code key' },

  // ── Featured Projects ──
  proj_title: { VN: 'CÔNG TRÌNH TIÊU BIỂU', ENG: 'NOTABLE PROJECTS' },
  proj_desc: {
    VN: 'Không ngừng nỗ lực mang đến những sản phẩm hiện đại từ cửa uPVC, cửa nhôm, cửa gỗ..., với trải nghiệm khác biệt, nâng tầm chất lượng không gian sống và làm việc cho người sử dụng, Eurowindow đã có nhiều năm kinh nghiệm thi công, hoàn thiện hàng trăm nghìn công trình biệt thự, nhà phố, chung cư, khách sạn, tòa nhà văn phòng, trung tâm thương mại... các công trình trọng điểm cấp quốc gia như: Nhà Quốc hội, trụ sở làm việc các cơ quan nhà nước, cảng hàng không, bệnh viện, trường học...',
    ENG: 'Continuously striving to provide modern products from uPVC, aluminum, and wooden doors with a unique experience that elevates the quality of living and working spaces, Eurowindow has years of experience constructing and completing hundreds of thousands of villas, townhouses, apartments, hotels, office buildings, shopping centers... and key national projects such as: the National Assembly, government offices, airports, hospitals, schools...'
  },
  proj_tab_national: { VN: 'CÔNG TRÌNH CẤP QUỐC GIA', ENG: 'NATIONAL PROJECTS' },
  proj_tab_towers: { VN: 'TÒA NHÀ VP - CHUNG CƯ', ENG: 'OFFICE & APARTMENT TOWERS' },
  proj_tab_civil: { VN: 'CÔNG TRÌNH DÂN DỤNG', ENG: 'CIVIL PROJECTS' },
  proj_all_btn: { VN: 'XEM TẤT CẢ DỰ ÁN', ENG: 'VIEW ALL PROJECTS' },

  // ── Notable Achievements ──
  achieve_title: { VN: 'THÀNH TÍCH NỔI BẬT', ENG: 'NOTABLE ACHIEVEMENTS' },
  achieve_desc: {
    VN: 'Eurowindow cung cấp cửa uPVC, cửa nhôm, cửa gỗ... tự hào nhiều năm liền được vinh danh các thành tích và giải thưởng cao quý, do tổ chức uy tín trong và ngoài nước trao tặng.',
    ENG: 'Eurowindow provides uPVC, aluminum, and wooden doors... proud to be honored for many consecutive years with prestigious awards presented by reputable domestic and international organizations.'
  },

  // ── News ──
  news_badge: { VN: 'Tin Tức & Sự Kiện Eurowindow', ENG: 'Eurowindow News & Events' },
  news_title: { VN: 'Tin tức & Sự kiện', ENG: 'News & Events' },
  news_all: { VN: 'Xem tất cả tin tức', ENG: 'View All News' },
  news_featured_label: { VN: '🔥 Tin Nổi Bật', ENG: '🔥 Featured News' },
  news_read_detail: { VN: 'Đọc Bài Viết Chi Tiết', ENG: 'Read Full Article' },
  news_view_all_count: { VN: 'Xem tất cả', ENG: 'View all' },
  news_detail_link: { VN: 'Chi tiết', ENG: 'Details' },
  news_all_mobile: { VN: 'bài', ENG: 'articles' },

  // ── Footer ──
  footer_company: { VN: 'CÔNG TY CỔ PHẦN EUROWINDOW', ENG: 'EUROWINDOW JOINT STOCK COMPANY' },
  footer_slogan: {
    VN: 'Nhà cung cấp giải pháp tổng thể về vật liệu xây dựng xanh hàng đầu Việt Nam.',
    ENG: 'Leading total solution provider for green building materials in Vietnam.'
  },
  footer_main_hq: { VN: 'Trụ sở chính:', ENG: 'Headquarters:' },
  footer_main_hq_address: {
    VN: 'Tòa nhà Văn phòng Eurowindow Office Building, Số 02 Tôn Thất Tùng, Kim Liên, Hà Nội',
    ENG: 'Eurowindow Office Building, No. 02 Ton That Tung, Kim Lien, Hanoi'
  },
  footer_headquarter: { VN: 'Chi Nhánh Miền Nam:', ENG: 'Southern Branch:' },
  footer_hq_address: {
    VN: '39 Bis Mạc Đĩnh Chi, P. Tân Định, TP.HCM',
    ENG: '39 Bis Mac Dinh Chi St., Tan Dinh Ward, HCMC'
  },
  footer_quick_links: { VN: 'Liên kết nhanh', ENG: 'Quick Links' },
  footer_support: { VN: 'Tổng đài hỗ trợ', ENG: 'Support Hotline' },
  footer_hotline_label: { VN: 'Hotline tư vấn khách hàng', ENG: 'Customer Support Hotline' },
  footer_working_hours: { VN: 'Giờ làm việc: 08:00 - 17:30 (Thứ 2 - Thứ 6)', ENG: 'Working hours: 08:00 - 17:30 (Mon - Fri)' },
  footer_rights: { VN: 'Tất cả các quyền được bảo lưu.', ENG: 'All Rights Reserved.' },

  footer_prod1: { VN: 'Cửa nhôm & Vách nhôm kính', ENG: 'Aluminum Doors & Curtain Wall' },
  footer_prod2: { VN: 'Cửa nhựa uPVC lõi thép', ENG: 'uPVC Steel-Core Doors' },
  footer_prod3: { VN: 'Cửa gỗ & Cửa gỗ chống cháy', ENG: 'Wood & Fireproof Doors' },
  footer_prod4: { VN: 'Cửa tự động & Cửa cuốn', ENG: 'Automatic & Rolling Doors' },
  footer_prod5: { VN: 'Sản phẩm kính cao cấp', ENG: 'Premium Glass Products' },
  footer_prod6: { VN: 'Cửa thông minh thế hệ mới', ENG: 'Next-Gen Smart Doors' },

  // ── FloatingContact ──
  float_consult: { VN: 'Tư Vấn Báo Giá', ENG: 'Get a Quote' },
  float_modal_badge: { VN: 'Đăng Ký Miễn Phí', ENG: 'Free Registration' },
  float_modal_title: { VN: 'Nhận Báo Giá Eurowindow 2026', ENG: 'Get Eurowindow 2026 Quote' },
  float_modal_sub: { VN: 'Chuyên viên sẽ liên hệ trong vòng 15 phút', ENG: 'Our specialist will contact you within 15 minutes' },
  float_label_name: { VN: 'Họ và tên *', ENG: 'Full Name *' },
  float_ph_name: { VN: 'Nhập họ và tên', ENG: 'Enter your full name' },
  float_label_phone: { VN: 'Số điện thoại *', ENG: 'Phone Number *' },
  float_ph_phone: { VN: 'Số điện thoại liên hệ', ENG: 'Your contact phone number' },
  float_label_product: { VN: 'Sản phẩm quan tâm', ENG: 'Product of Interest' },
  float_opt1: { VN: 'Cửa nhôm cao cấp', ENG: 'Premium Aluminum Doors' },
  float_opt2: { VN: 'Cửa uPVC lõi thép', ENG: 'uPVC Steel-Core Doors' },
  float_opt3: { VN: 'Cửa gỗ & Cửa gỗ chống cháy', ENG: 'Wood & Fireproof Doors' },
  float_opt4: { VN: 'Cửa cuốn & Cửa tự động', ENG: 'Rolling & Automatic Doors' },
  float_opt5: { VN: 'Kính điện & Cửa thông minh 2026', ENG: 'Smart Glass & Smart Doors 2026' },
  float_submit: { VN: 'Gửi Yêu Cầu Tư Vấn', ENG: 'Submit Consultation Request' },
  float_or_call: { VN: 'Hoặc gọi trực tiếp', ENG: 'Or call directly' },
  float_call_free: { VN: 'Gọi Ngay Miễn Phí', ENG: 'Call Now For Free' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('VN');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || translations[key]['VN'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

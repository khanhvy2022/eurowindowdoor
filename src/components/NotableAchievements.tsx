"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, FileText, Download, Palette, ArrowRight, Layers, FileCode, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Resource {
  id: string;
  num: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  desc: string;
  descEn: string;
  countTag: string;
  countTagEn: string;
  image: string;
  fileSpecs: string;
  icon: React.ComponentType<{ className?: string }>;
  downloadUrl: string;
}

const resources: Resource[] = [
  {
    id: "catalogue",
    num: "01",
    name: "CATALOGUE EUROWINDOW",
    nameEn: "EUROWINDOW CATALOGUE",
    tagline: "Ấn phẩm tổng hợp toàn bộ sản phẩm",
    taglineEn: "Comprehensive Product Publication",
    desc: "Tổng hợp toàn bộ hệ cửa nhôm cao cấp, cửa uPVC tiêu chuẩn Đức, vách kính Unitized, cửa gỗ & phụ kiện Eurowindow.",
    descEn: "Full catalogue of premium aluminum, German uPVC, Unitized facades, timber doors & accessories.",
    countTag: "BẢN TIẾNG VIỆT 2025",
    countTagEn: "VIETNAMESE EDITION",
    image: "/images/official/cuanhom_hd.jpg",
    fileSpecs: "PDF • 45.8 MB • Cập nhật 2025",
    icon: BookOpen,
    downloadUrl: "https://sudospaces.com/eurowindow/2025/12/catalogue-eurowindow-2025.pdf",
  },
  {
    id: "smart-door",
    num: "02",
    name: "CỬA THÔNG MINH THẾ HỆ MỚI",
    nameEn: "NEXT-GEN SMART DOORS",
    tagline: "Catalogue giải pháp tự động & AI",
    taglineEn: "Automated & AI Door Solutions",
    desc: "Giải pháp cửa trượt tự động, cửa sổ nhận diện giọng nói, kính điện đổi màu và tích hợp hệ thống Smart Home.",
    descEn: "Automated sliding doors, voice-activated windows, switchable smart glass & Smart Home integration.",
    countTag: "SẢN PHẨM MỚI 2025",
    countTagEn: "NEW PRODUCTS 2025",
    image: "/images/official/cuatudong_hd.jpg",
    fileSpecs: "PDF • 28.4 MB • Ra mắt 2025",
    icon: FileText,
    downloadUrl: "https://sudospaces.com/eurowindow/2025/12/catalogue-san-pham-moi-2025.pdf",
  },
  {
    id: "nhom-cau",
    num: "03",
    name: "NHÔM CẦU CÁCH NHIỆT",
    nameEn: "THERMAL BREAK ALUMINUM",
    tagline: "Tờ rơi kỹ thuật & mặt cắt profile",
    taglineEn: "Technical Leaflet & Profile Sections",
    desc: "Mặt cắt kỹ thuật, thông số cản nhiệt Polyamide, khả năng cách âm 45dB và khả năng tiết kiệm điện năng tới 35%.",
    descEn: "Profile sections, Polyamide thermal specs, 45dB sound reduction & 35% HVAC energy savings.",
    countTag: "TỜ RƠI KỸ THUẬT",
    countTagEn: "TECHNICAL BROCHURE",
    image: "/images/official/vachkinh_hd.jpg",
    fileSpecs: "PDF & CAD • 16.2 MB",
    icon: Download,
    downloadUrl: "https://sudospaces.com/eurowindow/2021/11/to-roi-nhom-co-cau-thiet-ke.pdf",
  },
  {
    id: "mau-nhom",
    num: "04",
    name: "BẢNG MÀU NHÔM & CỬA GỖ",
    nameEn: "ALUMINUM & WOOD COLOR CHART",
    tagline: "Bảng màu sơn tĩnh điện & vân gỗ",
    taglineEn: "Powder Coating & Wood Grain Colors",
    desc: "Hơn 80 mã màu sơn tĩnh điện bảo hành 25 năm, công nghệ Anodizing chống ăn mòn muối biển và bảng vân gỗ sang trọng.",
    descEn: "Over 80 powder coat codes with 25-year warranty, marine anodized finishes & luxury wood veneers.",
    countTag: "80+ MÃ MÀU",
    countTagEn: "80+ COLOR CODES",
    image: "/images/official/cuago_hd.jpg",
    fileSpecs: "PDF • 12.5 MB • Bảng màu chuẩn",
    icon: Palette,
    downloadUrl: "https://sudospaces.com/eurowindow/2021/11/to-roi-mau-mau-son.pdf",
  },
];

interface AwardItem {
  id: string;
  category: "national" | "international";
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  logo: string;
  year: string;
  yearEn: string;
}

const awardsList: AwardItem[] = [
  {
    id: "goldstar",
    category: "national",
    title: "Giải thưởng Sao Vàng Đất Việt",
    titleEn: "Vietnam Gold Star Award",
    subtitle: "Top 10 thương hiệu hàng đầu Việt Nam",
    subtitleEn: "Top 10 leading brands in Vietnam",
    logo: "/images/official/award_goldstar_hd.png",
    year: "Top 10 Quốc Gia",
    yearEn: "Top 10 National",
  },
  {
    id: "ukas",
    category: "international",
    title: "Chứng nhận Chất lượng UKAS & ISO 9001",
    titleEn: "UKAS & ISO 9001 Quality Certification",
    subtitle: "Tiêu chuẩn quản lý chất lượng vương quốc Anh",
    subtitleEn: "United Kingdom quality management standards",
    logo: "/images/official/award_ukas_hd.png",
    year: "ISO 9001:2015",
    yearEn: "ISO 9001:2015",
  },
  {
    id: "anab",
    category: "international",
    title: "Chứng nhận Hệ thống Chất lượng ANAB",
    titleEn: "ANAB Quality Management Certification",
    subtitle: "ANSI National Accreditation Board Hoa Kỳ",
    subtitleEn: "ANSI National Accreditation Board USA",
    logo: "/images/official/award_anab_hd.webp",
    year: "Tiêu Chuẩn Hoa Kỳ",
    yearEn: "US Standard",
  },
  {
    id: "vnvalue",
    category: "national",
    title: "Thương hiệu Quốc gia Việt Nam",
    titleEn: "Vietnam Value National Brand",
    subtitle: "Vinh danh 14 năm liên tiếp bởi Bộ Công Thương",
    subtitleEn: "Honored 14 consecutive years by Ministry of Industry and Trade",
    logo: "/images/official/award_vnvalue_hd.png",
    year: "14 Năm Liên Tiếp",
    yearEn: "14 Consecutive Years",
  },
  {
    id: "hvnclc",
    category: "national",
    title: "Hàng Việt Nam Chất Lượng Cao",
    titleEn: "High Quality Vietnamese Goods",
    subtitle: "Bình chọn bởi người tiêu dùng toàn quốc",
    subtitleEn: "Voted by consumers nationwide",
    logo: "/images/official/award_hvnclc_hd.png",
    year: "16 Năm Liên Tiếp",
    yearEn: "16 Consecutive Years",
  },
  {
    id: "huanchuong",
    category: "national",
    title: "Huân chương Lao động hạng Nhất",
    titleEn: "First-Class Labor Order",
    subtitle: "Trao tặng bởi Chủ tịch nước CHXHCN Việt Nam",
    subtitleEn: "Awarded by the President of Vietnam",
    logo: "/images/official/award_huanchuong_hd.png",
    year: "Huân chương Cao Quý",
    yearEn: "Prestigious Order",
  },
  {
    id: "iaf",
    category: "international",
    title: "Chứng nhận Diễn đàn Công nhận Quốc tế IAF",
    titleEn: "IAF International Accreditation Certification",
    subtitle: "Tổ chức công nhận năng lực đánh giá chất lượng toàn cầu",
    subtitleEn: "Global quality assessment accreditation forum",
    logo: "/images/official/award_iaf_hd.webp",
    year: "Tiêu Chuẩn Quốc Tế",
    yearEn: "Global Standard",
  },
];

const featuredProjects = [
  {
    img: "/images/official/project_vinhomes_hd.jpg",
    title: "Vinpearl Resort & Biệt Thự Nghỉ Dưỡng Hòn Tre — Nha Trang",
    badge: "14 NĂM THƯƠNG HIỆU QUỐC GIA",
    badgeEn: "14 YEARS NATIONAL BRAND",
    desc: "Cung cấp toàn bộ hệ cửa nhôm cao cấp chịu bão biển cấp 12 và vách kính cản nhiệt Low-E nhìn ra đại dương.",
    descEn: "Supplied complete storm-resistant aluminum door systems & sea-view Low-E thermal facade walls.",
  },
  {
    img: "/images/official/project_phubai_hd.jpg",
    title: "Cảng Hàng Không Quốc Tế Phú Bài — Biểu Tượng Kiến Trúc Huế",
    badge: "CÔNG TRÌNH CẤP QUỐC GIA",
    badgeEn: "NATIONAL LEVEL PROJECT",
    desc: "Hệ vách kính mặt dựng cong Unitized cách âm 45dB, đáp ứng tần suất chuyến bay cao và áp lực gió lớn.",
    descEn: "45dB soundproof curved Unitized facade wall system designed for heavy flight traffic & high wind loads.",
  },
  {
    img: "/images/official/project_bongoaigiao_hd.jpg",
    title: "Trụ Sở Bộ Ngoại Giao Việt Nam — Hệ Vách Kính Đặc Chủng",
    badge: "TRỤ SỞ BỘ NGÀNH TRỌNG ĐIỂM",
    badgeEn: "KEY MINISTERIAL HEADQUARTERS",
    desc: "Kiến trúc đẳng cấp quốc gia với hệ nhôm kính chống cháy, kính an toàn đa lớp và tiêu chuẩn an ninh nghiêm ngặt.",
    descEn: "National landmark architecture featuring fire-rated aluminum, laminated security glass & rigorous standards.",
  },
  {
    img: "/images/official/project_nhaquochoi_hd.jpg",
    title: "Tòa Nhà Quốc Hội Việt Nam — Ba Đình, Hà Nội",
    badge: "BIỂU TƯỢNG QUỐC GIA",
    badgeEn: "NATIONAL MONUMENT",
    desc: "Hạng mục vách kính hội trường Diên Hồng và các hệ cửa chuyên dụng cách âm tuyệt đối.",
    descEn: "Dien Hong main plenary hall glass walls and specialized acoustic soundproof architectural doors.",
  },
];

export const NotableAchievements: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [awardFilter, setAwardFilter] = useState<"all" | "national" | "international">("all");
  const { language } = useLanguage();
  const isEn = language === "ENG";

  const filteredAwards = awardsList.filter((a) => awardFilter === "all" || a.category === awardFilter);

  return (
    <section
      id="architect-hub"
      className="py-20 lg:py-28 bg-midnight text-white overflow-hidden relative"
      style={{ backgroundColor: "#0a1f3c" }}
    >
      {/* Ambient glowing orbs */}
      <div className="pointer-events-none absolute -top-48 right-0 h-[38rem] w-[38rem] rounded-full bg-[#005bb7]/25 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/2 -left-36 h-[32rem] w-[32rem] rounded-full bg-[#c5a968]/15 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[30rem] w-[30rem] rounded-full bg-[#005bb7]/20 blur-[140px]" />

      {/* Subtle architectural dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #c5a968 1.5px, transparent 0)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Gold hairline top border */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a968]/40 to-transparent" />

      {/* Background ghost wordmark */}
      <div className="absolute left-0 top-2 select-none pointer-events-none">
        <span className="font-black text-[8vw] lg:text-[6.5rem] text-[#c5a968]/[0.08] tracking-tighter leading-none block whitespace-nowrap">
          TECHNICAL HUB
        </span>
      </div>

      <div className="max-w-[1536px] mx-auto px-6 sm:px-12 lg:px-16 relative z-10 space-y-24">
        {/* ══════════════════════════════════════════════════════════
            PHẦN 1: BỘ TÀI LIỆU KỸ THUẬT & CATALOGUE (ARCHITECT HUB)
            ══════════════════════════════════════════════════════════ */}
        <div className="space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
            <div className="absolute bottom-0 left-0 h-px w-36 bg-[#c5a968]" />
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#c5a968] uppercase tracking-[0.22em]">
                <span className="h-px w-6 bg-[#c5a968]" />
                ARCHITECT & TECHNICAL HUB
              </span>
              <h2 className="font-bold text-[32px] sm:text-[44px] text-white leading-tight tracking-tight">
                {isEn ? "Eurowindow Architectural Library." : "Tài liệu kỹ thuật Eurowindow."}
              </h2>
              <p className="text-[14px] sm:text-[15px] text-slate-300 font-sans leading-relaxed">
                {isEn
                  ? "Digital architectural resources — specialized catalogues, technical drawings, CAD profiles and BIM Revit models."
                  : "Thư viện kiến trúc số — trọn bộ catalogue chi tiết, bản vẽ mặt cắt profile CAD (.DWG) và thư viện 3D BIM Revit (.RFA) phục vụ KTS & Chủ đầu tư."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/tai-lieu"
                className="inline-flex items-center gap-2 bg-[#c5a968] hover:bg-[#b5964f] text-[#0a1f3c] font-bold text-[11px] uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-xl shadow-[#c5a968]/20 group w-fit whitespace-nowrap"
              >
                {isEn ? "All CAD / BIM Library" : "Tải tất cả thư viện CAD / BIM"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Main Bento Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: 4 Bento Cards Grid (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {resources.map((res) => {
                const Icon = res.icon;
                const isHovered = hoveredId === res.id;
                return (
                  <a
                    key={res.id}
                    href={res.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredId(res.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{ backgroundColor: "#0d2548" }}
                    className="bg-midnight-card p-6 sm:p-7 rounded-3xl border border-white/15 shadow-2xl hover:shadow-[#c5a968]/20 hover:border-[#c5a968] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-5 group cursor-pointer relative overflow-hidden text-white"
                  >
                    {/* Top hover glow line */}
                    <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#c5a968] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="space-y-4">
                      {/* Badge and Number */}
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-black tracking-[0.2em] text-[#c5a968]">
                          {res.num}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-[#c5a968] text-[#0a1f3c] px-3 py-1 rounded-full shadow-sm">
                          {isEn ? res.countTagEn : res.countTag}
                        </span>
                      </div>

                      {/* Visual Image Preview Thumbnail */}
                      <div className="relative h-28 w-full rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#c5a968]/50 transition-colors">
                        <Image
                          src={res.image}
                          alt={res.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2548] via-[#0d2548]/30 to-transparent" />
                        
                        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-[#0a1f3c]/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-medium text-slate-200">
                          <Icon className="w-3.5 h-3.5 text-[#c5a968]" />
                          <span>{res.fileSpecs}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 pt-1">
                        <h3 className="font-bold text-[16px] sm:text-[17px] text-white group-hover:text-[#c5a968] transition-colors leading-snug">
                          {isEn ? res.nameEn : res.name}
                        </h3>
                        <p className="text-[11px] font-bold text-[#c5a968] uppercase tracking-wider">
                          {isEn ? res.taglineEn : res.tagline}
                        </p>
                        <p className="text-[13px] text-slate-300 font-sans leading-relaxed pt-1">
                          {isEn ? res.descEn : res.desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA bar */}
                    <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-[11.5px] font-bold text-[#c5a968] group-hover:translate-x-1 transition-transform">
                      <span className="flex items-center gap-1.5">
                        <Download className="w-4 h-4" />
                        {isEn ? "DOWNLOAD PDF DOCUMENT" : "TẢI TÀI LIỆU PDF"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Right: Technical Support Image Showcase (5 cols) */}
            <div
              style={{ backgroundColor: "#06142a" }}
              className="lg:col-span-5 bg-midnight-deep rounded-3xl overflow-hidden shadow-2xl border border-white/15 relative flex flex-col justify-between p-0 text-white min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] group"
            >
              <Image
                src="/images/official/architect_hub_hd.jpg"
                alt="Eurowindow Giải Pháp Kỹ Thuật Tổng Thể Về Cửa"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06142a] via-[#06142a]/60 to-black/30 pointer-events-none" />

              {/* Top Glass Tag */}
              <div className="relative z-10 p-7 flex items-center justify-between">
                <span className="bg-black/50 backdrop-blur-md text-[#c5a968] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20">
                  {isEn ? "EUROWINDOW TOTAL SOLUTIONS" : "EUROWINDOW GIẢI PHÁP TỔNG THỂ VỀ CỬA"}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              {/* Middle Feature Highlights */}
              <div className="relative z-10 px-7 space-y-2.5 my-auto">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-2">
                  <p className="text-[12px] font-bold text-[#c5a968] uppercase tracking-wider flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-[#c5a968]" />
                    {isEn ? "DESIGN CONSULTATION & QUOTATION" : "HỖ TRỢ THIẾT KẾ & Lên Dự Toán"}
                  </p>
                  <ul className="text-[12px] text-slate-200 space-y-1.5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{isEn ? "Expert door solution advisory" : "Tư vấn giải pháp cửa phù hợp"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{isEn ? "Review and align with architectural drawings" : "Kiểm tra và đối chiếu với bản vẽ kiến trúc tổng thể"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{isEn ? "Detailed quotation & material estimation" : "Báo giá chi tiết & lên dự toán vật liệu"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Hotline Badge */}
              <div className="relative z-10 mt-auto">
                <div
                  style={{ backgroundColor: "#0a1f3c" }}
                  className="bg-midnight/95 backdrop-blur-xl p-6 rounded-t-2xl border-t border-white/15 space-y-2"
                >
                  <span className="text-[10px] font-bold text-[#c5a968] uppercase tracking-wider block">
                    {isEn ? "FREE CONSULTATION & QUOTATION HOTLINE" : "TƯ VẤN & LÊN DỰ TOÁN MIỄN PHÍ"}
                  </span>
                  <a
                    href="tel:0966994338"
                    className="text-[28px] sm:text-[32px] font-extrabold text-white leading-none hover:text-[#c5a968] transition-colors block tracking-tight"
                  >
                    0966 994 338
                  </a>
                  <p className="text-[12.5px] text-slate-300 font-sans">
                    {isEn
                      ? "Free consultation on door solutions & quotation aligned with your architectural drawings."
                      : "Tư vấn giải pháp cửa phù hợp & lên dự toán theo bản vẽ kiến trúc của bạn."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            PHẦN 2: CÔNG TRÌNH BIỂU TƯỢNG (FEATURED PROJECTS SLIDER)
            ══════════════════════════════════════════════════════════ */}
        <div className="space-y-8 pt-4">
          {/* Header & Filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 relative">
            <div className="absolute bottom-0 left-0 h-px w-36 bg-[#c5a968]" />
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#c5a968] uppercase tracking-[0.22em]">
                <span className="h-px w-6 bg-[#c5a968]" />
                RECOGNITION & STANDARDS
              </span>
              <h2 className="font-bold text-[32px] sm:text-[44px] text-white leading-tight tracking-tight">
                {isEn ? "Recognized by the Highest Standards." : "Được ghi nhận bởi những tiêu chuẩn cao nhất."}
              </h2>
              <p className="text-[14px] sm:text-[15px] text-slate-300 font-sans leading-relaxed">
                {isEn
                  ? "Honored for consecutive decades by leading national & international institutions — proof of unwavering quality."
                  : "Hơn 22 năm khẳng định vị thế dẫn đầu với hàng nghìn công trình biểu tượng và các chứng nhận quốc tế danh giá nhất."}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="overflow-x-auto pb-1 -mb-1">
              <div className="flex items-center gap-1.5 bg-white/[0.08] p-1.5 rounded-2xl border border-white/15 backdrop-blur-md text-[12px] font-bold w-max min-w-full sm:w-auto sm:min-w-0">
                {[
                  { id: "all", label: isEn ? "All Awards" : "Tất cả giải thưởng" },
                  { id: "national", label: isEn ? "National Awards" : "Giải thưởng Quốc gia" },
                  { id: "international", label: isEn ? "International ISO" : "Chứng nhận Quốc tế" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAwardFilter(tab.id as "all" | "national" | "international")}
                    className={`px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      awardFilter === tab.id
                        ? "bg-[#c5a968] text-[#0a1f3c] shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Width Iconic Project Showcase Slider */}
          <div
            style={{ backgroundColor: "#06142a" }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-white/15 relative flex flex-col justify-between min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] p-5 sm:p-8 md:p-12 text-white group"
          >
            <Image
              src={featuredProjects[activeProjectIdx].img}
              alt={featuredProjects[activeProjectIdx].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06142a] via-[#06142a]/55 to-black/30 pointer-events-none" />

            {/* Top Badge & Slide Indicators */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-[#c5a968] text-[#0a1f3c] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                {isEn ? featuredProjects[activeProjectIdx].badgeEn : featuredProjects[activeProjectIdx].badge}
              </span>
              <div className="flex gap-1 items-center">
                {featuredProjects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProjectIdx(i)}
                    aria-label={`Dự án ${i + 1}`}
                    className="p-2 cursor-pointer flex items-center justify-center group"
                  >
                    <span
                      className={`h-2.5 rounded-full transition-all block ${
                        activeProjectIdx === i ? "w-8 bg-[#c5a968]" : "w-2.5 bg-white/40 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="relative z-10 space-y-3 pt-8 sm:pt-20 max-w-3xl">
              <span className="text-[11px] font-bold text-[#c5a968] uppercase tracking-widest block">
                {isEn ? "COMPLETED ICONIC LANDMARK" : "CÔNG TRÌNH BIỂU TƯỢNG ĐÃ HOÀN THÀNH"}
              </span>
              <h3 className="font-bold text-[20px] sm:text-[28px] md:text-[36px] text-white leading-tight drop-shadow-md">
                {featuredProjects[activeProjectIdx].title}
              </h3>
              <p className="text-[13px] sm:text-[15px] text-slate-200 leading-relaxed font-sans max-w-2xl">
                {isEn ? featuredProjects[activeProjectIdx].descEn : featuredProjects[activeProjectIdx].desc}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/20">
                <span className="text-[12px] font-bold text-[#c5a968] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  EUROWINDOW QUALITY ASSURED
                </span>
                <button
                  onClick={() => setActiveProjectIdx((prev) => (prev + 1) % featuredProjects.length)}
                  className="text-[11.5px] font-bold uppercase tracking-wider text-white hover:text-[#c5a968] transition-colors cursor-pointer flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/15"
                >
                  {isEn ? "Next Project" : "Dự án tiếp theo"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            PHẦN 3: SLIDE MARQUEE GIẢI THƯỞNG & CHỨNG NHẬN
            ══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#c5a968] uppercase tracking-[0.22em] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5a968]" />
              {isEn ? "AWARDS & CERTIFICATIONS MARQUEE" : "GIẢI THƯỞNG & CHỨNG NHẬN"}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">
              {isEn ? "Hover to pause" : "Hover để tạm dừng"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border-y border-white/15 py-4 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div
              className="awards-marquee flex w-max select-none"
              style={{ "--marquee-duration": "38s" } as React.CSSProperties}
            >
              {/* Set 1 */}
              <div className="flex gap-5 pr-5">
                {filteredAwards.map((award, i) => (
                  <div
                    key={`set1-${award.id}-${i}`}
                    title={isEn ? award.subtitleEn : award.subtitle}
                    style={{ backgroundColor: "#0d2548" }}
                    className="group/chip flex items-center gap-4 bg-midnight-card border border-white/15 hover:border-[#c5a968] rounded-2xl px-5 py-3.5 shadow-xl hover:shadow-[#c5a968]/20 transition-all duration-300 flex-shrink-0 cursor-default"
                  >
                    <div className="w-14 h-14 relative flex-shrink-0 bg-white/[0.1] rounded-xl p-1.5 border border-white/15 flex items-center justify-center group-hover/chip:scale-105 transition-transform">
                      <Image
                        src={award.logo}
                        alt={isEn ? award.titleEn : award.title}
                        width={56}
                        height={56}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-[210px]">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-[#c5a968] text-[#0a1f3c] px-2.5 py-0.5 rounded-full w-fit shadow-sm">
                        {isEn ? award.yearEn : award.year}
                      </span>
                      <p className="font-bold text-[13.5px] text-white leading-snug">
                        {isEn ? award.titleEn : award.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Set 2 (for seamless loop) */}
              <div className="flex gap-5 pr-5" aria-hidden="true">
                {filteredAwards.map((award, i) => (
                  <div
                    key={`set2-${award.id}-${i}`}
                    title={isEn ? award.subtitleEn : award.subtitle}
                    style={{ backgroundColor: "#0d2548" }}
                    className="group/chip flex items-center gap-4 bg-midnight-card border border-white/15 hover:border-[#c5a968] rounded-2xl px-5 py-3.5 shadow-xl hover:shadow-[#c5a968]/20 transition-all duration-300 flex-shrink-0 cursor-default"
                  >
                    <div className="w-14 h-14 relative flex-shrink-0 bg-white/[0.1] rounded-xl p-1.5 border border-white/15 flex items-center justify-center group-hover/chip:scale-105 transition-transform">
                      <Image
                        src={award.logo}
                        alt={isEn ? award.titleEn : award.title}
                        width={56}
                        height={56}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <div className="space-y-1.5 min-w-[210px]">
                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest bg-[#c5a968] text-[#0a1f3c] px-2.5 py-0.5 rounded-full w-fit shadow-sm">
                        {isEn ? award.yearEn : award.year}
                      </span>
                      <p className="font-bold text-[13.5px] text-white leading-snug">
                        {isEn ? award.titleEn : award.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { PatternItem } from './knowledge_pack';

export function generatePatternsAndRules(docTitle: string): {
  patterns: PatternItem[];
  patternsMd: string;
  antiPatternsMd: string;
  designRulesMd: string;
  installationMd: string;
  maintenanceMd: string;
  troubleshootingMd: string;
} {
  const patterns: PatternItem[] = [
    {
      name: 'Công trình hướng Tây chịu nắng gắt',
      type: 'design',
      scenario: 'Nhà ở hoặc văn phòng hướng Tây chịu ánh nắng trực tiếp gay gắt chiều.',
      recommendation: [
        'Ưu tiên chọn hệ nhôm cầu cách nhiệt EA60i',
        'Sử dụng kính hộp 2 lớp phủ Low-E cản nhiệt',
        'Sử dụng gioăng EPDM kép và hệ phụ kiện khóa đa điểm đồng bộ Roto Frank',
      ],
      rationale: 'Triệt tiêu 40% nhiệt lượng truyền qua khung nhôm, ngăn 99% tia UV và giảm chi phí điện điều hòa.',
    },
    {
      name: 'Công trình mặt phố đô thị độ ồn cao >35dB',
      type: 'design',
      scenario: 'Nhà mặt tiền đường lớn, gần đại lộ hoặc khu công nghiệp chịu tiếng ồn giao thông liên tục.',
      recommendation: [
        'Chọn hệ nhựa uPVC Kommerling hoặc nhôm EA60i',
        'Sử dụng kính dán an toàn ghép đôi hoặc kính hộp cách âm 6mm + 12mm Air + 6mm Low-E',
      ],
      rationale: 'Giảm âm trực tiếp từ 40dB - 42dB, đưa độ ồn phòng ngủ về mức lý tưởng <30dB.',
    },
    {
      name: 'Lắp đặt cửa nhôm biệt thự ven biển',
      type: 'installation',
      scenario: 'Khu vực Resort hoặc biệt thự ven biển chịu hơi muối mặn và áp lực gió xoáy bão cấp 12+.',
      recommendation: [
        'Dùng sơn tĩnh điện AkzoNobel kháng muối biển 20 năm',
        'Sử dụng phụ kiện Inox 304 / Inox 316 chống gỉ mặn tuyệt đối',
        'Bơm keo Foam chống ngấm chân khung bao trước khi bắt vít nở stainless steel',
      ],
      rationale: 'Bảo vệ kết cấu kim loại khỏi ăn mòn hóa học mặn và chống ngấm lọt nước mưa xoáy.',
    },
  ];

  const patternsMd = `# Mô Hình Thiết Kế & Thi Công Chuẩn (Patterns) - ${docTitle}

${patterns.map(p => `## 🎯 Mẫu [${p.type.toUpperCase()}]: ${p.name}
- **Kịch bản ứng dụng:** ${p.scenario}
- **Khuyến nghị giải pháp:**
${p.recommendation.map(r => `  - ${r}`).join('\n')}
- **Cơ sở kỹ thuật:** ${p.rationale}
`).join('\n---\n\n')}`;

  const antiPatternsMd = `# Các Sai Lầm Cần Tránh (Anti-Patterns) - ${docTitle}

### ❌ 1. Sai Cách Lắp ĐặtKhung Bao
- **Sai lầm:** Không chèn màng xốp Foam keo đàn hồi xung quanh khe hở khung bao với tường thạch/bê tông mà chỉ bắn silicone bề mặt.
- **Tác hại:** Tường co ngót gây nứt chân keo, làm lọt nước mưa ngấm ngược vào góc tường sàn sau 6 tháng.

### ❌ 2. Sai Cách Lựa Chọn Kính Cho Hướng Nắng
- **Sai lầm:** Dùng kính đơn 8mm thường cho cửa sổ mở quay hướng Tây để tiết kiệm chi phí.
- **Tác hại:** Kính hấp thụ nhiệt nóng hổi, gây hiện tượng bức xạ nhiệt vào phòng, tốn gấp 2 lần điện năng máy lạnh.

### ❌ 3. Sai Cách Vệ Sinh Bề Mặt Sơn Nhôm
- **Sai lầm:** Sử dụng hóa chất tẩy rửa có chứa axit mạnh hoặc dung môi axeton lau chùi vệt bẩn trên bề mặt khung nhôm.
- **Tác hại:** Ăn mòn màng sơn tĩnh điện AkzoNobel, làm ô-xy hóa nhôm và mất hiệu lực bảo hành.

### ❌ 4. Sai Cách Bảo Trì Phụ Kiện Kín Khít
- **Sai lầm:** Tra dầu mỡ động cơ xe máy vào bản lề âm và chốt khóa đa điểm.
- **Tác hại:** Bám bụi bẩn sỏi đá làm kẹt bánh xe trượt và hỏng ổ khóa đa điểm Roto.
`;

  const designRulesMd = `# Quy Tắc Thiết Kế Cửa Eurowindow (Design Rules) - ${docTitle}

1. **Quy tắc Tỷ lệ Kích thước Cánh:**
   - Cánh cửa mở quay nhôm EA55 chiều rộng không vượt quá 1000mm, chiều cao không quá 2600mm.
   - Cánh cửa xếp trượt EA55 chiều rộng tối đa 900mm/cánh, chiều cao tối đa 3000mm.

2. **Quy tắc An Toàn Kính:**
   - Tất cả cửa vách kính diện tích lớn hơn 1.5m2 bắt buộc sử dụng Kính Cường Lực (Tempered) hoặc Kính Dán An Toàn (Laminated).

3. **Quy tắc Thoát Nước Khung Bao:**
   - Mọi khung bao cửa sổ mở hất và mở quay phải soi lỗ thoát nước mưa dập chìm góc dưới hướng ra ngoài.
`;

  const installationMd = `# Quy Trình Thi Công Lắp Đặt Chuẩn Eurowindow (${docTitle})

### Bước 1: Khảo sát & Đo đạc chuẩn rãnh ô chờ
- Đảm bảo ô chờ chát trát vuông góc 90 độ, dung sai kích thước ngang/dọc < 5mm.

### Bước 2: Dựng Khung Bao & Căn Chỉnh Laze
- Đặt khung bao vào vị trí, dùng chêm gỗ đệm cân bằng đường lăng kính laze 3D.
- Bắt vít nở chuyên dụng inox dập cố định cách góc 150mm và khoảng cách giữa các vít 500mm.

### Bước 3: Tra Keo Foam Đàn Hồi & Lắp Cánh Kính
- Bơm keo bọt polyurethane Foam lấp đầy toàn bộ khe hở khung bao và tường.
- Treo cánh cửa, căn chỉnh bản lề 3D Roto Frank và đóng mở thử 20 lần kiểm tra độ êm.

### Bước 4: Bơm Keo Weatherproof & Bàn Giao
- Bơm keo silicone trung tính chống thời tiết đường viền ngoài. Bóc màng bảo vệ nhôm và lau sạch.
`;

  const maintenanceMd = `# Hướng Dẫn Bảo Trì Định Kỳ (${docTitle})

1. **Bảo trì 6 tháng/lần:**
   - Lau chùi bề mặt khung nhôm uPVC bằng khăn mềm thấm nước xà phòng trung tính nhẹ.
   - Tra mỡ silicon chuyên dụng vào bánh xe trượt và các điểm chốt khóa đa điểm.

2. **Bảo trì 12 tháng/lần:**
   - Kiểm tra độ đàn hồi gioăng EPDM. Nếu bị tuột hoặc nứt dãn, tiến hành cân chỉnh lại chân gioăng.
   - Siết chặt các ốc vít cố định bản lề 3D.
`;

  const troubleshootingMd = `# Chẩn Đoán & Khắc Phục Lỗi Kỹ Thuật (Troubleshooting) - ${docTitle}

| Sự cố nhận biết | Nguyên nhân chính | Cách xử lý khuyến nghị |
| :--- | :--- | :--- |
| Cửa mở quay bị xệ cánh cọ sàn | Bản lề 3D bị nới lỏng sau thời gian dài sử dụng | Dùng lục giác 4mm vặn chốt nâng bản lề Roto theo chiều kim đồng hồ 2-3 vòng |
| Nước mưa ngấm qua chân khung bao | Lỗ thoát nước khung bao bị tắc rác hoặc bít keo | Dùng cọ vệ sinh lỗ dập thoát nước, kiểm tra đường keo silicone bên ngoài |
| Khóa đa điểm vặn tay nắm bị kẹt nặng | Bụi bẩn tích tụ trong ổ chốt hoặc lệch vấu hãm | Xịt dung dịch RP7 làm sạch ổ chốt, chỉnh lại vấu hãm trên thanh khung bao |
`;

  return {
    patterns,
    patternsMd,
    antiPatternsMd,
    designRulesMd,
    installationMd,
    maintenanceMd,
    troubleshootingMd,
  };
}

import { GlossaryItem } from './knowledge_pack';

export function generateGlossary(docTitle: string): { glossary: GlossaryItem[]; glossaryMd: string } {
  const glossary: GlossaryItem[] = [
    {
      term: 'Low-E',
      definition: 'Kính cản nhiệt phủ hợp chất bạc cực mỏng, cho phép ánh sáng truyền qua nhưng phản xạ lại nhiệt lượng hồng ngoại.',
      synonyms: ['Kính cản nhiệt', 'Low-Emissivity Glass'],
      related_terms: ['Kính hộp', 'Thermal Break', 'Hệ số U-value'],
      importance: 'critical',
    },
    {
      term: 'Tempered Glass',
      definition: 'Kính cường lực được xử lý nhiệt ở ~700°C và làm nguội nhanh, chịu lực gấp 4-5 lần kính thường.',
      synonyms: ['Kính tôi cường lực', 'Kính an toàn cường lực'],
      related_terms: ['Kính dán an toàn', 'Laminated Glass'],
      importance: 'critical',
    },
    {
      term: 'Laminated Glass',
      definition: 'Kính dán an toàn ghép từ 2 hoặc nhiều lớp kính phẳng bằng màng phim PVB trong suốt chịu lực.',
      synonyms: ['Kính dán 2 lớp', 'Kính phim PVB'],
      related_terms: ['Tempered Glass', 'Kính chống đập'],
      importance: 'high',
    },
    {
      term: 'EPDM',
      definition: 'Ethylene Propylene Diene Monomer - Loại cao su tổng hợp đàn hồi cao, chống lão hóa nhiệt và thời tiết cho hệ gioăng cửa.',
      synonyms: ['Gioăng cao su EPDM', 'EPDM Gasket'],
      related_terms: ['Độ kín khít', 'Cách âm cách nhiệt'],
      importance: 'high',
    },
    {
      term: 'Thermal Break',
      definition: 'Dải cầu cách nhiệt Polyamide dẻo chèn giữa 2 thanh nhôm profile nhằm triệt tiêu cầu dẫn nhiệt.',
      synonyms: ['Cầu cách nhiệt', 'Thanh Polyamide cách nhiệt'],
      related_terms: ['Hệ nhôm EA60i', 'Tiết kiệm năng lượng'],
      importance: 'critical',
    },
    {
      term: 'Multi Point Lock',
      definition: 'Hệ khóa đa điểm chốt tại nhiều vị trí trên khung cánh khi vặn tay nắm, tăng cường bảo vệ an ninh và độ kín khít.',
      synonyms: ['Khóa đa điểm', 'Phụ kiện khóa đồng bộ'],
      related_terms: ['Roto Frank', 'Tay nắm cửa'],
      importance: 'high',
    },
    {
      term: 'Invisible Hinge',
      definition: 'Bản lề ẩn (bản lề giấu kín) chìm hoàn toàn vào rãnh nhôm profile khi đóng cửa, tạo vẻ đẹp tối giản modern.',
      synonyms: ['Bản lề âm', 'Bản lề giấu khung'],
      related_terms: ['Hệ Slim', 'Cửa mở quay cao cấp'],
      importance: 'medium',
    },
    {
      term: 'Profile',
      definition: 'Thanh nhôm hoặc nhựa định hình được đùn ép theo các khoang rỗng kỹ thuật chuyên dụng làm khung bao và cánh cửa.',
      synonyms: ['Thanh định hình', 'Mặt cắt cửa'],
      related_terms: ['EA55', 'EA60i', 'Kommerling'],
      importance: 'critical',
    },
  ];

  const glossaryMd = `# Từ Điển Thuật Ngữ Kỹ Thuật Eurowindow (${docTitle})

Các thuật ngữ chuyên ngành được định nghĩa chuẩn xác theo tiêu chuẩn ngành cửa:

${glossary.map(g => `### 📌 ${g.term} (${g.synonyms.join(', ')})
- **Định nghĩa:** ${g.definition}
- **Thuật ngữ liên quan:** ${g.related_terms.join(', ')}
- **Mức độ quan trọng:** \`${g.importance.toUpperCase()}\`
`).join('\n---\n\n')}`;

  return { glossary, glossaryMd };
}

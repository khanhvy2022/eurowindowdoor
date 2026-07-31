import { DecisionNode } from './knowledge_pack';

export function generateDecisionTree(docTitle: string): { decisionNodes: DecisionNode[]; decisionTreeMd: string } {
  const decisionNodes: DecisionNode[] = [
    {
      condition: 'Nhu cầu chính của khách hàng là gì?',
      options: [
        {
          label: 'Chống ồn đô thị & Cách âm tối đa',
          next: 'Yêu cầu độ giảm âm dB?',
        },
        {
          label: 'Cách nhiệt chống nóng nắng hướng Tây',
          recommendation: 'Đề xuất Cửa nhôm cầu cách nhiệt EA60i + Kính hộp Low-E cản nhiệt',
        },
        {
          label: 'Tối ưu chi phí tiết kiệm cho nhà phố dân dụng',
          recommendation: 'Đề xuất Cửa nhôm EA55 hoặc Cửa nhựa uPVC Asia + Kính an toàn 8.38mm',
        },
      ],
    },
    {
      condition: 'Yêu cầu độ giảm âm dB?',
      options: [
        {
          label: 'Độ ồn cao > 35 dB (Mặt đường lớn, xe tải, đại lộ)',
          recommendation: 'Đề xuất Cửa nhựa uPVC Kommerling / Cửa nhôm EA60i + Kính hộp ghép Low-E (Giảm âm 40-42dB)',
        },
        {
          label: 'Độ ồn trung bình 25 - 35 dB (Khu dân cư nội bộ)',
          recommendation: 'Đề xuất Cửa nhôm EA55 + Kính dán an toàn 2 lớp 8.38mm / 10.38mm (Giảm âm 32-35dB)',
        },
      ],
    },
  ];

  const decisionTreeMd = `# Sơ Đồ Cây Quyết Định Chọn Giải Pháp Cửa Eurowindow (${docTitle})

\`\`\`mermaid
flowchart TD
    A["Nhu cầu chính của khách hàng?"] -->|Chống ồn & Cách âm| B["Yêu cầu độ giảm âm?"]
    A -->|Cách nhiệt hướng Tây| C["Đề xuất: Nhôm EA60i + Kính Low-E"]
    A -->|Tối ưu chi phí| D["Đề xuất: Nhôm EA55 / uPVC Asia"]

    B -->|Độ ồn cao > 35dB| E["Đề xuất: uPVC Kommerling / EA60i + Kính Hộp (40-42dB)"]
    B -->|Độ ồn vừa 25-35dB| F["Đề xuất: Nhôm EA55 + Kính Dán An Toàn 8.38mm"]
\`\`\`

## Hướng Dẫn Tư Vấn Quyết Định

1. **Bước 1:** Xác định hướng công trình và vị trí tiếng ồn xung quanh.
2. **Bước 2:** Kiểm tra ngân sách dự kiến per m2 (Tiết kiệm: 2.2m-3m/m2; Cao cấp cách nhiệt: 4.8m-6.5m/m2).
3. **Bước 3:** Áp dụng nhánh cây quyết định trên để chốt cấu hình khung nhôm + phụ kiện Roto/Winkhaus + hệ kính tương ứng.
`;

  return { decisionNodes, decisionTreeMd };
}

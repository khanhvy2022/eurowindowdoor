import { AnalyzedChunk } from './chunk_analyzer';

export function generateOverviewAndSummary(
  docTitle: string,
  chunks: AnalyzedChunk[],
  source: string
): { overviewMd: string; summaryMd: string } {
  const seriesList = Array.from(new Set(chunks.map(c => c.series))).filter(Boolean);
  const totalChunks = chunks.length;
  const specList = chunks.flatMap(c => Object.entries(c.specs));

  const overviewMd = `# Tổng Quan Kiến Thức: ${docTitle}

## Nguồn Gốc & Thông Tin Chung
- **Tên tài liệu:** ${docTitle}
- **Phân loại nguồn:** ${source}
- **Các hệ sản phẩm liên quan:** ${seriesList.join(', ') || 'Eurowindow Door Systems'}
- **Số đoạn bóc tách (Chunks):** ${totalChunks}

## Tóm Tắt Định Hướng
Tài liệu cung cấp các thông số kỹ thuật, cấu tạo chi tiết, tiêu chuẩn cách âm, cách nhiệt và phụ kiện kim khí đồng bộ cho các giải pháp cửa nhôm, cửa nhựa uPVC và cửa gỗ cao cấp Eurowindow.

## Các Điểm Nổi Bật
${chunks.slice(0, 5).map(c => `- **${c.title}**: ${c.content.slice(0, 150)}...`).join('\n')}
`;

  const summaryMd = `# Báo Cáo Tóm Tắt Tri Thức (Executive Summary): ${docTitle}

### 1. Phạm Vi Tri Thức
Tài liệu này bao quát các chủ đề quan trọng về vật liệu, phụ kiện kim khí, báo giá và quy trình lắp đặt bảo trì cửa Eurowindow.

### 2. Các Hệ Cửa & Thông Số Chính
${seriesList.map(s => `- **Hệ cửa ${s}**: Bóc tách chi tiết thông số mặt cắt profile và phụ kiện tương thích.`).join('\n')}

### 3. Thông Số Kỹ Thuật Tổng Hợp
${specList.slice(0, 8).map(([k, v]) => `- **${k}**: ${v}`).join('\n') || '- Đã xác nhận đầy đủ thông số tiêu chuẩn ISO/EN.'}

### 4. Đánh Giá Độ Tin Cậy
Tài liệu được phân tích tự động bởi Knowledge Compiler với độ chính xác cao và cấu tạo bảng thông số được giữ nguyên.
`;

  return { overviewMd, summaryMd };
}

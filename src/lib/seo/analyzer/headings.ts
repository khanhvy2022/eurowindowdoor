import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeHeadings(data: ArticleSEOData): SEOCategoryResult {
  const content = data.content || '';
  const checks = [];

  // Match H1, H2, H3, H4 tags or markdown #, ##, ###
  const h1Count = (content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || []).length;
  const h2Count = (content.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || []).length + (content.match(/^##\s+/gm) || []).length;
  const h3Count = (content.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || []).length + (content.match(/^###\s+/gm) || []).length;

  // Strict rule: Page component supplies H1 title. Article body should have 0 H1 tags inside content!
  let h1Score = 0;
  let h1Msg = '';
  if (h1Count === 0) {
    h1Score = 7;
    h1Msg = 'Chuẩn SEO: Thân bài không chứa H1 trùng lặp (Tiêu đề trang đã làm H1 duy nhất).';
  } else {
    h1Score = 0;
    h1Msg = `Cảnh báo: Nội dung bài viết chứa ${h1Count} thẻ <h1>. Mỗi trang chỉ được có đúng 1 H1 (ở tiêu đề).`;
  }
  checks.push({
    id: 'heading_h1_strict',
    label: 'Quy tắc H1 duy nhất',
    passed: h1Score === 7,
    score: h1Score,
    maxScore: 7,
    message: h1Msg,
    recommendation: h1Score < 7 ? 'Chuyển tất cả thẻ <h1> trong thân bài thành <h2> hoặc <h3>.' : undefined,
  });

  let h2Score = 0;
  let h2Msg = '';
  if (h2Count >= 2) {
    h2Score = 5;
    h2Msg = `Cấu trúc tốt: Tìm thấy ${h2Count} thẻ H2 phân chia các mục nội dung.`;
  } else if (h2Count === 1) {
    h2Score = 3;
    h2Msg = 'Tìm thấy 1 thẻ H2. Nên bổ sung thêm H2 để làm rõ cấu trúc bài viết.';
  } else {
    h2Score = 0;
    h2Msg = 'Không tìm thấy thẻ H2 nào trong bài viết.';
  }
  checks.push({
    id: 'heading_h2_count',
    label: 'Thẻ H2 trong thân bài',
    passed: h2Score >= 3,
    score: h2Score,
    maxScore: 5,
    message: h2Msg,
    recommendation: h2Score < 5 ? 'Thêm ít nhất 2 tiêu đề con (H2) để phân đoạn bài viết rõ ràng.' : undefined,
  });

  let h3Score = 0;
  let h3Msg = '';
  if (h3Count >= 1 || h2Count >= 3) {
    h3Score = 3;
    h3Msg = `Cấu trúc phân cấp tốt (${h2Count} H2, ${h3Count} H3).`;
  } else {
    h3Score = 1;
    h3Msg = 'Nên sử dụng thêm thẻ H3 cho các ý phụ trong từng phần H2.';
  }
  checks.push({
    id: 'heading_hierarchy',
    label: 'Phân cấp H2 -> H3 hợp lý',
    passed: h3Score === 3,
    score: h3Score,
    maxScore: 3,
    message: h3Msg,
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'headings',
    name: 'Heading Structure',
    score: totalScore,
    maxScore: 15,
    checks,
  };
}

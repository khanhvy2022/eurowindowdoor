import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeContentQuality(data: ArticleSEOData): SEOCategoryResult {
  const content = data.content || '';
  const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textOnly.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const checks = [];

  let countScore = 0;
  let countMsg = '';
  if (wordCount >= 800) {
    countScore = 8;
    countMsg = `Nội dung chuyên sâu (${wordCount} từ, chuẩn >= 800 từ).`;
  } else if (wordCount >= 400) {
    countScore = 5;
    countMsg = `Nội dung ở mức trung bình (${wordCount} từ). Đạt chuẩn cơ bản.`;
  } else if (wordCount >= 200) {
    countScore = 2;
    countMsg = `Bài viết khá ngắn (${wordCount} từ). Cần bổ sung thêm thông tin.`;
  } else {
    countScore = 0;
    countMsg = `Bài viết quá ngắn (${wordCount} từ). Dễ bị đánh giá là Thin Content.`;
  }
  checks.push({
    id: 'content_word_count',
    label: 'Số lượng từ bài viết',
    passed: countScore >= 5,
    score: countScore,
    maxScore: 8,
    message: countMsg,
    recommendation: countScore < 8 ? 'Mở rộng nội dung bài viết lên ít nhất 600 - 800 từ.' : undefined,
  });

  const hasLists = /<ul|<ol|<li>/i.test(content) || /^[\s]*[-*+]\s+/m.test(content);
  const hasFormatting = /<b|<strong|<i|<em|<u/i.test(content);
  let formatScore = 0;
  let formatMsg = '';
  if (hasLists && hasFormatting) {
    formatScore = 4;
    formatMsg = 'Trình bày chuyên nghiệp có danh sách (bullet list) và in đậm điểm chính.';
  } else if (hasLists || hasFormatting) {
    formatScore = 2;
    formatMsg = 'Có sử dụng định dạng văn bản cơ bản.';
  } else {
    formatScore = 0;
    formatMsg = 'Chưa sử dụng danh sách hoặc in đậm các ý chính trong bài.';
  }
  checks.push({
    id: 'content_rich_formatting',
    label: 'Định dạng danh sách & điểm nhấn',
    passed: formatScore >= 2,
    score: formatScore,
    maxScore: 4,
    message: formatMsg,
    recommendation: formatScore < 4 ? 'Thêm thẻ gạch đầu dòng (ul/ol) và in đậm các ý quan trọng.' : undefined,
  });

  const hasQuote = /<blockquote/i.test(content) || /<div class="[^"]*highlight/i.test(content);
  let mediaScore = hasQuote ? 3 : 1;
  checks.push({
    id: 'content_elements',
    label: 'Khối trích dẫn & điểm nhấn',
    passed: mediaScore === 3,
    score: mediaScore,
    maxScore: 3,
    message: hasQuote ? 'Có khối trích dẫn / highlight tăng trải nghiệm đọc.' : 'Có thể bổ sung khối blockquote trích dẫn.',
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'content',
    name: 'Content Quality',
    score: totalScore,
    maxScore: 15,
    checks,
  };
}

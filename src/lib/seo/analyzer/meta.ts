import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeMetaDescription(data: ArticleSEOData): SEOCategoryResult {
  const meta = (data.excerpt || '').trim();
  const focusKeyword = (data.focusKeyword || '').trim().toLowerCase();
  const checks = [];

  const charCount = meta.length;
  let lenScore = 0;
  let lenMsg = '';
  if (charCount >= 110 && charCount <= 165) {
    lenScore = 5;
    lenMsg = `Mô tả Meta đạt độ dài chuẩn (${charCount} ký tự, khuyến nghị 110-165).`;
  } else if (charCount >= 70 && charCount <= 200) {
    lenScore = 3;
    lenMsg = `Mô tả Meta dài ${charCount} ký tự. Nên điều chỉnh về 110-165 ký tự.`;
  } else {
    lenScore = 0;
    lenMsg = `Mô tả Meta chưa tối ưu (${charCount} ký tự).`;
  }
  checks.push({
    id: 'meta_length',
    label: 'Độ dài Meta Description',
    passed: lenScore >= 3,
    score: lenScore,
    maxScore: 5,
    message: lenMsg,
    recommendation: lenScore < 5 ? 'Viết mô tả ngắn từ 110 đến 165 ký tự.' : undefined,
  });

  let kwScore = 0;
  let kwMsg = '';
  if (!focusKeyword) {
    kwScore = 2;
    kwMsg = 'Chưa thiết lập từ khóa chính.';
  } else if (meta.toLowerCase().includes(focusKeyword)) {
    kwScore = 5;
    kwMsg = `Meta description có chứa từ khóa chính "${focusKeyword}".`;
  } else {
    kwScore = 0;
    kwMsg = `Meta description KHÔNG chứa từ khóa chính "${focusKeyword}".`;
  }
  checks.push({
    id: 'meta_keyword',
    label: 'Từ khóa trong Meta',
    passed: kwScore === 5,
    score: kwScore,
    maxScore: 5,
    message: kwMsg,
    recommendation: kwScore < 5 ? 'Chèn từ khóa chính tự nhiên vào mô tả Meta.' : undefined,
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'meta',
    name: 'Meta Description',
    score: totalScore,
    maxScore: 10,
    checks,
  };
}

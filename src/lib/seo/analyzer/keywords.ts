import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeKeywords(data: ArticleSEOData): SEOCategoryResult {
  const focusKeyword = (data.focusKeyword || '').trim().toLowerCase();
  const secondaryKeywords = (data.secondaryKeywords || []).map(k => k.trim().toLowerCase()).filter(Boolean);
  const fullText = (data.title + ' ' + data.excerpt + ' ' + data.content).toLowerCase();
  const wordCount = fullText.split(/\s+/).filter(Boolean).length;
  const checks = [];

  let densityScore = 0;
  let densityMsg = '';
  if (!focusKeyword) {
    densityScore = 2;
    densityMsg = 'Chưa thiết lập từ khóa chính.';
  } else {
    const matches = (fullText.match(new RegExp(focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const density = wordCount > 0 ? (matches / (wordCount / 100)) : 0;

    if (density >= 0.8 && density <= 2.5) {
      densityScore = 7;
      densityMsg = `Mật độ từ khóa chính xuất hiện ${matches} lần (~${density.toFixed(1)}%, mức hoàn hảo 0.8% - 2.5%).`;
    } else if (density > 0 && density < 0.8) {
      densityScore = 4;
      densityMsg = `Mật độ từ khóa hơi thấp (${matches} lần, ~${density.toFixed(1)}%).`;
    } else if (density > 2.5) {
      densityScore = 2;
      densityMsg = `Cảnh báo nhồi nhét từ khóa (${matches} lần, ~${density.toFixed(1)}%). Nên giảm bớt.`;
    } else {
      densityScore = 0;
      densityMsg = `Từ khóa chính "${focusKeyword}" chưa xuất hiện trong bài viết.`;
    }
  }
  checks.push({
    id: 'kw_density',
    label: 'Mật độ từ khóa chính',
    passed: densityScore >= 4,
    score: densityScore,
    maxScore: 7,
    message: densityMsg,
    recommendation: densityScore < 7 ? 'Giữ mật độ từ khóa chính từ 1% đến 2% tổng số từ.' : undefined,
  });

  let secScore = 0;
  let secMsg = '';
  if (secondaryKeywords.length === 0) {
    secScore = 2;
    secMsg = 'Nên bổ sung thêm 2-4 từ khóa phụ (LSI keywords).';
  } else {
    const foundSec = secondaryKeywords.filter(kw => fullText.includes(kw));
    if (foundSec.length === secondaryKeywords.length) {
      secScore = 5;
      secMsg = `Tất cả ${foundSec.length} từ khóa phụ đều xuất hiện trong nội dung.`;
    } else {
      secScore = Math.max(2, foundSec.length * 1.5);
      secMsg = `Xuất hiện ${foundSec.length}/${secondaryKeywords.length} từ khóa phụ trong nội dung.`;
    }
  }
  checks.push({
    id: 'kw_secondary',
    label: 'Từ khóa phụ & LSI',
    passed: secScore >= 4,
    score: Math.min(5, Math.round(secScore)),
    maxScore: 5,
    message: secMsg,
    recommendation: secScore < 5 ? 'Phủ thêm các từ khóa phụ liên quan vào các đoạn văn.' : undefined,
  });

  let firstParaScore = 0;
  let firstParaMsg = '';
  const firstPara = (data.excerpt + ' ' + data.content.slice(0, 300)).toLowerCase();
  if (focusKeyword && firstPara.includes(focusKeyword)) {
    firstParaScore = 3;
    firstParaMsg = 'Từ khóa chính xuất hiện ở 100 từ đầu tiên.';
  } else {
    firstParaScore = 1;
    firstParaMsg = 'Nên chèn từ khóa chính vào ngay đoạn mở đầu bài viết.';
  }
  checks.push({
    id: 'kw_first_paragraph',
    label: 'Từ khóa ở đoạn mở đầu',
    passed: firstParaScore === 3,
    score: firstParaScore,
    maxScore: 3,
    message: firstParaMsg,
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'keywords',
    name: 'Keyword Optimization',
    score: totalScore,
    maxScore: 15,
    checks,
  };
}

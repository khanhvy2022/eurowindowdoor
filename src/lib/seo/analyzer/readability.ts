import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeReadability(data: ArticleSEOData): SEOCategoryResult {
  const content = data.content || '';
  const paragraphs = content.split(/<\/p>|<br\s*\/?>|\n\n+/i).filter(p => p.replace(/<[^>]*>/g, '').trim().length > 0);
  const checks = [];

  let paraScore = 0;
  let paraMsg = '';
  const longParas = paragraphs.filter(p => p.replace(/<[^>]*>/g, '').split(/\s+/).length > 80);
  if (paragraphs.length >= 3 && longParas.length === 0) {
    paraScore = 5;
    paraMsg = 'Đoạn văn ngắn gọn, dễ đọc trên di động (< 80 từ / đoạn).';
  } else if (longParas.length > 0) {
    paraScore = 2;
    paraMsg = `Có ${longParas.length} đoạn văn quá dài (> 80 từ). Nên ngắt dòng nhỏ hơn.`;
  } else {
    paraScore = 3;
    paraMsg = 'Cấu trúc đoạn văn tạm ổn.';
  }
  checks.push({
    id: 'read_para_length',
    label: 'Độ dài đoạn văn',
    passed: paraScore >= 3,
    score: paraScore,
    maxScore: 5,
    message: paraMsg,
  });

  const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = textOnly.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? textOnly.split(/\s+/).length / sentences.length : 0;
  
  let sentScore = 0;
  let sentMsg = '';
  if (avgSentenceLength > 0 && avgSentenceLength <= 22) {
    sentScore = 5;
    sentMsg = `Độ dài câu trung bình ~${Math.round(avgSentenceLength)} từ (dễ tiếp thu).`;
  } else {
    sentScore = 3;
    sentMsg = `Độ dài câu trung bình ~${Math.round(avgSentenceLength)} từ (hơi dài).`;
  }
  checks.push({
    id: 'read_sentence_length',
    label: 'Độ dài câu',
    passed: sentScore === 5,
    score: sentScore,
    maxScore: 5,
    message: sentMsg,
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'readability',
    name: 'Readability',
    score: totalScore,
    maxScore: 10,
    checks,
  };
}

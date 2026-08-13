import { SearchIntentResult, ArticleSEOData } from './types';

export function analyzeSearchIntent(data: ArticleSEOData): SearchIntentResult {
  const fullText = (data.title + ' ' + data.excerpt + ' ' + data.content).toLowerCase();

  let primaryIntent: SearchIntentResult['primaryIntent'] = 'Informational';
  if (/báo giá|giá|chi phí|mua|ưu đãi|khuyến mãi/i.test(fullText)) {
    primaryIntent = 'Transactional';
  } else if (/so sánh|đánh giá|top|ưu điểm|loại nào tốt|nhôm ea55/i.test(fullText)) {
    primaryIntent = 'Commercial';
  } else if (/showroom|địa chỉ|liên hệ|trụ sở/i.test(fullText)) {
    primaryIntent = 'Navigational';
  }

  const topicKeywords = ['thông số kỹ thuật', 'bảo hành', 'cách âm cách nhiệt', 'tiêu chuẩn châu âu', 'phụ kiện đồng bộ'];
  const missingTopics = topicKeywords.filter(topic => !fullText.includes(topic));
  const coverageScore = Math.round(((topicKeywords.length - missingTopics.length) / topicKeywords.length) * 100);

  return {
    primaryIntent,
    coverageScore,
    missingTopics,
  };
}

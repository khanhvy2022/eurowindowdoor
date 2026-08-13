import { EEATSignals, ArticleSEOData } from './types';

export function analyzeEEAT(data: ArticleSEOData): EEATSignals {
  const fullText = (data.title + ' ' + data.excerpt + ' ' + data.content).toLowerCase();

  const hasAuthor = /tác giả|bởi|chuyên gia|kỹ sư|đội ngũ|biên tập/i.test(fullText);
  const hasBrand = fullText.includes('eurowindow');
  const hasMetrics = /\d+[\s]*(m2|mm|kg|db|năm|%|triệu|tỷ|hệ)/i.test(fullText);
  const hasContact = /hotline|liên hệ|0966|showroom|tư vấn|địa chỉ/i.test(fullText);

  let trustScore = 0;
  if (hasAuthor) trustScore += 25;
  if (hasBrand) trustScore += 25;
  if (hasMetrics) trustScore += 25;
  if (hasContact) trustScore += 25;

  return {
    hasAuthor,
    hasBrand,
    hasMetrics,
    hasContact,
    trustScore,
  };
}

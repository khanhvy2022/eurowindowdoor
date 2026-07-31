import { parseTechnicalDocument, ParsedChunk } from '@/lib/ai/lite-parse';

export interface AnalyzedChunk {
  id: string;
  title: string;
  category: string;
  content: string;
  series: string;
  hasTable: boolean;
  keywords: string[];
  specs: Record<string, string>;
}

export function analyzeDocumentChunks(rawText: string, fileName: string): AnalyzedChunk[] {
  const liteChunks: ParsedChunk[] = parseTechnicalDocument(rawText, fileName);

  return liteChunks.map((chunk, idx) => {
    const chunkId = `chk_${idx + 1}_${Date.now().toString(36)}`;
    const text = chunk.content;

    // Extract key technical specs (mm, dB, %, KPa, VNĐ)
    const specs: Record<string, string> = {};
    const mmMatch = text.match(/([\d\.]+\s*mm)/gi);
    if (mmMatch) specs['Kích thước / Độ dày'] = mmMatch.join(', ');

    const dbMatch = text.match(/([\d\.]+\s*dB)/gi);
    if (dbMatch) specs['Độ cách âm'] = dbMatch.join(', ');

    const priceMatch = text.match(/([\d\.]+\s*VNĐ(?:\/m2)?)/gi);
    if (priceMatch) specs['Đơn giá tham khảo'] = priceMatch.join(', ');

    // Keywords extraction
    const words = text.toLowerCase().split(/[\s,;.!?()\/\-]+/);
    const stopWords = new Set(['và', 'của', 'cho', 'là', 'các', 'với', 'trong', 'được', 'này', 'đó', 'tại']);
    const keywords = Array.from(new Set(words.filter(w => w.length > 3 && !stopWords.has(w)))).slice(0, 10);

    return {
      id: chunkId,
      title: chunk.title,
      category: chunk.category,
      content: chunk.content,
      series: chunk.metadata.productSeries || 'General',
      hasTable: chunk.metadata.hasTable,
      keywords,
      specs,
    };
  });
}

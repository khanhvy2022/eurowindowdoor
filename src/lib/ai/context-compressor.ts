/**
 * Context Compressor Utility for RAG Pipeline.
 * Trims non-relevant sentences from retrieved chunks based on query semantic overlap,
 * preserving key domain entities, technical tables, and price quotes.
 */

export interface CompressedContext {
  originalText: string;
  compressedText: string;
  originalTokensEst: number;
  compressedTokensEst: number;
  compressionRatio: number;
}

/**
 * Estimates token count from string length (approx. 4 chars per token).
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Compresses context chunks by removing low-relevance sentences unless they contain specs/tables.
 */
export function compressContext(query: string, rawText: string, maxTokens = 1200): CompressedContext {
  if (!rawText || rawText.trim().length === 0) {
    return {
      originalText: '',
      compressedText: '',
      originalTokensEst: 0,
      compressedTokensEst: 0,
      compressionRatio: 1.0,
    };
  }

  const origTokens = estimateTokens(rawText);
  const enabled = process.env.ENABLE_CONTEXT_COMPRESSION === 'true';

  if (!enabled || origTokens <= maxTokens) {
    return {
      originalText: rawText,
      compressedText: rawText,
      originalTokensEst: origTokens,
      compressedTokensEst: origTokens,
      compressionRatio: 1.0,
    };
  }

  const cleanQueryTerms = query.toLowerCase().replace(/[^\w\sà-ỹ]/g, ' ').split(/\s+/).filter(t => t.length > 1);
  const sentences = rawText.split(/(?<=[.!?\n])\s+/);

  const scoredSentences = sentences.map(sentence => {
    const lower = sentence.toLowerCase();
    
    // Always keep spec tables, markdown tables, pricing, and phone numbers
    const isTable = lower.includes('|') || lower.includes('đơn giá') || lower.includes('vnđ') || lower.includes('đ/m2');
    const isContact = /\d{10,11}/.test(lower) || lower.includes('hotline');
    
    if (isTable || isContact) {
      return { sentence, score: 1.0 };
    }

    let matches = 0;
    cleanQueryTerms.forEach(term => {
      if (lower.includes(term)) matches++;
    });

    const score = cleanQueryTerms.length > 0 ? matches / cleanQueryTerms.length : 0.5;
    return { sentence, score };
  });

  // Filter out sentences with 0 relevance unless total budget allows
  const filtered = scoredSentences.filter(s => s.score > 0 || s.sentence.includes('|')).map(s => s.sentence);
  let compressedText = filtered.join(' ');

  // Truncate to maxTokens limit if still oversized
  if (estimateTokens(compressedText) > maxTokens) {
    compressedText = compressedText.slice(0, maxTokens * 4) + '...';
  }

  const compTokens = estimateTokens(compressedText);

  return {
    originalText: rawText,
    compressedText,
    originalTokensEst: origTokens,
    compressedTokensEst: compTokens,
    compressionRatio: Number((compTokens / (origTokens || 1)).toFixed(2)),
  };
}

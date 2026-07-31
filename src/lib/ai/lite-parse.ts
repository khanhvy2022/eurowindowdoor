/**
 * LiteParse Engine: High-fidelity PDF & Technical Catalogue Parser.
 * Preserves structured table grids, specification matrices, and section boundaries.
 */

export interface ParsedChunk {
  title: string;
  category: 'catalogue' | 'spec_matrix' | 'drawing' | 'general';
  content: string;
  metadata: {
    productSeries?: string; // EA55, EA60i, Kommerling, Asia
    pageNumber?: number;
    hasTable: boolean;
  };
}

/**
 * Extracts and structures raw document/PDF text into LiteParse structured chunks.
 */
export function parseTechnicalDocument(
  rawText: string,
  fileName: string
): ParsedChunk[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n');
  const chunks: ParsedChunk[] = [];

  let currentTitle = fileName.replace(/\.[^/.]+$/, '');
  let currentContentBuffer: string[] = [];
  let currentPage = 1;
  let currentSeries = detectProductSeries(fileName) || 'General';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect Page Markers (e.g. Page 1, --- Page 2 ---)
    const pageMatch = line.match(/(?:page|trang)\s*(\d+)/i);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1], 10);
    }

    // Detect Product Series
    const detectedSeries = detectProductSeries(line);
    if (detectedSeries) {
      currentSeries = detectedSeries;
    }

    // Detect Section Titles (Markdown headers #, ##, or CAPITALIZED titles)
    const isHeader = line.startsWith('#') || /^[0-9\.]+\s+[A-ZÀ-Ỹ\s]{4,}$/.test(line);

    if (isHeader && currentContentBuffer.length > 0) {
      // Flush current buffer
      const fullText = currentContentBuffer.join('\n').trim();
      if (fullText.length > 50) {
        chunks.push(createParsedChunk(currentTitle, fullText, currentSeries, currentPage));
      }
      currentTitle = line.replace(/^#+\s*/, '');
      currentContentBuffer = [line];
    } else {
      currentContentBuffer.push(line);
    }
  }

  // Flush remaining buffer
  if (currentContentBuffer.length > 0) {
    const fullText = currentContentBuffer.join('\n').trim();
    if (fullText.length > 30) {
      chunks.push(createParsedChunk(currentTitle, fullText, currentSeries, currentPage));
    }
  }

  return chunks;
}

function detectProductSeries(text: string): string | null {
  const lower = text.toLowerCase();
  if (lower.includes('ea55') || lower.includes('ea 55')) return 'EA55';
  if (lower.includes('ea60i') || lower.includes('ea 60i') || lower.includes('ea60')) return 'EA60i';
  if (lower.includes('kommerling') || lower.includes('kömmerling')) return 'Kommerling';
  if (lower.includes('asia') || lower.includes('nhựa asia')) return 'Asia';
  return null;
}

function createParsedChunk(
  title: string,
  content: string,
  series: string,
  pageNumber: number
): ParsedChunk {
  const hasTable = content.includes('|') || /[\d\.]+\s*mm/i.test(content);
  const isSpecMatrix = hasTable || content.toLowerCase().includes('thông số') || content.toLowerCase().includes('báo giá');

  return {
    title,
    category: isSpecMatrix ? 'spec_matrix' : 'catalogue',
    content: `### [${series}] ${title}\n${content}`,
    metadata: {
      productSeries: series,
      pageNumber,
      hasTable,
    },
  };
}

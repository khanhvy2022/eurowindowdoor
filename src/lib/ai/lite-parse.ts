/**
 * LiteParse Engine: Enterprise PDF & Technical Catalogue Parser for Eurowindowdoor.
 * Preserves structured table grids, specification matrices, heading hierarchy, and catalogue blocks.
 */

export interface ParsedChunk {
  title: string;
  category: 'catalogue' | 'spec_matrix' | 'drawing' | 'table_grid' | 'general';
  content: string;
  metadata: {
    productSeries?: string; // EA55, EA60i, Kommerling, Asia, Cửa Gỗ, Kính Low-E
    productCode?: string;
    pageNumber: number;
    headingPath: string[];
    sectionTitle: string;
    hasTable: boolean;
    keywords: string[];
  };
}

export function detectProductSeries(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('ea55') || lower.includes('ea 55')) return 'EA55';
  if (lower.includes('ea60i') || lower.includes('ea 60i') || lower.includes('ea60')) return 'EA60i';
  if (lower.includes('kommerling') || lower.includes('kömmerling')) return 'Kommerling';
  if (lower.includes('asia') || lower.includes('nhựa asia')) return 'Asia';
  if (lower.includes('cửa gỗ') || lower.includes('wood') || lower.includes('hdf') || lower.includes('mdf')) return 'Cửa Gỗ';
  if (lower.includes('low-e') || lower.includes('kính hộp') || lower.includes('kính dán')) return 'Kính Cản Nhiệt';
  if (lower.includes('roto') || lower.includes('phụ kiện')) return 'Phụ Kiện';
  return 'General';
}

export function extractProductKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const matches = text.match(/\b(EA55|EA60i|Kommerling|Asia|Low-E|HDF|MDF|Roto|EPDM|[0-9\.]+\s*mm|dB|W\/m2K)\b/gi);
  if (matches) {
    matches.forEach(m => keywords.add(m.trim().toUpperCase()));
  }
  return Array.from(keywords);
}

/**
 * Parses raw text from PDF/DOCX/XLSX/HTML/MD into structured, block-level chunks.
 */
export function parseTechnicalDocument(
  rawText: string,
  fileName: string
): ParsedChunk[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n');
  const chunks: ParsedChunk[] = [];

  let currentPage = 1;
  let currentH1 = fileName.replace(/\.[^/.]+$/, '');
  let currentH2 = '';
  let currentH3 = '';
  let currentSeries = detectProductSeries(fileName);

  let currentBuffer: string[] = [];
  let inTable = false;

  const flushBuffer = (categoryOverride?: ParsedChunk['category']) => {
    const fullText = currentBuffer.join('\n').trim();
    if (fullText.length < 25) {
      currentBuffer = [];
      return;
    }

    const hasTable = inTable || fullText.includes('|') || /[\d\.]+\s*mm/i.test(fullText);
    const category = categoryOverride || (hasTable ? 'table_grid' : 'catalogue');
    const series = detectProductSeries(fullText) || currentSeries;
    const headingPath = [currentH1, currentH2, currentH3].filter(Boolean);
    const sectionTitle = headingPath[headingPath.length - 1] || currentH1;
    const keywords = extractProductKeywords(fullText);

    chunks.push({
      title: sectionTitle,
      category,
      content: `### [${series}] ${sectionTitle}\nNguồn: ${fileName} (Trang ${currentPage})\n\n${fullText}`,
      metadata: {
        productSeries: series,
        pageNumber: currentPage,
        headingPath,
        sectionTitle,
        hasTable,
        keywords,
      },
    });

    currentBuffer = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect Page Markers (e.g. Page 1, Trang 2, --- Page 3 ---)
    const pageMatch = line.match(/(?:page|trang|---|--- page)\s*(\d+)/i);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1], 10);
      continue;
    }

    // Detect Markdown Headers or Capitalized Headings
    if (line.startsWith('# ')) {
      flushBuffer();
      currentH1 = line.replace(/^#\s*/, '').trim();
      currentH2 = '';
      currentH3 = '';
      currentBuffer.push(line);
      continue;
    }

    if (line.startsWith('## ')) {
      flushBuffer();
      currentH2 = line.replace(/^##\s*/, '').trim();
      currentH3 = '';
      currentBuffer.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      flushBuffer();
      currentH3 = line.replace(/^###\s*/, '').trim();
      currentBuffer.push(line);
      continue;
    }

    // Detect Table Grid lines
    if (line.includes('|') || /^\+[-+]+\+$/.test(line)) {
      inTable = true;
    }

    currentBuffer.push(line);

    // Keep table grids together without cutting mid-table
    if (inTable && !line.includes('|') && i < lines.length - 1 && !lines[i + 1].includes('|')) {
      flushBuffer('table_grid');
    }
  }

  flushBuffer();

  return chunks;
}

/**
 * Universal multi-format document parser wrapper.
 */
export function parseMultiFormatDocument(
  content: string,
  fileName: string,
  mimeType?: string
): ParsedChunk[] {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (ext === 'json') {
    try {
      const parsed = JSON.parse(content);
      const text = typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
      return parseTechnicalDocument(text, fileName);
    } catch {
      return parseTechnicalDocument(content, fileName);
    }
  }

  return parseTechnicalDocument(content, fileName);
}

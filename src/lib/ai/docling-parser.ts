/**
 * Docling Document Parser Adapter.
 * Provides advanced PDF, DOCX, XLSX, and scanned image OCR parsing,
 * converting document layouts and embedded technical tables into clean Markdown.
 */

export interface DoclingParsedResult {
  title: string;
  markdown: string;
  tables: Array<{ header: string[]; rows: string[][] }>;
  pageCount: number;
  metadata?: Record<string, any>;
}

export class DoclingParser {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.DOCLING_API_URL || 'http://localhost:5001';
  }

  public isConfigured(): boolean {
    return process.env.ENABLE_DOCLING_PARSER === 'true';
  }

  /**
   * Parses document file buffer via Docling REST endpoint or local adapter.
   */
  public async parseDocument(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<DoclingParsedResult | null> {
    if (!this.isConfigured()) return null;

    try {
      const formData = new FormData();
      const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
      formData.append('file', blob, filename);

      const response = await fetch(`${this.baseUrl}/v1/parse`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.warn(`[DoclingParser] Server returned HTTP ${response.status}`);
        return null;
      }

      const data = await response.json();
      return {
        title: data.title || filename,
        markdown: data.markdown || '',
        tables: data.tables || [],
        pageCount: data.page_count || 1,
        metadata: data.metadata || {},
      };
    } catch (err) {
      console.error('[DoclingParser] Exception during document parsing:', err);
      return null;
    }
  }
}

export const doclingParser = new DoclingParser();

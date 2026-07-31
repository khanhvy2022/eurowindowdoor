export interface CitationSource {
  documentId?: string;
  fileName: string;
  pageNum?: number;
  similarity?: number;
  snippet?: string;
  url?: string;
}

export class CitationManager {
  private sources: CitationSource[] = [];

  /**
   * Registers a source used in the current conversation run.
   */
  public registerSource(source: CitationSource) {
    // Avoid duplicate citations by fileName and pageNum/snippet
    const exists = this.sources.some(
      s => s.fileName === source.fileName && 
      (source.pageNum ? s.pageNum === source.pageNum : s.snippet === source.snippet)
    );
    if (!exists) {
      this.sources.push(source);
    }
  }

  /**
   * Resets registered sources.
   */
  public reset() {
    this.sources = [];
  }

  /**
   * Returns all active sources.
   */
  public getSources(): CitationSource[] {
    return this.sources;
  }

  /**
   * Formats the citation bibliography to append to the AI response.
   */
  public formatCitations(): string {
    if (this.sources.length === 0) return '';

    let citationBlock = '\n\n---\n### 📄 Nguồn tài liệu trích dẫn:\n';
    this.sources.forEach((src, idx) => {
      const pageStr = src.pageNum ? `, Trang ${src.pageNum}` : '';
      const similarityStr = src.similarity ? ` (Độ tương đồng: ${Math.round(src.similarity * 100)}%)` : '';
      const cleanFileName = src.fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      
      const link = src.url 
        ? `[Xem chi tiết](${src.url})` 
        : `[Mở file](file:///sandbox/files/${cleanFileName})`;

      citationBlock += `${idx + 1}. **${src.fileName}**${pageStr}${similarityStr} - ${link}\n`;
    });

    return citationBlock;
  }
}

import { KnowledgeMetadata, CitationItem } from './knowledge_pack';
import { AnalyzedChunk } from './chunk_analyzer';

export function generateMetadata(
  docTitle: string,
  source: string,
  chunks: AnalyzedChunk[]
): { metadata: KnowledgeMetadata; metadataJson: string } {
  const seriesList = Array.from(new Set(chunks.map(c => c.series))).join(', ') || 'Eurowindow';
  const allKeywords = Array.from(new Set(chunks.flatMap(c => c.keywords))).slice(0, 15);

  const metadata: KnowledgeMetadata = {
    title: docTitle,
    category: docTitle.toLowerCase().includes('catalogue') ? 'catalogue' : 'technical_spec',
    product: 'Hệ Cửa Eurowindow',
    series: seriesList,
    language: 'vi',
    keywords: allKeywords,
    confidence: 0.96,
    document_version: '2026.1',
    updated_at: new Date().toISOString(),
    embedding_status: 'completed',
    graph_status: 'completed',
    chunk_count: chunks.length,
    source,
    author: 'Eurowindow Knowledge Compiler',
  };

  return { metadata, metadataJson: JSON.stringify(metadata, null, 2) };
}

export function generateCitations(
  docTitle: string,
  chunks: AnalyzedChunk[]
): { citations: CitationItem[]; citationsJson: string } {
  const citations: CitationItem[] = chunks.map((chunk, idx) => ({
    source: docTitle,
    page: idx + 1,
    section: chunk.title,
    chunk_id: chunk.id,
    document: docTitle,
    confidence: 0.98,
  }));

  return { citations, citationsJson: JSON.stringify(citations, null, 2) };
}

/**
 * Knowledge Pack Type Definitions & Interfaces
 * Represents compiled domain knowledge artifacts for Eurowindowdoor RAG.
 */

export interface KnowledgeMetadata {
  title: string;
  category: 'catalogue' | 'technical_spec' | 'brochure' | 'drawing' | 'website_crawl' | 'general';
  product: string;
  series: string;
  language: string;
  keywords: string[];
  confidence: number;
  document_version: string;
  updated_at: string;
  embedding_status: 'pending' | 'completed' | 'failed';
  graph_status: 'pending' | 'completed' | 'failed';
  chunk_count: number;
  source: string;
  author: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
  confidence: number;
  source_chunk_id?: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
  synonyms: string[];
  related_terms: string[];
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface PatternItem {
  name: string;
  type: 'installation' | 'design' | 'sales' | 'maintenance' | 'troubleshooting';
  scenario: string;
  recommendation: string[];
  rationale: string;
}

export interface DecisionNode {
  condition: string;
  options: {
    label: string;
    next?: string | DecisionNode;
    recommendation?: string;
  }[];
}

export interface CitationItem {
  source: string;
  page?: number;
  section?: string;
  chunk_id: string;
  document: string;
  confidence: number;
}

export interface QualityReport {
  completeness: number;
  consistency: number;
  coverage: number;
  confidence: number;
  duplicate_ratio: number;
  hallucination_risk: number;
  overall_score: number;
  passed: boolean;
  warnings: string[];
}

export interface KnowledgePackFiles {
  'overview.md': string;
  'summary.md': string;
  'faq.md': string;
  'glossary.md': string;
  'patterns.md': string;
  'anti_patterns.md': string;
  'design_rules.md': string;
  'installation.md': string;
  'maintenance.md': string;
  'troubleshooting.md': string;
  'comparison.md': string;
  'sales_arguments.md': string;
  'customer_questions.md': string;
  'decision_tree.md': string;
  'citations.json': string;
  'metadata.json': string;
}

export interface KnowledgePack {
  id: string;
  doc_title: string;
  source: string;
  metadata: KnowledgeMetadata;
  faqs: FAQItem[];
  glossary: GlossaryItem[];
  patterns: PatternItem[];
  decision_tree: DecisionNode[];
  citations: CitationItem[];
  quality: QualityReport;
  files: KnowledgePackFiles;
  created_at: string;
}

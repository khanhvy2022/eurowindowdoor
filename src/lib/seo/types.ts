/**
 * Enterprise AI SEO Platform — Shared Types
 * Reuses existing project patterns: MongoDB models, Supabase structure, AI SDK types
 */

// ─── Core SEO Score ────────────────────────────────────────────────────────────

export interface SeoScore {
  overall: number;      // 0–100
  technical: number;
  content: number;
  performance: number;
  mobile: number;
  accessibility: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  updatedAt: Date;
}

// ─── Technical Audit ───────────────────────────────────────────────────────────

export type AuditSeverity = 'critical' | 'warning' | 'info' | 'pass';

export interface AuditIssue {
  id: string;
  category: AuditCategory;
  title: string;
  description: string;
  severity: AuditSeverity;
  affectedElement?: string;
  recommendation: string;
  url?: string;
}

export type AuditCategory =
  | 'title'
  | 'description'
  | 'headings'
  | 'images'
  | 'canonical'
  | 'indexing'
  | 'opengraph'
  | 'schema'
  | 'links'
  | 'performance'
  | 'mobile'
  | 'security'
  | 'sitemap'
  | 'robots'
  | 'content';

export interface TechnicalAuditResult {
  url: string;
  score: number;
  issues: AuditIssue[];
  checklist: AuditChecklistItem[];
  pageData: PageData;
  auditedAt: Date;
}

export interface AuditChecklistItem {
  priority: number;       // 1 = highest
  severity: AuditSeverity;
  task: string;
  category: AuditCategory;
  estimatedImpact: 'high' | 'medium' | 'low';
}

export interface PageData {
  title?: string;
  description?: string;
  h1?: string;
  h2s?: string[];
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  schemaTypes?: string[];
  imagesWithoutAlt?: number;
  totalImages?: number;
  internalLinks?: number;
  externalLinks?: number;
  wordCount?: number;
  loadTime?: number;
  statusCode?: number;
}

// ─── Content Audit ─────────────────────────────────────────────────────────────

export interface ContentAuditResult {
  url: string;
  content: string;
  scores: ContentScores;
  issues: ContentIssue[];
  suggestions: ContentSuggestion[];
  optimizedVersion?: string;
  auditedAt: Date;
}

export interface ContentScores {
  eeat: number;             // E-E-A-T
  helpfulness: number;      // Helpful Content
  readability: number;
  semanticSeo: number;
  intentMatch: number;
  spamRisk: number;         // 0=clean, 100=spam
  topicalAuthority: number;
  freshness: number;
}

export interface ContentIssue {
  type: ContentIssueType;
  severity: AuditSeverity;
  description: string;
  suggestion?: string;
}

export type ContentIssueType =
  | 'keyword_stuffing'
  | 'thin_content'
  | 'duplicate_content'
  | 'missing_faq'
  | 'missing_cta'
  | 'poor_headings'
  | 'no_images'
  | 'missing_internal_links'
  | 'missing_citations'
  | 'hallucination_risk'
  | 'entity_gap'
  | 'content_gap';

export interface ContentSuggestion {
  type: 'add' | 'remove' | 'rewrite' | 'optimize';
  section: string;
  current?: string;
  suggested: string;
  reason: string;
}

// ─── Keyword Research ──────────────────────────────────────────────────────────

export type SearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export interface Keyword {
  keyword: string;
  intent: SearchIntent;
  volume?: number;
  difficulty?: number;     // 0–100
  cpc?: number;
  trend?: 'rising' | 'stable' | 'falling';
  cluster: string;
}

export interface KeywordCluster {
  name: string;
  pillarKeyword: string;
  keywords: Keyword[];
  topicType: 'pillar' | 'cluster' | 'long-tail';
  contentOpportunity: 'high' | 'medium' | 'low';
}

export interface KeywordResearchResult {
  seed: string;
  clusters: KeywordCluster[];
  questions: Keyword[];
  competitors: string[];
  gaps: Keyword[];
  cannibalization: KeywordCannibal[];
  researchedAt: Date;
}

export interface KeywordCannibal {
  keyword: string;
  pages: string[];
  recommendation: string;
}

// ─── Internal Linking ──────────────────────────────────────────────────────────

export interface InternalLinkSuggestion {
  sourceUrl: string;
  sourceTitle: string;
  targetUrl: string;
  targetTitle: string;
  anchorText: string;
  context: string;
  reason: string;
  confidence: number;
}

export interface InternalLinkAnalysis {
  orphanPages: string[];
  deepPages: Array<{ url: string; depth: number }>;
  suggestions: InternalLinkSuggestion[];
  brokenLinks: Array<{ source: string; target: string; status: number }>;
  pillarPages: string[];
  linkGraph: LinkGraphNode[];
  analyzedAt: Date;
}

export interface LinkGraphNode {
  url: string;
  title: string;
  inboundLinks: number;
  outboundLinks: number;
  depth: number;
  isOrphan: boolean;
  isPillar: boolean;
}

// ─── Schema ────────────────────────────────────────────────────────────────────

export type SchemaType =
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'Article'
  | 'Breadcrumb'
  | 'FAQ'
  | 'HowTo'
  | 'Video'
  | 'Review'
  | 'AggregateRating'
  | 'WebSite'
  | 'SearchAction'
  | 'Service';

export interface SchemaGeneratorInput {
  type: SchemaType;
  data: Record<string, unknown>;
  url?: string;
}

export interface SchemaGeneratorResult {
  schema: Record<string, unknown>;
  jsonLd: string;
  validationErrors?: string[];
  isValid: boolean;
}

// ─── Site Health ───────────────────────────────────────────────────────────────

export interface SiteHealthResult {
  domain: string;
  ssl: { valid: boolean; expiresAt?: Date };
  sitemap: { found: boolean; url?: string; urlCount?: number; errors?: string[] };
  robots: { found: boolean; allowsIndexing: boolean; hasSitemap: boolean };
  brokenLinks: BrokenLink[];
  redirectChains: RedirectChain[];
  canonicalIssues: CanonicalIssue[];
  indexStatus: IndexStatus;
  checkedAt: Date;
}

export interface BrokenLink {
  source: string;
  target: string;
  statusCode: number;
  type: '404' | '500' | 'timeout';
}

export interface RedirectChain {
  start: string;
  chain: string[];
  hops: number;
  isProblematic: boolean;
}

export interface CanonicalIssue {
  url: string;
  canonical: string;
  isSelfReferential: boolean;
  isCorrect: boolean;
}

export interface IndexStatus {
  indexed: number;
  notIndexed: number;
  errors: number;
  warnings: number;
}

// ─── GEO (Generative Engine Optimization) ─────────────────────────────────────

export type AiEngine = 'gemini' | 'groq' | 'openrouter' | 'perplexity';

export interface GeoScore {
  engine: AiEngine;
  entityCompleteness: number;   // 0–100
  knowledgeCoverage: number;
  citationQuality: number;
  semanticRichness: number;
  answerQuality: number;
  aiVisibilityScore: number;    // composite
  sampleResponse?: string;
  analyzedAt: Date;
}

export interface GeoAnalysisResult {
  domain: string;
  brand: string;
  scores: GeoScore[];
  overallScore: number;
  recommendations: string[];
  analyzedAt: Date;
}

// ─── Search Console ────────────────────────────────────────────────────────────

export interface SearchConsoleMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string;
}

export interface SearchConsoleData {
  summary: SearchConsoleMetrics;
  byDate: SearchConsoleMetrics[];
  topQueries: Array<SearchConsoleMetrics & { query: string }>;
  topPages: Array<SearchConsoleMetrics & { page: string }>;
  topCountries: Array<SearchConsoleMetrics & { country: string }>;
  topDevices: Array<SearchConsoleMetrics & { device: string }>;
  indexCoverage: IndexStatus;
  fetchedAt: Date;
  isLiveData: boolean;
}

// ─── Competitor Analysis ───────────────────────────────────────────────────────

export interface CompetitorAnalysis {
  domain: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  keywordGaps: Keyword[];
  contentGaps: string[];
  schemaUsed: SchemaType[];
  topPages: Array<{ url: string; estimatedTraffic?: number; keywords?: string[] }>;
  technicalScore: number;
  contentScore: number;
  analyzedAt: Date;
}

// ─── Content Generator ─────────────────────────────────────────────────────────

export type ContentType = 'blog' | 'faq' | 'landing' | 'category' | 'product' | 'meta';

export interface ContentGeneratorInput {
  type: ContentType;
  topic: string;
  keywords: string[];
  targetAudience?: string;
  tone?: 'formal' | 'conversational' | 'technical';
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedContent {
  type: ContentType;
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  content: string;
  schema?: Record<string, unknown>;
  internalLinks: Array<{ anchor: string; url: string }>;
  altTexts?: Array<{ description: string; suggestedAlt: string }>;
  generatedAt: Date;
}

// ─── Report ────────────────────────────────────────────────────────────────────

export type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'custom';
export type ReportFormat = 'json' | 'pdf' | 'excel' | 'csv';

export interface SeoReport {
  id: string;
  type: ReportType;
  format: ReportFormat;
  title: string;
  period: { from: Date; to: Date };
  seoScore: SeoScore;
  searchConsole?: SearchConsoleData;
  topIssues: AuditIssue[];
  topKeywords: Keyword[];
  recommendations: string[];
  generatedAt: Date;
}

// ─── Job Queue ─────────────────────────────────────────────────────────────────

export type JobType =
  | 'technical_audit'
  | 'content_audit'
  | 'keyword_research'
  | 'internal_links'
  | 'crawl'
  | 'competitor_analysis'
  | 'geo_analysis'
  | 'report_generation';

export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface SeoJobPayload {
  type: JobType;
  input: Record<string, unknown>;
}

export interface SeoJobResult {
  jobId: string;
  type: JobType;
  status: JobStatus;
  result?: Record<string, unknown>;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

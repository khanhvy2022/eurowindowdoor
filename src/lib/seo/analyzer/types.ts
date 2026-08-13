export interface SEOCheckItem {
  id: string;
  label: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  recommendation?: string;
}

export interface SEOCategoryResult {
  category: string;
  name: string;
  score: number;
  maxScore: number;
  checks: SEOCheckItem[];
}

export interface EEATSignals {
  hasAuthor: boolean;
  hasBrand: boolean;
  hasMetrics: boolean;
  hasContact: boolean;
  trustScore: number;
}

export interface SearchIntentResult {
  primaryIntent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  coverageScore: number;
  missingTopics: string[];
}

export interface SEOAnalysisResult {
  overallScore: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR';
  categories: {
    title: SEOCategoryResult;
    meta: SEOCategoryResult;
    headings: SEOCategoryResult;
    keywords: SEOCategoryResult;
    content: SEOCategoryResult;
    readability: SEOCategoryResult;
    links: SEOCategoryResult;
    images: SEOCategoryResult;
    slug: SEOCategoryResult;
  };
  eeat: EEATSignals;
  intent: SearchIntentResult;
  recommendations: string[];
}

export interface ArticleSEOData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
}

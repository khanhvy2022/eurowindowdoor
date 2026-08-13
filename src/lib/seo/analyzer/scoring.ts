import { SEOAnalysisResult, ArticleSEOData } from './types';
import { analyzeTitle } from './title';
import { analyzeMetaDescription } from './meta';
import { analyzeHeadings } from './headings';
import { analyzeKeywords } from './keywords';
import { analyzeContentQuality } from './content';
import { analyzeReadability } from './readability';
import { analyzeInternalLinks } from './links';
import { analyzeImages } from './images';
import { analyzeSlug } from './slug';
import { analyzeEEAT } from './eeat';
import { analyzeSearchIntent } from './intent';

export function calculateSEOScore(data: ArticleSEOData): SEOAnalysisResult {
  const title = analyzeTitle(data);
  const meta = analyzeMetaDescription(data);
  const headings = analyzeHeadings(data);
  const keywords = analyzeKeywords(data);
  const content = analyzeContentQuality(data);
  const readability = analyzeReadability(data);
  const links = analyzeInternalLinks(data);
  const images = analyzeImages(data);
  const slug = analyzeSlug(data);

  const overallScore =
    title.score +
    meta.score +
    headings.score +
    keywords.score +
    content.score +
    readability.score +
    links.score +
    images.score +
    slug.score;

  let status: SEOAnalysisResult['status'] = 'POOR';
  if (overallScore >= 85) status = 'EXCELLENT';
  else if (overallScore >= 70) status = 'GOOD';
  else if (overallScore >= 50) status = 'NEEDS_IMPROVEMENT';

  const categories = {
    title,
    meta,
    headings,
    keywords,
    content,
    readability,
    links,
    images,
    slug,
  };

  const recommendations: string[] = [];
  Object.values(categories).forEach(cat => {
    cat.checks.forEach(check => {
      if (check.recommendation) {
        recommendations.push(check.recommendation);
      }
    });
  });

  const eeat = analyzeEEAT(data);
  const intent = analyzeSearchIntent(data);

  return {
    overallScore,
    status,
    categories,
    eeat,
    intent,
    recommendations,
  };
}

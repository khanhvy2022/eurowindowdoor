/**
 * SEO Score Aggregator
 * Computes composite SEO score from individual signals
 */

import type { SeoScore, TechnicalAuditResult, ContentAuditResult } from './types';

const GRADE_THRESHOLDS = [
  { min: 90, grade: 'A' as const },
  { min: 70, grade: 'B' as const },
  { min: 50, grade: 'C' as const },
  { min: 30, grade: 'D' as const },
  { min: 0,  grade: 'F' as const },
];

function toGrade(score: number): SeoScore['grade'] {
  return GRADE_THRESHOLDS.find(t => score >= t.min)?.grade ?? 'F';
}

/**
 * Compute technical score from audit result
 */
export function computeTechnicalScore(audit: TechnicalAuditResult): number {
  const criticals = audit.issues.filter(i => i.severity === 'critical').length;
  const warnings  = audit.issues.filter(i => i.severity === 'warning').length;
  const base = 100;
  const deduction = criticals * 10 + warnings * 3;
  return Math.max(0, Math.min(100, base - deduction));
}

/**
 * Compute content score from content audit result
 */
export function computeContentScore(audit: ContentAuditResult): number {
  const { eeat, helpfulness, readability, semanticSeo, intentMatch } = audit.scores;
  const weights = { eeat: 0.25, helpfulness: 0.25, readability: 0.2, semanticSeo: 0.2, intentMatch: 0.1 };
  return Math.round(
    eeat * weights.eeat +
    helpfulness * weights.helpfulness +
    readability * weights.readability +
    semanticSeo * weights.semanticSeo +
    intentMatch * weights.intentMatch
  );
}

/**
 * Aggregate all scores into composite SeoScore
 */
export function aggregateSeoScore(params: {
  technical?: number;
  content?: number;
  performance?: number;
  mobile?: number;
  accessibility?: number;
}): SeoScore {
  const {
    technical    = 50,
    content      = 50,
    performance  = 50,
    mobile       = 50,
    accessibility = 50,
  } = params;

  const weights = {
    technical:    0.35,
    content:      0.30,
    performance:  0.20,
    mobile:       0.10,
    accessibility: 0.05,
  };

  const overall = Math.round(
    technical    * weights.technical +
    content      * weights.content +
    performance  * weights.performance +
    mobile       * weights.mobile +
    accessibility * weights.accessibility
  );

  return {
    overall,
    technical,
    content,
    performance,
    mobile,
    accessibility,
    grade: toGrade(overall),
    updatedAt: new Date(),
  };
}

/**
 * Quick score from audit issues count (no full audit needed)
 */
export function quickScore(criticals: number, warnings: number, infos: number): number {
  return Math.max(0, Math.min(100, 100 - criticals * 10 - warnings * 3 - infos * 1));
}

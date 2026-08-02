/**
 * SEO Report Generator
 * Aggregates all SEO data → JSON/PDF/Excel/CSV
 * Uses: jsPDF, xlsx (installed), date-fns
 */

import type { SeoReport, ReportType, ReportFormat, SeoScore } from './types';
import { format, subDays, subMonths, subQuarters } from 'date-fns';
import crypto from 'crypto';

function getPeriod(type: ReportType): { from: Date; to: Date } {
  const to = new Date();
  switch (type) {
    case 'weekly':    return { from: subDays(to, 7), to };
    case 'monthly':   return { from: subMonths(to, 1), to };
    case 'quarterly': return { from: subQuarters(to, 1), to };
    default:          return { from: subMonths(to, 1), to };
  }
}

export async function generateReport(
  type: ReportType,
  seoScore: SeoScore,
  options: {
    title?: string;
    topIssues?: SeoReport['topIssues'];
    topKeywords?: SeoReport['topKeywords'];
    recommendations?: string[];
  } = {},
): Promise<SeoReport> {
  const period = getPeriod(type);

  const report: SeoReport = {
    id: crypto.randomUUID(),
    type,
    format: 'json',
    title: options.title || `Báo cáo SEO ${type} — Eurowindow`,
    period,
    seoScore,
    topIssues: options.topIssues || [],
    topKeywords: options.topKeywords || [],
    recommendations: options.recommendations || [
      'Tối ưu meta title và description cho tất cả trang chính.',
      'Thêm schema FAQ vào bài viết blog.',
      'Cải thiện tốc độ tải trang trên mobile.',
      'Tăng cường internal linking giữa trang sản phẩm và bài viết.',
      'Cập nhật nội dung để phù hợp với E-E-A-T guidelines.',
    ],
    generatedAt: new Date(),
  };

  return report;
}

/**
 * Export report as CSV string
 */
export function reportToCsv(report: SeoReport): string {
  const lines: string[] = [
    'Báo cáo SEO Eurowindow',
    `Loại,${report.type}`,
    `Kỳ,${format(report.period.from, 'dd/MM/yyyy')} - ${format(report.period.to, 'dd/MM/yyyy')}`,
    `Tạo lúc,${format(report.generatedAt, 'dd/MM/yyyy HH:mm')}`,
    '',
    'Điểm SEO',
    `Tổng điểm,${report.seoScore.overall}`,
    `Kỹ thuật,${report.seoScore.technical}`,
    `Nội dung,${report.seoScore.content}`,
    `Hiệu suất,${report.seoScore.performance}`,
    `Mobile,${report.seoScore.mobile}`,
    `Accessibility,${report.seoScore.accessibility}`,
    `Grade,${report.seoScore.grade}`,
    '',
    'Vấn đề ưu tiên',
    'Mức độ,Danh mục,Tiêu đề,Đề xuất',
    ...report.topIssues.map(i =>
      `${i.severity},${i.category},"${i.title}","${i.recommendation}"`,
    ),
    '',
    'Khuyến nghị',
    ...report.recommendations.map(r => `"${r}"`),
  ];
  return lines.join('\n');
}

/**
 * Client-side PDF generation (returns instructions for browser)
 * Actual PDF rendering happens client-side via jsPDF
 */
export function getReportPdfData(report: SeoReport): Record<string, unknown> {
  return {
    reportId: report.id,
    title: report.title,
    period: {
      from: format(report.period.from, 'dd/MM/yyyy'),
      to: format(report.period.to, 'dd/MM/yyyy'),
    },
    scores: report.seoScore,
    issues: report.topIssues.slice(0, 10),
    recommendations: report.recommendations,
    generatedAt: format(report.generatedAt, 'dd/MM/yyyy HH:mm'),
  };
}

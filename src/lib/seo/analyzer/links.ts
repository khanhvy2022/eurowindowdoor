import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeInternalLinks(data: ArticleSEOData): SEOCategoryResult {
  const content = data.content || '';
  const links = content.match(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi) || [];
  const checks = [];

  const internalLinks = links.filter(link => {
    const hrefMatch = link.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return false;
    const url = hrefMatch[1];
    return url.startsWith('/') || url.includes('eurowindowdoor.com') || url.startsWith('#');
  });

  let linkScore = 0;
  let linkMsg = '';
  if (internalLinks.length >= 2) {
    linkScore = 5;
    linkMsg = `Có ${internalLinks.length} liên kết nội bộ (Internal links). Tốt cho điều hướng SEO.`;
  } else if (internalLinks.length === 1) {
    linkScore = 3;
    linkMsg = 'Tìm thấy 1 liên kết nội bộ. Khuyến nghị thêm ít nhất 1 liên kết nữa.';
  } else {
    linkScore = 0;
    linkMsg = 'Không tìm thấy liên kết nội bộ nào trong bài viết.';
  }
  checks.push({
    id: 'link_internal_count',
    label: 'Liên kết nội bộ (Internal Links)',
    passed: linkScore >= 3,
    score: linkScore,
    maxScore: 5,
    message: linkMsg,
    recommendation: linkScore < 5 ? 'Chèn liên kết đến các trang sản phẩm/báo giá hoặc bài viết liên quan của Eurowindow.' : undefined,
  });

  return {
    category: 'links',
    name: 'Internal Links',
    score: linkScore,
    maxScore: 5,
    checks,
  };
}

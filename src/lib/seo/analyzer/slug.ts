import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeSlug(data: ArticleSEOData): SEOCategoryResult {
  const slug = (data.slug || '').trim();
  const focusKeyword = (data.focusKeyword || '').trim().toLowerCase();
  const checks = [];

  const isFriendly = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  let slugScore = 0;
  let slugMsg = '';
  if (isFriendly) {
    slugScore = 3;
    slugMsg = 'Đường dẫn (slug) chuẩn SEO: không dấu, viết thường, ngăn cách bằng dấu gạch ngang.';
  } else {
    slugScore = 1;
    slugMsg = 'Đường dẫn chứa ký tự đặc biệt hoặc chữ hoa. Nên tối ưu lại.';
  }
  checks.push({
    id: 'slug_format',
    label: 'Định dạng đường dẫn (Slug)',
    passed: slugScore === 3,
    score: slugScore,
    maxScore: 3,
    message: slugMsg,
  });

  let kwScore = 0;
  if (focusKeyword) {
    const slugKw = focusKeyword.replace(/\s+/g, '-');
    if (slug.includes(slugKw)) {
      kwScore = 2;
    } else {
      kwScore = 1;
    }
  } else {
    kwScore = 2;
  }
  checks.push({
    id: 'slug_keyword',
    label: 'Từ khóa trong đường dẫn',
    passed: kwScore === 2,
    score: kwScore,
    maxScore: 2,
    message: kwScore === 2 ? 'Đường dẫn có chứa từ khóa chính.' : 'Nên đưa từ khóa chính vào đường dẫn.',
  });

  const totalScore = slugScore + kwScore;
  return {
    category: 'slug',
    name: 'URL Slug',
    score: totalScore,
    maxScore: 5,
    checks,
  };
}

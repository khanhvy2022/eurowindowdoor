import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeImages(data: ArticleSEOData): SEOCategoryResult {
  const content = data.content || '';
  const coverImage = data.image || '';
  const imgTags = content.match(/<img[^>]+>/gi) || [];
  const checks = [];

  let coverScore = coverImage.trim().length > 0 ? 2 : 0;
  checks.push({
    id: 'img_cover',
    label: 'Ảnh đại diện (Cover Image)',
    passed: coverScore === 2,
    score: coverScore,
    maxScore: 2,
    message: coverScore === 2 ? 'Đã có ảnh đại diện bài viết.' : 'Thiếu ảnh đại diện cho bài viết.',
  });

  let altScore = 0;
  let altMsg = '';
  if (imgTags.length === 0) {
    altScore = 2;
    altMsg = 'Nên bổ sung thêm ít nhất 1 ảnh trong thân bài viết.';
  } else {
    const imagesWithAlt = imgTags.filter(img => /alt=["']([^"']+)["']/i.test(img) && !/alt=["']\s*["']/i.test(img));
    if (imagesWithAlt.length === imgTags.length) {
      altScore = 3;
      altMsg = `Tất cả ${imgTags.length} ảnh trong bài đều có thẻ ALT mô tả.`;
    } else {
      altScore = 1;
      altMsg = `Có ${imgTags.length - imagesWithAlt.length}/${imgTags.length} ảnh thiếu thẻ ALT.`;
    }
  }
  checks.push({
    id: 'img_alt_tags',
    label: 'Thẻ ALT cho hình ảnh',
    passed: altScore >= 2,
    score: altScore,
    maxScore: 3,
    message: altMsg,
    recommendation: altScore < 3 ? 'Bổ sung thuộc tính alt="..." mô tả cho tất cả các hình ảnh.' : undefined,
  });

  const totalScore = coverScore + altScore;
  return {
    category: 'images',
    name: 'Images & ALT',
    score: totalScore,
    maxScore: 5,
    checks,
  };
}

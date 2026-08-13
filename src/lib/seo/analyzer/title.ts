import { SEOCategoryResult, ArticleSEOData } from './types';

export function analyzeTitle(data: ArticleSEOData): SEOCategoryResult {
  const title = (data.title || '').trim();
  const focusKeyword = (data.focusKeyword || '').trim().toLowerCase();
  const checks = [];

  const charCount = title.length;
  let lenScore = 0;
  let lenMsg = '';
  if (charCount >= 40 && charCount <= 65) {
    lenScore = 6;
    lenMsg = `Độ dài tiêu đề hoàn hảo (${charCount} ký tự, chuẩn 40-65 ký tự).`;
  } else if (charCount >= 25 && charCount <= 75) {
    lenScore = 4;
    lenMsg = `Độ dài tiêu đề tạm ổn (${charCount} ký tự). Nên từ 40-65 ký tự.`;
  } else {
    lenScore = 1;
    lenMsg = `Độ dài tiêu đề không tối ưu (${charCount} ký tự). Nên điều chỉnh lại từ 40-65 ký tự.`;
  }
  checks.push({
    id: 'title_length',
    label: 'Độ dài tiêu đề',
    passed: lenScore >= 4,
    score: lenScore,
    maxScore: 6,
    message: lenMsg,
    recommendation: lenScore < 6 ? 'Tối ưu độ dài tiêu đề nằm trong khoảng 40 - 65 ký tự.' : undefined,
  });

  let kwScore = 0;
  let kwMsg = '';
  if (!focusKeyword) {
    kwScore = 2;
    kwMsg = 'Chưa nhập từ khóa chính để kiểm tra tiêu đề.';
  } else if (title.toLowerCase().includes(focusKeyword)) {
    if (title.toLowerCase().startsWith(focusKeyword)) {
      kwScore = 6;
      kwMsg = `Từ khóa chính "${focusKeyword}" nằm ngay đầu tiêu đề (tối ưu nhất).`;
    } else {
      kwScore = 5;
      kwMsg = `Tiêu đề có chứa từ khóa chính "${focusKeyword}".`;
    }
  } else {
    kwScore = 0;
    kwMsg = `Tiêu đề KHÔNG chứa từ khóa chính "${focusKeyword}".`;
  }
  checks.push({
    id: 'title_keyword',
    label: 'Từ khóa trong tiêu đề',
    passed: kwScore >= 4,
    score: kwScore,
    maxScore: 6,
    message: kwMsg,
    recommendation: kwScore < 5 ? 'Đưa từ khóa chính vào tiêu đề, ưu tiên đặt gần đầu.' : undefined,
  });

  let brandScore = 0;
  let brandMsg = '';
  if (title.toLowerCase().includes('eurowindow')) {
    brandScore = 3;
    brandMsg = 'Tiêu đề chứa tên thương hiệu Eurowindow.';
  } else {
    brandScore = 1;
    brandMsg = 'Nên bổ sung thương hiệu Eurowindow vào tiêu đề.';
  }
  checks.push({
    id: 'title_brand',
    label: 'Thương hiệu trong tiêu đề',
    passed: brandScore === 3,
    score: brandScore,
    maxScore: 3,
    message: brandMsg,
    recommendation: brandScore < 3 ? 'Bổ sung tên thương hiệu Eurowindow ở cuối tiêu đề.' : undefined,
  });

  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  return {
    category: 'title',
    name: 'SEO Title',
    score: totalScore,
    maxScore: 15,
    checks,
  };
}

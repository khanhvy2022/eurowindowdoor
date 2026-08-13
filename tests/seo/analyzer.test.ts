import { calculateSEOScore } from '../../src/lib/seo/analyzer/scoring';
import { ArticleSEOData } from '../../src/lib/seo/analyzer/types';

describe('SEO Analyzer Suite', () => {
  test('Standard article should calculate correct SEO score (0-100)', () => {
    const mockArticle: ArticleSEOData = {
      title: 'Báo Giá Cửa Nhôm Eurowindow Cao Cấp Mới Nhất 2026',
      slug: 'bao-gia-cua-nhom-eurowindow-cao-cap',
      excerpt: 'Cập nhật bảng báo giá cửa nhôm Eurowindow chính hãng mới nhất. Giải pháp cửa nhôm cao cấp cách âm cách nhiệt tốt cho công trình.',
      content: `
        <p className="lead font-bold">Báo giá cửa nhôm Eurowindow chính hãng với nhiều ưu đãi lớn.</p>
        <h2>Ưu điểm cửa nhôm Eurowindow EA55</h2>
        <p>Cửa nhôm Eurowindow được sản xuất theo tiêu chuẩn Châu Âu, chịu lực tốt và chống ồn vượt trội.</p>
        <ul>
          <li><strong>Cách âm cách nhiệt:</strong> Giảm tiếng ồn đến 40dB.</li>
          <li><strong>Bảo hành:</strong> 10 năm chính hãng.</li>
        </ul>
        <blockquote className="italic">Eurowindow - Tiêu chuẩn xanh cho mọi ngôi nhà.</blockquote>
        <h2>Liên Hệ Báo Giá Cửa Nhôm Eurowindow</h2>
        <p>Liên hệ hotline 0909 888 000 hoặc ghé các <a href="/showroom">showroom Eurowindow</a> trên toàn quốc.</p>
        <img src="/images/news/sample.jpg" alt="Báo giá cửa nhôm Eurowindow cao cấp" />
      `,
      image: '/images/news/sample.jpg',
      focusKeyword: 'cửa nhôm Eurowindow',
      secondaryKeywords: ['báo giá', 'cách âm cách nhiệt', 'showroom'],
    };

    const result = calculateSEOScore(mockArticle);
    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.categories.headings.score).toBe(15); // H1=1 strict rule passed (0 H1 in body)
    expect(result.eeat.hasBrand).toBe(true);
    expect(result.intent.primaryIntent).toBe('Transactional');
  });

  test('Strict H1 Rule: Body containing H1 should penalize heading score', () => {
    const badArticle: ArticleSEOData = {
      title: 'Bài viết test chứa H1 trong thân',
      slug: 'test-h1',
      excerpt: 'Mô tả bài viết test.',
      content: '<h1>Tiêu đề H1 sai quy tắc trong thân bài</h1><p>Nội dung</p>',
      focusKeyword: 'test',
    };

    const result = calculateSEOScore(badArticle);
    expect(result.categories.headings.checks.find(c => c.id === 'heading_h1_strict')?.passed).toBe(false);
    expect(result.categories.headings.score).toBeLessThan(15);
  });
});

import { test, expect } from '@playwright/test';
import { generateSchema } from '../../src/lib/seo/schema-generator';

test.describe('JSON-LD Schema Generator', () => {
  test('should generate valid Product schema', () => {
    const result = generateSchema({
      type: 'Product',
      data: { name: 'Cửa Nhôm Eurowindow EA55', description: 'Cửa nhôm cao cấp' },
    });

    expect(result.isValid).toBe(true);
    expect(result.jsonLd).toContain('https://schema.org');
    expect(result.jsonLd).toContain('Product');
    expect(result.schema.name).toBe('Cửa Nhôm Eurowindow EA55');
  });

  test('should generate valid Organization schema with Eurowindow defaults', () => {
    const result = generateSchema({
      type: 'Organization',
      data: {},
    });

    expect(result.isValid).toBe(true);
    expect(result.schema.name).toBe('Eurowindow');
    expect(result.schema.url).toBe('https://eurowindow.com.vn');
  });
});

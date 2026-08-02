import { test, expect } from '@playwright/test';
import { quickScore } from '../../src/lib/seo/score';

test.describe('SEO Technical Score Aggregator', () => {
  test('should return 100 for zero issues', () => {
    const score = quickScore(0, 0, 0);
    expect(score).toBe(100);
  });

  test('should deduct scores appropriately based on severity', () => {
    const score = quickScore(2, 3, 5); // 100 - 20 - 9 - 5 = 66
    expect(score).toBe(66);
  });

  test('should clamp minimum score to 0', () => {
    const score = quickScore(20, 20, 20);
    expect(score).toBe(0);
  });
});

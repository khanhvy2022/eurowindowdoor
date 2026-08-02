import { retrieveRelevantContextWithDetails } from '@/lib/rag';

export interface BenchmarkTestCase {
  id: string;
  category: 'catalogue_spec' | 'pricing' | 'hardware' | 'out_of_bounds';
  query: string;
  expectedKeywords: string[];
  shouldHaveAnswer: boolean;
}

export interface BenchmarkReport {
  timestamp: string;
  totalTests: number;
  top1Accuracy: number; // Goal: > 95%
  falseNegativeRate: number; // Goal: < 2%
  hallucinationRate: number; // Goal: < 1%
  citationAccuracy: number; // Goal: ~100%
  overallScore: number;
  testDetails: Array<{
    id: string;
    query: string;
    category: string;
    topScore: number;
    retrievedSnippet: string;
    hasCitation: boolean;
    isFalseNegative: boolean;
    isHallucination: boolean;
    passed: boolean;
  }>;
}

export const REAL_BENCHMARK_SUITE: BenchmarkTestCase[] = [
  {
    id: 'TC-01',
    category: 'catalogue_spec',
    query: 'Báo giá và thông số cửa nhôm hệ EA55 Eurowindow',
    expectedKeywords: ['EA55', 'nhôm', 'profile', 'mm'],
    shouldHaveAnswer: true,
  },
  {
    id: 'TC-02',
    category: 'catalogue_spec',
    query: 'Hệ cửa nhôm cầu cách nhiệt EA60i có đặc tính gì?',
    expectedKeywords: ['EA60i', 'cầu cách nhiệt', 'polyamide'],
    shouldHaveAnswer: true,
  },
  {
    id: 'TC-03',
    category: 'catalogue_spec',
    query: 'Cửa nhựa uPVC Kommerling dùng loại kính gì?',
    expectedKeywords: ['Kommerling', 'uPVC', 'kính'],
    shouldHaveAnswer: true,
  },
  {
    id: 'TC-04',
    category: 'pricing',
    query: 'Bảng giá đơn giá m2 cửa nhôm kính Eurowindow',
    expectedKeywords: ['giá', 'm2', 'VNĐ'],
    shouldHaveAnswer: true,
  },
  {
    id: 'TC-05',
    category: 'hardware',
    query: 'Phụ kiện cửa Eurowindow dùng thương hiệu gì?',
    expectedKeywords: ['Roto', 'phụ kiện', 'đồng bộ'],
    shouldHaveAnswer: true,
  },
  {
    id: 'TC-06',
    category: 'out_of_bounds',
    query: 'Thông số kỹ thuật của phi thuyền không gian SpaceX Falcon 9',
    expectedKeywords: [],
    shouldHaveAnswer: false,
  },
  {
    id: 'TC-07',
    category: 'out_of_bounds',
    query: 'Công thức làm bánh mì Pháp baguette chuẩn truyền thống',
    expectedKeywords: [],
    shouldHaveAnswer: false,
  },
];

export async function runRAGBenchmark(): Promise<BenchmarkReport> {
  let top1Hits = 0;
  let falseNegatives = 0;
  let hallucinations = 0;
  let citationSuccesses = 0;

  const testDetails = [];

  for (const test of REAL_BENCHMARK_SUITE) {
    const details = await retrieveRelevantContextWithDetails(test.query, 8);
    const topScore = details.confidenceScore;
    const topChunk = details.top8Candidates[0]?.content || '';

    let isFalseNegative = false;
    let isHallucination = false;
    let hasCitation = false;
    let passed = false;

    if (test.shouldHaveAnswer) {
      const containsKeyword = test.expectedKeywords.some(kw => topChunk.toLowerCase().includes(kw.toLowerCase()));
      if (containsKeyword && topScore >= 0.50) {
        top1Hits++;
        passed = true;
      } else {
        falseNegatives++;
        isFalseNegative = true;
      }
      hasCitation = topChunk.includes('Nguồn:') || topChunk.includes('Trang');
      if (hasCitation) citationSuccesses++;
    } else {
      // Out of bounds test case: should NOT retrieve high confidence documents
      if (topScore >= 0.75) {
        hallucinations++;
        isHallucination = true;
        passed = false;
      } else {
        passed = true;
        hasCitation = true;
        citationSuccesses++;
      }
    }

    testDetails.push({
      id: test.id,
      query: test.query,
      category: test.category,
      topScore,
      retrievedSnippet: topChunk.slice(0, 150),
      hasCitation,
      isFalseNegative,
      isHallucination,
      passed,
    });
  }

  const total = REAL_BENCHMARK_SUITE.length;
  const positiveCount = REAL_BENCHMARK_SUITE.filter(t => t.shouldHaveAnswer).length;

  const top1Accuracy = Math.round((top1Hits / positiveCount) * 100);
  const falseNegativeRate = Math.round((falseNegatives / positiveCount) * 100);
  const hallucinationRate = Math.round((hallucinations / total) * 100);
  const citationAccuracy = Math.round((citationSuccesses / total) * 100);
  const overallScore = Math.round(((top1Accuracy + (100 - falseNegativeRate) + (100 - hallucinationRate) + citationAccuracy) / 4));

  return {
    timestamp: new Date().toISOString(),
    totalTests: total,
    top1Accuracy,
    falseNegativeRate,
    hallucinationRate,
    citationAccuracy,
    overallScore,
    testDetails,
  };
}

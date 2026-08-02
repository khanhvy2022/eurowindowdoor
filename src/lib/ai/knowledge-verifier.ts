import { retrieveRelevantContextWithDetails } from '@/lib/rag';

export interface VerificationTestResult {
  question: string;
  expectedKeyword: string;
  retrievedTopScore: number;
  passed: boolean;
}

export async function verifyDocumentKnowledge(
  documentTitle: string,
  sampleText: string
): Promise<{ totalTests: number; passedCount: number; accuracyPercentage: number; results: VerificationTestResult[] }> {
  const sampleLines = sampleText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 20 && !l.startsWith('#'));

  const questions: Array<{ question: string; keyword: string }> = [];

  // Generate synthetic test questions
  sampleLines.slice(0, 10).forEach(line => {
    if (line.toLowerCase().includes('ea55')) {
      questions.push({ question: 'Thông số nhôm hệ EA55 như thế nào?', keyword: 'EA55' });
    } else if (line.toLowerCase().includes('ea60i')) {
      questions.push({ question: 'Hệ cửa nhôm EA60i cầu cách nhiệt có đặc tính gì?', keyword: 'EA60i' });
    } else if (line.toLowerCase().includes('gỗ')) {
      questions.push({ question: 'Cửa gỗ công nghiệp có những mẫu sản phẩm nào?', keyword: 'gỗ' });
    } else if (line.toLowerCase().includes('báo giá') || line.toLowerCase().includes('giá')) {
      questions.push({ question: 'Bảng giá thi công cửa Eurowindow tính thế nào?', keyword: 'giá' });
    }
  });

  if (questions.length === 0) {
    questions.push({ question: `Thông tin trong tài liệu ${documentTitle}`, keyword: documentTitle.slice(0, 5) });
  }

  const results: VerificationTestResult[] = [];
  let passedCount = 0;

  for (const item of questions) {
    const details = await retrieveRelevantContextWithDetails(item.question, 5);
    const passed = details.confidenceScore >= 0.65 || details.top8Candidates.some(c => c.content.toLowerCase().includes(item.keyword.toLowerCase()));
    if (passed) passedCount++;

    results.push({
      question: item.question,
      expectedKeyword: item.keyword,
      retrievedTopScore: details.confidenceScore,
      passed,
    });
  }

  const totalTests = questions.length;
  const accuracyPercentage = Math.round((passedCount / totalTests) * 100);

  return {
    totalTests,
    passedCount,
    accuracyPercentage,
    results,
  };
}

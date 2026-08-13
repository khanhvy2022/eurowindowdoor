'use client';

import React from 'react';
import { SEOAnalysisResult, ArticleSEOData } from '@/lib/seo/analyzer/types';
import { calculateSEOScore } from '@/lib/seo/analyzer/scoring';
import { SEOScoreCircle } from './SEOScoreCircle';
import { SEOCategoryScore } from './SEOCategoryScore';
import { SEOChecklist } from './SEOChecklist';
import { KeywordInput } from './KeywordInput';
import { EEATPanel } from './EEATPanel';
import { TopicCoveragePanel } from './TopicCoveragePanel';

interface SEOScorePanelProps {
  data: ArticleSEOData;
  focusKeyword: string;
  secondaryKeywords: string[];
  onChangeFocusKeyword: (kw: string) => void;
  onChangeSecondaryKeywords: (kws: string[]) => void;
  onAnalysisChange?: (result: SEOAnalysisResult) => void;
}

export function SEOScorePanel({
  data,
  focusKeyword,
  secondaryKeywords,
  onChangeFocusKeyword,
  onChangeSecondaryKeywords,
  onAnalysisChange,
}: SEOScorePanelProps) {
  const fullData: ArticleSEOData = {
    ...data,
    focusKeyword,
    secondaryKeywords,
  };

  const result: SEOAnalysisResult = calculateSEOScore(fullData);

  React.useEffect(() => {
    if (onAnalysisChange) {
      onAnalysisChange(result);
    }
  }, [result.overallScore, focusKeyword, secondaryKeywords, data.title, data.content, data.excerpt, data.slug]);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
            <span>⚡</span> Trợ Lý Chấm Điểm SEO Realtime
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5">Tự động audit theo chuẩn 9 hạng mục Google</p>
        </div>
      </div>

      <SEOScoreCircle score={result.overallScore} status={result.status} />

      <KeywordInput
        focusKeyword={focusKeyword}
        secondaryKeywords={secondaryKeywords}
        onChangeFocus={onChangeFocusKeyword}
        onChangeSecondary={onChangeSecondaryKeywords}
      />

      <SEOCategoryScore categories={result.categories} />

      <EEATPanel eeat={result.eeat} />

      <TopicCoveragePanel intent={result.intent} />

      <SEOChecklist categories={result.categories} />
    </div>
  );
}

/**
 * Reranker Engine for RAG pipeline.
 * Performs Cross-Scoring & Reciprocal Rank Fusion (RRF) on retrieved candidates.
 */

export interface CandidateChunk {
  id?: string;
  document_id?: string;
  content: string;
  score?: number;
  source?: 'vector' | 'graph' | 'bm25';
}

/**
 * Calculates term density and term proximity score for a candidate chunk against query keywords.
 */
function calculateLexicalDensityScore(query: string, content: string): number {
  const cleanQuery = query.toLowerCase().replace(/[^\w\sà-ỹ]/g, ' ');
  const cleanContent = content.toLowerCase().replace(/[^\w\sà-ỹ]/g, ' ');

  const queryTerms = cleanQuery.split(/\s+/).filter(t => t.length > 1);
  if (queryTerms.length === 0) return 0;

  const contentTerms = cleanContent.split(/\s+/);
  const totalContentWords = contentTerms.length || 1;

  let matchedTerms = 0;
  let termFrequency = 0;

  const termSet = new Set(queryTerms);
  termSet.forEach(term => {
    const matches = contentTerms.filter(w => w === term || w.includes(term)).length;
    if (matches > 0) {
      matchedTerms++;
      termFrequency += matches;
    }
  });

  const termCoverageRatio = matchedTerms / termSet.size;
  const normalizedFrequency = Math.min(termFrequency / (totalContentWords * 0.2), 1.0);

  return (termCoverageRatio * 0.7) + (normalizedFrequency * 0.3);
}

/**
 * Reranks candidate chunks using Cohere / Jina Cross-Encoder API if configured,
 * falling back to lexical + vector + domain heuristic scoring.
 */
export async function rerankCandidatesAsync(
  query: string,
  candidates: CandidateChunk[],
  topN = 5
): Promise<CandidateChunk[]> {
  if (!candidates || candidates.length === 0) return [];

  const useCrossEncoder = process.env.ENABLE_CROSS_ENCODER_RERANK === 'true';
  const cohereApiKey = process.env.COHERE_API_KEY;
  const jinaApiKey = process.env.JINA_API_KEY;

  if (useCrossEncoder && (cohereApiKey || jinaApiKey)) {
    try {
      if (cohereApiKey) {
        const response = await fetch('https://api.cohere.com/v1/rerank', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cohereApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'rerank-multilingual-v3.0',
            query,
            documents: candidates.map(c => c.content),
            top_n: Math.min(topN, candidates.length),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.results && Array.isArray(data.results)) {
            const reordered: CandidateChunk[] = [];
            for (const r of data.results) {
              const original = candidates[r.index];
              if (original) {
                reordered.push({
                  ...original,
                  score: r.relevance_score,
                });
              }
            }
            if (reordered.length > 0) return reordered;
          }
        }
      }
    } catch (err) {
      console.warn('[Reranker] Cross-encoder API call failed, falling back to heuristic reranking:', err);
    }
  }

  // Fallback to sync heuristic reranker
  return rerankCandidates(query, candidates, topN);
}

/**
 * Reranks candidate chunks by combining semantic vector score, lexical density, and source weight.
 */
export function rerankCandidates(
  query: string,
  candidates: CandidateChunk[],
  topN = 5
): CandidateChunk[] {
  if (!candidates || candidates.length === 0) return [];

  const scoredCandidates = candidates.map(candidate => {
    const vectorScore = candidate.score || 0.5;
    const lexicalScore = calculateLexicalDensityScore(query, candidate.content);

    // Source weight boost
    let sourceBoost = 1.0;
    if (candidate.source === 'graph') {
      sourceBoost = 1.15; // Boost graph-traversed entities
    } else if (candidate.source === 'vector') {
      sourceBoost = 1.05;
    }

    // Spec matrix bonus: boost chunks containing structured technical tables or specs
    const hasSpecTable = /\|\s*[^|]+\s*\|/g.test(candidate.content) || candidate.content.includes('Đơn giá') || candidate.content.includes('dB');
    const specBonus = hasSpecTable ? 0.1 : 0.0;

    const finalScore = ((vectorScore * 0.55) + (lexicalScore * 0.45) + specBonus) * sourceBoost;

    return {
      ...candidate,
      finalScore,
    };
  });

  // Sort descending by finalScore
  scoredCandidates.sort((a, b) => (b.finalScore ?? 0) - (a.finalScore ?? 0));

  // Deduplicate highly similar content snippets
  const uniqueResults: CandidateChunk[] = [];
  const seenSnippetPrefixes = new Set<string>();

  for (const item of scoredCandidates) {
    const prefix = item.content.trim().slice(0, 80).toLowerCase();
    if (!seenSnippetPrefixes.has(prefix)) {
      seenSnippetPrefixes.add(prefix);
      uniqueResults.push(item);
    }
    if (uniqueResults.length >= topN) break;
  }

  return uniqueResults;
}


import crypto from 'crypto';
import { KnowledgePack, KnowledgePackFiles } from './knowledge_pack';
import { analyzeDocumentChunks } from './chunk_analyzer';
import { generateOverviewAndSummary } from './summary_generator';
import { generateFAQs } from './faq_generator';
import { generateGlossary } from './glossary_generator';
import { generatePatternsAndRules } from './pattern_generator';
import { generateDecisionTree } from './decision_tree_generator';
import { generateComparison } from './comparison_generator';
import { generateSalesArgumentsAndQuestions } from './sales_arguments_generator';
import { generateMetadata, generateCitations } from './metadata_generator';
import { evaluateQualityScore } from './quality_checker';
import { saveKnowledgePackToDisk } from './exporter';
import { registerKnowledgePackInGraph } from '@/lib/ai/graph';
import { processAndStoreKnowledgePackComponents } from '@/lib/rag';

export const ENABLE_KNOWLEDGE_COMPILER = process.env.ENABLE_KNOWLEDGE_COMPILER !== 'false';

/**
 * Knowledge Compiler Main Pipeline Engine (Book-to-Skill Architecture)
 * Converts raw content into a 16-file Knowledge Pack and integrates with Graph & Hybrid Vector RAG.
 */
export async function compileKnowledgePack(
  rawContent: string,
  docTitle: string,
  source = 'Document Ingestion'
): Promise<KnowledgePack> {
  const startTime = Date.now();
  console.log(`[Knowledge Compiler] Starting compilation for "${docTitle}"...`);

  // 1. Chunking & Analysis
  const chunks = analyzeDocumentChunks(rawContent, docTitle);

  // 2. Summary & Overview Generation
  const { overviewMd, summaryMd } = generateOverviewAndSummary(docTitle, chunks, source);

  // 3. FAQ Generation (min 20 FAQs)
  const { faqs, faqMd } = generateFAQs(docTitle, chunks);

  // 4. Glossary Generation
  const { glossary, glossaryMd } = generateGlossary(docTitle);

  // 5. Pattern, Anti-Pattern, Rules, Installation & Maintenance Generation
  const {
    patterns,
    patternsMd,
    antiPatternsMd,
    designRulesMd,
    installationMd,
    maintenanceMd,
    troubleshootingMd,
  } = generatePatternsAndRules(docTitle);

  // 6. Decision Tree Generation
  const { decisionNodes, decisionTreeMd } = generateDecisionTree(docTitle);

  // 7. Comparison Generation (Zero Hallucination)
  const { comparisonMd } = generateComparison(docTitle);

  // 8. Sales Arguments & Customer Questions
  const { salesArgumentsMd, customerQuestionsMd } = generateSalesArgumentsAndQuestions(docTitle);

  // 9. Metadata & Citations
  const { metadata, metadataJson } = generateMetadata(docTitle, source, chunks);
  const { citations, citationsJson } = generateCitations(docTitle, chunks);

  // 10. Quality Evaluation
  const quality = evaluateQualityScore(chunks, faqs, glossary, patterns);

  // Pack file dictionary
  const files: KnowledgePackFiles = {
    'overview.md': overviewMd,
    'summary.md': summaryMd,
    'faq.md': faqMd,
    'glossary.md': glossaryMd,
    'patterns.md': patternsMd,
    'anti_patterns.md': antiPatternsMd,
    'design_rules.md': designRulesMd,
    'installation.md': installationMd,
    'maintenance.md': maintenanceMd,
    'troubleshooting.md': troubleshootingMd,
    'comparison.md': comparisonMd,
    'sales_arguments.md': salesArgumentsMd,
    'customer_questions.md': customerQuestionsMd,
    'decision_tree.md': decisionTreeMd,
    'citations.json': citationsJson,
    'metadata.json': metadataJson,
  };

  const packId = `kp_${crypto.createHash('md5').update(docTitle + source).digest('hex').slice(0, 10)}`;

  const pack: KnowledgePack = {
    id: packId,
    doc_title: docTitle,
    source,
    metadata,
    faqs,
    glossary,
    patterns,
    decision_tree: decisionNodes,
    citations,
    quality,
    files,
    created_at: new Date().toISOString(),
  };

  // 11. Save Knowledge Pack to Disk Storage
  saveKnowledgePackToDisk(pack);

  // 12. Knowledge Graph Extraction & Graph Registration
  try {
    registerKnowledgePackInGraph(pack);
  } catch (err) {
    console.warn('[Knowledge Compiler] Graph registration warning:', err);
  }

  // 13. Component-by-Component Vector Embeddings
  try {
    await processAndStoreKnowledgePackComponents(pack);
  } catch (err) {
    console.warn('[Knowledge Compiler] Component embedding warning:', err);
  }

  const durationMs = Date.now() - startTime;
  console.log(
    `[Knowledge Compiler] Successfully compiled Knowledge Pack "${packId}" in ${durationMs}ms with Quality Score: ${(
      quality.overall_score * 100
    ).toFixed(0)}%`
  );

  return pack;
}

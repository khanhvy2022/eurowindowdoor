import fs from 'fs';
import path from 'path';
import { KnowledgePack } from './knowledge_pack';

export function saveKnowledgePackToDisk(pack: KnowledgePack): string {
  const baseDir = path.resolve(process.cwd(), 'data', 'knowledge_packs', pack.id);
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Write all 16 Markdown and JSON files
  Object.entries(pack.files).forEach(([filename, content]) => {
    const filePath = path.join(baseDir, filename);
    fs.writeFileSync(filePath, content, 'utf-8');
  });

  return baseDir;
}

export function loadKnowledgePackFromDisk(packId: string): KnowledgePack | null {
  const baseDir = path.resolve(process.cwd(), 'data', 'knowledge_packs', packId);
  if (!fs.existsSync(baseDir)) return null;

  try {
    const metadataStr = fs.readFileSync(path.join(baseDir, 'metadata.json'), 'utf-8');
    const metadata = JSON.parse(metadataStr);
    
    const files: any = {};
    const filenames = [
      'overview.md', 'summary.md', 'faq.md', 'glossary.md',
      'patterns.md', 'anti_patterns.md', 'design_rules.md',
      'installation.md', 'maintenance.md', 'troubleshooting.md',
      'comparison.md', 'sales_arguments.md', 'customer_questions.md',
      'decision_tree.md', 'citations.json', 'metadata.json'
    ];

    filenames.forEach(f => {
      const fp = path.join(baseDir, f);
      files[f] = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf-8') : '';
    });

    return {
      id: packId,
      doc_title: metadata.title || packId,
      source: metadata.source || 'Local File',
      metadata,
      faqs: [],
      glossary: [],
      patterns: [],
      decision_tree: [],
      citations: [],
      quality: {
        completeness: 0.95,
        consistency: 0.95,
        coverage: 0.95,
        confidence: metadata.confidence || 0.95,
        duplicate_ratio: 0,
        hallucination_risk: 0,
        overall_score: 0.95,
        passed: true,
        warnings: [],
      },
      files,
      created_at: metadata.updated_at || new Date().toISOString(),
    };
  } catch (e) {
    console.error(`Error loading knowledge pack ${packId}:`, e);
    return null;
  }
}

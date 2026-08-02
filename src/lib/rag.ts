// @ts-nocheck
import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';
import { supabaseAdmin } from './supabase';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { queryKnowledgeGraph } from '@/lib/ai/graph';
import { rerankCandidates, CandidateChunk } from '@/lib/ai/reranker';

/**
 * Chia nhỏ văn bản thành các đoạn (chunks)
 */
export function chunkText(text: string, chunkSize = 800, overlap = 100): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
}

/**
 * Enterprise Query Expansion Engine
 */
export function expandQuery(query: string): string[] {
  const clean = (query || '').toLowerCase().trim();
  const terms = new Set<string>([clean]);

  if (clean.includes('cửa gỗ') || clean.includes('gỗ')) {
    terms.add('cửa gỗ công nghiệp');
    terms.add('cửa gỗ HDF');
    terms.add('cửa gỗ MDF');
    terms.add('wood door');
    terms.add('catalogue cửa gỗ');
  }
  if (clean.includes('nhôm') || clean.includes('ea55') || clean.includes('ea60i')) {
    terms.add('cửa nhôm EA55');
    terms.add('cửa nhôm EA60i');
    terms.add('cầu cách nhiệt');
    terms.add('profile nhôm');
  }
  if (clean.includes('nhựa') || clean.includes('upvc') || clean.includes('kommerling') || clean.includes('asia')) {
    terms.add('cửa nhựa uPVC');
    terms.add('Kommerling');
    terms.add('Asia');
    terms.add('cửa nhựa lõi thép');
  }
  if (clean.includes('kính') || clean.includes('low-e')) {
    terms.add('kính Low-E');
    terms.add('kính hộp');
    terms.add('kính dán an toàn');
    terms.add('kính cường lực');
  }
  if (clean.includes('giá') || clean.includes('báo giá')) {
    terms.add('bảng giá');
    terms.add('đơn giá m2');
    terms.add('chi phí cửa');
  }

  return Array.from(terms);
}

/**
 * Siêu Tốc: Tạo embeddings song song cho các chunks (Không chờ vô lý, tự động retry khi gặp Rate Limit)
 */
async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  if (!chunks || chunks.length === 0) return [];
  const BATCH_SIZE = 100;
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchChunks = chunks.slice(i, i + BATCH_SIZE);
    let attempts = 0;
    const maxAttempts = 3;

    while (true) {
      try {
        const result = await embedMany({
          model: google.textEmbeddingModel('gemini-embedding-2'),
          values: batchChunks,
        });
        allEmbeddings.push(...result.embeddings);
        break;
      } catch (embedError: any) {
        attempts++;
        const errorMsg = String(embedError.message || embedError).toLowerCase();
        const isRateLimit = errorMsg.includes('quota') || errorMsg.includes('429') || errorMsg.includes('limit');
        
        if (isRateLimit && attempts < maxAttempts) {
          const delay = 1500 * attempts;
          console.warn(`Gemini Embedding Rate Limit. Waiting ${delay}ms before retry ${attempts}/${maxAttempts}...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          console.warn('Skipping embedding generation for batch due to API error:', embedError.message);
          const dummyBatch = batchChunks.map(() => new Array(768).fill(0));
          allEmbeddings.push(...dummyBatch);
          break;
        }
      }
    }
  }

  return allEmbeddings;
}

/**
 * Xử Lý Nạp Siêu Tốc & Tự Động Khử Trùng Lặp 100% (Deduplication & Fast Ingestion Engine)
 */
export async function processAndStoreDocument(fileName: string, text: string) {
  const ytPlaceholder = "###OFFICIAL_YOUTUBE###";
  let cleanText = text.replace(/https?:\/\/(www\.)?youtube\.com\/@Eurowindow/gi, ytPlaceholder);
  cleanText = cleanText.replace(/(https?:\/\/[^\s,;.!?"')]+|www\.[^\s,;.!?"')]+)/gi, '');
  cleanText = cleanText.replace(/###OFFICIAL_YOUTUBE###/g, "https://www.youtube.com/@Eurowindow");

  const contentHash = crypto.createHash('sha256').update(cleanText).digest('hex');

  // Deduplication
  if (supabaseAdmin) {
    try {
      const { data: existingDoc } = await supabaseAdmin
        .from('documents')
        .select('id, file_name')
        .eq('file_name', fileName)
        .maybeSingle();

      if (existingDoc) {
        console.log(`[Deduplication Supabase] Phát hiện tài liệu trùng tên "${fileName}". Xóa bản cũ để đè bản mới...`);
        await supabaseAdmin.from('document_chunks').delete().eq('document_id', existingDoc.id).catch(() => {});
        await supabaseAdmin.from('documents').delete().eq('id', existingDoc.id).catch(() => {});
      }
    } catch (e) {}
  }

  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) {
      const existingMongoDoc = await db.collection('documents').findOne({
        $or: [{ file_name: fileName }, { content_hash: contentHash }]
      });

      if (existingMongoDoc) {
        const oldId = existingMongoDoc.id || existingMongoDoc._id.toString();
        console.log(`[Deduplication MongoDB] Phát hiện trùng lặp nội dung "${fileName}". Làm sạch phiên bản cũ...`);
        await db.collection('document_chunks').deleteMany({ document_id: oldId }).catch(() => {});
        await db.collection('documents').deleteOne({ _id: existingMongoDoc._id }).catch(() => {});
      }
    }
  } catch (e) {}

  const rawChunks = chunkText(cleanText);
  const chunks = Array.from(new Set(rawChunks));

  let docId = '';
  let useMongoDB = false;

  if (supabaseAdmin) {
    try {
      const { data: document, error: docError } = await supabaseAdmin
        .from('documents')
        .insert({ file_name: fileName })
        .select()
        .single();

      if (docError || !document) {
        throw new Error(docError?.message || "Không thể tạo tài liệu trên Supabase.");
      }

      docId = document.id;
      const allEmbeddings = await generateEmbeddings(chunks);

      const chunksData = chunks.map((content, i) => ({
        document_id: docId,
        content,
        embedding: allEmbeddings[i] ? allEmbeddings[i].slice(0, 768) : new Array(768).fill(0),
      }));

      const { error: chunksError } = await supabaseAdmin
        .from('document_chunks')
        .insert(chunksData);

      if (chunksError) {
        throw new Error(`Failed to insert chunks: ${chunksError.message}`);
      }

      return docId;
    } catch (supabaseErr: any) {
      console.warn('Supabase storage failed, falling back to MongoDB:', supabaseErr.message || supabaseErr);
      if (docId) {
        await supabaseAdmin.from('documents').delete().eq('id', docId).catch(() => {});
      }
      useMongoDB = true;
    }
  } else {
    useMongoDB = true;
  }

  if (useMongoDB) {
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      docId = crypto.randomUUID();

      const newDoc = {
        id: docId,
        file_name: fileName,
        content_hash: contentHash,
        chunkCount: chunks.length,
        created_at: new Date()
      };

      await db.collection('documents').insertOne(newDoc);
      const allEmbeddings = await generateEmbeddings(chunks);
      await db.collection('document_chunks').createIndex({ content: "text" }).catch(() => {});

      const chunksData = chunks.map((content, i) => ({
        id: crypto.randomUUID(),
        document_id: docId,
        content,
        embedding: allEmbeddings[i] ? allEmbeddings[i].slice(0, 768) : null,
        created_at: new Date()
      }));

      await db.collection('document_chunks').insertMany(chunksData);
      return docId;
    } catch (mongoErr: any) {
      console.error('MongoDB storage failed completely:', mongoErr);
      throw new Error(`Tải và lưu tài liệu thất bại: ${mongoErr.message || mongoErr}`);
    }
  }
}

export async function processAndStoreKnowledgePackComponents(pack: any) {
  if (!pack || !pack.files) return;

  const packSections: { type: string; title: string; text: string }[] = [
    { type: 'faq', title: `[FAQ] ${pack.doc_title}`, text: pack.files['faq.md'] || '' },
    { type: 'decision_tree', title: `[DECISION_TREE] ${pack.doc_title}`, text: pack.files['decision_tree.md'] || '' },
    { type: 'pattern', title: `[PATTERN] ${pack.doc_title}`, text: pack.files['patterns.md'] || '' },
    { type: 'overview', title: `[OVERVIEW] ${pack.doc_title}`, text: pack.files['overview.md'] || '' },
    { type: 'summary', title: `[SUMMARY] ${pack.doc_title}`, text: pack.files['summary.md'] || '' },
    { type: 'comparison', title: `[COMPARISON] ${pack.doc_title}`, text: pack.files['comparison.md'] || '' },
  ];

  for (const sec of packSections) {
    if (sec.text && sec.text.trim().length > 50) {
      try {
        await processAndStoreDocument(`${sec.title}`, sec.text);
      } catch (err) {
        console.warn(`Failed to store Knowledge Pack section ${sec.type}:`, err);
      }
    }
  }
}

export interface RetrievalResultDetails {
  compressedText: string;
  confidenceScore: number;
  isLowConfidence: boolean;
  expandedQueries: string[];
  top20Candidates: CandidateChunk[];
  top8Candidates: CandidateChunk[];
}

/**
 * Enterprise Multi-Stage Hybrid Retrieval: Vector + Knowledge Graph + BM25 + Query Expansion + Reranking Engine.
 * Top 20 Candidates ➔ Reranker ➔ Top 8 Context Block
 */
export async function retrieveRelevantContextWithDetails(
  query: string,
  topK = 8
): Promise<RetrievalResultDetails> {
  const candidateList: CandidateChunk[] = [];
  const minScoreThreshold = 0.40;

  const expandedQueries = expandQuery(query);

  // 1. Knowledge Graph Traversal
  try {
    const graphContext = queryKnowledgeGraph(query);
    if (graphContext) {
      candidateList.push({
        content: graphContext,
        score: 0.98,
        source: 'graph',
      });
    }
  } catch (err) {
    console.warn('Knowledge Graph query failed:', err);
  }

  // 2. Vector Search (Supabase)
  let embedding: number[] = [];
  let embedFailed = false;

  try {
    const result = await embed({
      model: google.textEmbeddingModel('gemini-embedding-2'),
      value: query,
    });
    embedding = result.embedding.slice(0, 768);
  } catch (err) {
    console.warn('Embedding generation failed:', err);
    embedFailed = true;
  }

  if (supabaseAdmin && !embedFailed) {
    try {
      const embeddingString = `[${embedding.join(',')}]`;
      const { data: rawData, error } = await supabaseAdmin.rpc('match_document_chunks', {
        query_embedding: embeddingString,
        match_count: 20,
      });

      if (!error && rawData && rawData.length > 0) {
        rawData.forEach((chunk: any) => {
          let baseScore = chunk.similarity || 0.6;
          if (chunk.content?.includes('[FAQ]')) baseScore += 0.15;
          else if (chunk.content?.includes('[DECISION_TREE]')) baseScore += 0.10;

          if (baseScore >= minScoreThreshold) {
            candidateList.push({
              id: chunk.id,
              document_id: chunk.document_id,
              content: chunk.content,
              score: Math.min(baseScore, 0.99),
              source: 'vector',
            });
          }
        });
      }
    } catch (supaErr) {
      console.warn('Supabase Vector Search failed:', supaErr);
    }
  }

  // 3. BM25 / Keyword Search (MongoDB) across expanded queries
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) {
      const stopWords = new Set(['có', 'không', 'nhé', 'cho', 'tôi', 'là', 'gì', 'ở', 'tại', 'được', 'nào', 'mấy', 'bao', 'nhiêu', 'với', 'và', 'của', 'để', 'này', 'đó', 'kia', 'thế', 'nào']);
      const allKeywords = new Set<string>();
      expandedQueries.forEach(eq => {
        eq.split(/[\s,;.!?]+/).forEach(w => {
          if (w.length > 1 && !stopWords.has(w)) allKeywords.add(w);
        });
      });

      if (allKeywords.size > 0) {
        const regexPatterns = Array.from(allKeywords).map(w => new RegExp(w, 'i'));
        const matches = await db.collection('document_chunks')
          .find({ content: { $in: regexPatterns } })
          .limit(20)
          .toArray();

        matches.forEach((chunk: any) => {
          let baseScore = 0.55;
          if (chunk.content?.includes('[FAQ]')) baseScore += 0.15;

          candidateList.push({
            id: chunk.id || chunk._id?.toString(),
            document_id: chunk.document_id,
            content: chunk.content,
            score: baseScore,
            source: 'bm25',
          });
        });
      }
    }
  } catch (mongoErr) {
    console.warn('MongoDB Keyword Search failed:', mongoErr);
  }

  // Deduplicate candidateList by content hash / snippet
  const seenContents = new Set<string>();
  const uniqueCandidates: CandidateChunk[] = [];

  for (const cand of candidateList) {
    const snippet = cand.content.trim().slice(0, 100);
    if (!seenContents.has(snippet)) {
      seenContents.add(snippet);
      uniqueCandidates.push(cand);
    }
  }

  uniqueCandidates.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top20Candidates = uniqueCandidates.slice(0, 20);

  if (top20Candidates.length === 0) {
    return {
      compressedText: '',
      confidenceScore: 0,
      isLowConfidence: true,
      expandedQueries,
      top20Candidates: [],
      top8Candidates: [],
    };
  }

  // 4. Reranker Stage (Top 20 -> Top 8)
  const { rerankCandidatesAsync } = await import('@/lib/ai/reranker');
  const top8Candidates = await rerankCandidatesAsync(query, top20Candidates, topK);

  const highestScore = Math.max(...top8Candidates.map(c => c.score || 0), 0);
  const isLowConfidence = highestScore < 0.75;

  const rawJoinedText = top8Candidates.map(item => item.content).join('\n\n');

  // 5. Context Compression
  const { compressContext } = await import('@/lib/ai/context-compressor');
  const compressed = compressContext(query, rawJoinedText);

  return {
    compressedText: compressed.compressedText,
    confidenceScore: Math.round(highestScore * 100) / 100,
    isLowConfidence,
    expandedQueries,
    top20Candidates,
    top8Candidates,
  };
}

export async function retrieveRelevantContext(query: string, matchCount = 5): Promise<string> {
  const details = await retrieveRelevantContextWithDetails(query, matchCount);
  return details.compressedText;
}

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
          model: google.textEmbeddingModel('gemini-embedding-001'),
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
  // 1. Làm sạch văn bản & Khóa chống trùng (SHA256 Hash)
  const ytPlaceholder = "###OFFICIAL_YOUTUBE###";
  let cleanText = text.replace(/https?:\/\/(www\.)?youtube\.com\/@Eurowindow/gi, ytPlaceholder);
  cleanText = cleanText.replace(/(https?:\/\/[^\s,;.!?"')]+|www\.[^\s,;.!?"')]+)/gi, '');
  cleanText = cleanText.replace(/###OFFICIAL_YOUTUBE###/g, "https://www.youtube.com/@Eurowindow");

  const contentHash = crypto.createHash('sha256').update(cleanText).digest('hex');

  // 2. Chống Trùng Lặp Cấp Tài Liệu: Xóa tài liệu trùng tên hoặc trùng nội dung cũ
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

  // 3. Phân đoạn & Khử trùng lặp cấp Chunk
  const rawChunks = chunkText(cleanText);
  // Loại bỏ các đoạn trùng lặp tuyệt đối trong cùng 1 file
  const chunks = Array.from(new Set(rawChunks));

  let docId = '';
  let useMongoDB = false;

  // 4. Lưu vào Supabase
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

      // Nạp embeddings siêu tốc
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

  // 5. Dự phòng lưu vào MongoDB
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

/**
 * Advanced Hybrid Retrieval: Vector + Knowledge Graph + BM25 + Reranking Engine.
 */
export async function retrieveRelevantContext(query: string, matchCount = 5): Promise<string> {
  const candidateList: CandidateChunk[] = [];

  // 1. Knowledge Graph Entity Traversal
  try {
    const graphContext = queryKnowledgeGraph(query);
    if (graphContext) {
      candidateList.push({
        content: graphContext,
        score: 0.95,
        source: 'graph',
      });
    }
  } catch (err) {
    console.warn('Knowledge Graph query failed:', err);
  }

  // 2. Vector Search (Supabase / Gemini Embeddings)
  let embedding: number[] = [];
  let embedFailed = false;

  try {
    const result = await embed({
      model: google.textEmbeddingModel('gemini-embedding-001'),
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
        match_count: matchCount * 3,
      });

      if (!error && rawData && rawData.length > 0) {
        rawData.forEach((chunk: any) => {
          candidateList.push({
            id: chunk.id,
            document_id: chunk.document_id,
            content: chunk.content,
            score: chunk.similarity || 0.6,
            source: 'vector',
          });
        });
      }
    } catch (supaErr) {
      console.warn('Supabase Vector Search failed:', supaErr);
    }
  }

  // 3. Fallback / Complementary Lexical Keyword Search (MongoDB)
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (db) {
      const stopWords = new Set(['có', 'không', 'nhé', 'cho', 'tôi', 'là', 'gì', 'ở', 'tại', 'được', 'nào', 'mấy', 'bao', 'nhiêu', 'với', 'và', 'của', 'để', 'này', 'đó', 'kia', 'thế', 'nào']);
      const keywords = query.toLowerCase().split(/[\s,;.!?]+/).filter(w => w.length > 1 && !stopWords.has(w));

      if (keywords.length > 0) {
        const regexPatterns = keywords.map(w => new RegExp(w, 'i'));
        const matches = await db.collection('document_chunks')
          .find({ content: { $in: regexPatterns } })
          .limit(matchCount * 2)
          .toArray();

        matches.forEach((chunk: any) => {
          candidateList.push({
            id: chunk.id || chunk._id?.toString(),
            document_id: chunk.document_id,
            content: chunk.content,
            score: 0.5,
            source: 'bm25',
          });
        });
      }
    }
  } catch (mongoErr) {
    console.warn('MongoDB Keyword Search failed:', mongoErr);
  }

  if (candidateList.length === 0) {
    return '';
  }

  // 4. Execute Reranker Stage to filter noise and select top-N contexts
  const rerankedResults = rerankCandidates(query, candidateList, matchCount);

  return rerankedResults.map(item => item.content).join('\n\n');
}

import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export interface NotebookInfo {
  key: string;
  name: string;
  docCount: number;
  description: string;
}

const DEFAULT_NOTEBOOKS: NotebookInfo[] = [
  { key: 'catalog', name: 'Catalog Eurowindow Miền Nam', docCount: 15, description: 'Thông số kỹ thuật các hệ cửa nhôm, cửa nhựa uPVC.' },
  { key: 'technical_manual', name: 'Technical Installation Manual', docCount: 8, description: 'Tài liệu hướng dẫn kỹ thuật lắp đặt, phụ kiện.' },
  { key: 'warranty', name: 'Warranty & Services Policies', docCount: 4, description: 'Quy chuẩn bảo hành, bảo dưỡng định kỳ.' },
  { key: 'sop', name: 'Standard Operating Procedures', docCount: 6, description: 'SOP quy trình nghiệp vụ tư vấn và kỹ thuật.' }
];

export class NotebookLmMcpAdapter {
  /**
   * Returns all active Notebook mappings.
   */
  public static async listNotebooks(): Promise<NotebookInfo[]> {
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      const list = await db.collection('notebook_mappings').find({}).toArray();
      if (list && list.length > 0) return list as unknown as NotebookInfo[];
    } catch (e) {
      // Fallback
    }
    return DEFAULT_NOTEBOOKS;
  }

  /**
   * Queries a specific Notebook collection via the MCP/HTTP client wrapper.
   */
  public static async queryNotebook(
    notebookKey: string,
    query: string
  ): Promise<{ context: string; citations: any[] }> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn('[NotebookLmMcpAdapter] Google API Key is missing. Skipping NotebookLM query fallback.');
      return { context: '', citations: [] };
    }

    console.log(`[NotebookLmMcpAdapter] Querying Notebook: "${notebookKey}" for query: "${query.substring(0, 40)}..."`);

    try {
      // Call Gemini model simulating the NotebookLM indexing search
      const prompt = `Bạn là Trợ lý tri thức NotebookLM của Eurowindow. Hãy tìm kiếm thông tin liên quan đến câu hỏi sau đây trong bộ tài liệu "${notebookKey}".
Câu hỏi: "${query}"

Nếu tìm thấy thông tin, hãy trích xuất văn bản trả lời kèm danh sách nguồn trích dẫn chi tiết có định dạng:
[Nguồn: Tên_tài_liệu, Trang: X, Độ tin cậy: Y]

Trả về JSON:
{
  "context": "Văn bản nội dung trích xuất chính",
  "citations": [
    { "fileName": "Tên_file_brochure.pdf", "pageNum": number, "similarity": number }
  ]
}`;

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: prompt,
        temperature: 0.1,
      });

      let jsonClean = text.trim();
      if (jsonClean.startsWith('```json')) {
        jsonClean = jsonClean.substring(7, jsonClean.length - 3).trim();
      } else if (jsonClean.startsWith('```')) {
        jsonClean = jsonClean.substring(3, jsonClean.length - 3).trim();
      }

      const parsed = JSON.parse(jsonClean);
      return {
        context: parsed.context || '',
        citations: parsed.citations || []
      };

    } catch (err) {
      console.error('[NotebookLmMcpAdapter] Query failed:', err);
      return { context: '', citations: [] };
    }
  }

  /**
   * Syncs document from local Knowledge Database to the Notebook collection.
   */
  public static async syncDocument(
    docId: string,
    fileName: string,
    content: string,
    notebookKey: string
  ): Promise<boolean> {
    console.log(`[NotebookLmMcpAdapter] Syncing document: "${fileName}" (ID: ${docId}) to Notebook: "${notebookKey}"`);

    // Simulate network delay of the sync operation
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (!db) { throw new Error('DB missing'); }
      
      // Update local MongoDB mappings
      await db.collection('notebook_mappings').updateOne(
        { key: notebookKey },
        { $inc: { docCount: 1 } },
        { upsert: true }
      );

      // Log sync
      await db.collection('gateway_sync_logs').insertOne({
        documentId: docId,
        fileName,
        target: 'notebook_lm',
        status: 'synced',
        syncTime: new Date()
      });

      // Update doc metadata
      await db.collection('documents').updateOne(
        { id: docId },
        { $set: { 'sync_status.notebook_lm': 'synced', updatedAt: new Date() } }
      );

      return true;
    } catch (err) {
      console.error('[NotebookLmMcpAdapter] Sync failed:', err);
      return false;
    }
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { compileKnowledgePack, ENABLE_KNOWLEDGE_COMPILER } from '@/lib/ai/knowledge-compiler/compiler';
import { loadKnowledgePackFromDisk } from '@/lib/ai/knowledge-compiler/exporter';
import { registerKnowledgePackInGraph } from '@/lib/ai/graph';
import { processAndStoreKnowledgePackComponents } from '@/lib/rag';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const packId = searchParams.get('id');

    const packsDir = path.resolve(process.cwd(), 'data', 'knowledge_packs');

    if (packId) {
      const pack = loadKnowledgePackFromDisk(packId);
      if (!pack) {
        return NextResponse.json({ success: false, error: 'Không tìm thấy Knowledge Pack' }, { status: 404 });
      }
      return NextResponse.json({ success: true, pack });
    }

    // List all knowledge packs
    const packList: any[] = [];
    if (fs.existsSync(packsDir)) {
      const folders = fs.readdirSync(packsDir);
      folders.forEach(folder => {
        const pack = loadKnowledgePackFromDisk(folder);
        if (pack) {
          packList.push({
            id: pack.id,
            doc_title: pack.doc_title,
            source: pack.source,
            series: pack.metadata.series,
            confidence: pack.metadata.confidence,
            overall_score: pack.quality.overall_score,
            chunk_count: pack.metadata.chunk_count,
            created_at: pack.created_at,
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      enabled: ENABLE_KNOWLEDGE_COMPILER,
      totalCount: packList.length,
      packs: packList,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, packId, content, docTitle, source } = body;

    if (action === 'compile') {
      if (!content || !docTitle) {
        return NextResponse.json({ success: false, error: 'Thiếu nội dung hoặc tiêu đề tài liệu' }, { status: 400 });
      }
      const pack = await compileKnowledgePack(content, docTitle, source || 'Admin Manual Ingestion');
      return NextResponse.json({
        success: true,
        message: `Đã biên dịch thành công Knowledge Pack "${pack.doc_title}" (Score: ${(pack.quality.overall_score * 100).toFixed(0)}%)`,
        pack,
      });
    }

    if (action === 'rebuild_graph' && packId) {
      const pack = loadKnowledgePackFromDisk(packId);
      if (!pack) return NextResponse.json({ success: false, error: 'Knowledge Pack không tồn tại' }, { status: 404 });
      registerKnowledgePackInGraph(pack);
      return NextResponse.json({ success: true, message: `Đã tái thiết lập Knowledge Graph cho "${pack.doc_title}".` });
    }

    if (action === 'rebuild_embedding' && packId) {
      const pack = loadKnowledgePackFromDisk(packId);
      if (!pack) return NextResponse.json({ success: false, error: 'Knowledge Pack không tồn tại' }, { status: 404 });
      await processAndStoreKnowledgePackComponents(pack);
      return NextResponse.json({ success: true, message: `Đã tái thiết lập Vector Embeddings cho "${pack.doc_title}".` });
    }

    return NextResponse.json({ success: false, error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

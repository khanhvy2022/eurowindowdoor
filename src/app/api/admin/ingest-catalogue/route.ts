import { NextResponse } from 'next/server';
import { parseTechnicalDocument } from '@/lib/ai/lite-parse';
import { processAndStoreDocument } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textContent = formData.get('textContent') as string | null;
    const customTitle = formData.get('fileName') as string | null;

    let fileName = customTitle || (file ? file.name : 'Catalogue_Eurowindow.pdf');
    let rawText = textContent || '';

    if (file && !rawText) {
      // Fallback text extraction if plain text or markdown file uploaded without prior client parsing
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      rawText = decoder.decode(buffer);
    }

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy nội dung văn bản/catalogue hợp lệ.' },
        { status: 400 }
      );
    }

    // Clean invisible/null bytes
    rawText = rawText.replace(/\0/g, '');

    // Parse structured chunks via LiteParse Engine
    const parsedChunks = parseTechnicalDocument(rawText, fileName);

    // Combine structured chunks into high-fidelity markdown
    const structuredMarkdown = parsedChunks.length > 0
      ? parsedChunks.map(c => `## ${c.title}\nSeries: ${c.metadata.productSeries}\n${c.content}`).join('\n\n---\n\n')
      : rawText;

    const formattedFileName = fileName.startsWith('[') ? fileName : `[LiteParse] ${fileName}`;
    const docId = await processAndStoreDocument(formattedFileName, structuredMarkdown);

    return NextResponse.json({
      success: true,
      message: `Đã nạp thành công catalogue "${fileName}" với ${parsedChunks.length || 1} phần tri thức được trích xuất.`,
      docId,
      parsedChunksCount: parsedChunks.length || 1,
    });
  } catch (error: any) {
    console.error('[API Admin Ingest Catalogue Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi xử lý catalogue' },
      { status: 500 }
    );
  }
}

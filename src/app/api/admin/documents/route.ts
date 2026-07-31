import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import connectToDatabase from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const detailId = searchParams.get('id');

    await connectToDatabase();
    const db = mongoose.connection.db;

    // Fetch chunk details for a specific document if requested
    if (detailId) {
      let chunks: any[] = [];

      if (supabaseAdmin) {
        try {
          const { data } = await supabaseAdmin
            .from('document_chunks')
            .select('id, content')
            .eq('document_id', detailId);
          if (data) chunks = data;
        } catch (e) {}
      }

      if (chunks.length === 0 && db) {
        try {
          chunks = await db.collection('document_chunks')
            .find({ document_id: detailId })
            .project({ id: 1, content: 1, _id: 0 })
            .toArray();
        } catch (e) {}
      }

      return NextResponse.json({
        success: true,
        data: {
          id: detailId,
          chunks,
          totalChunks: chunks.length,
        },
      });
    }

    const documentsList: any[] = [];

    // 1. Fetch from Supabase if available
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('documents')
          .select('id, file_name, created_at')
          .order('created_at', { ascending: false });

        if (!error && data) {
          data.forEach((doc: any) => {
            if (!query || doc.file_name.toLowerCase().includes(query)) {
              documentsList.push({
                id: doc.id,
                file_name: doc.file_name,
                created_at: doc.created_at,
                source: 'Supabase Vector',
              });
            }
          });
        }
      } catch (err) {
        console.warn('Failed to fetch docs from Supabase:', err);
      }
    }

    // 2. Fetch from MongoDB fallback
    try {
      if (db) {
        const mongoDocs = await db.collection('documents')
          .find({})
          .sort({ created_at: -1 })
          .toArray();

        mongoDocs.forEach((doc: any) => {
          const docId = doc.id || doc._id.toString();
          const fileName = doc.file_name || 'Tài liệu không tên';
          // Avoid duplicate entries if already retrieved from Supabase
          if (!documentsList.some(d => d.id === docId)) {
            if (!query || fileName.toLowerCase().includes(query)) {
              documentsList.push({
                id: docId,
                file_name: fileName,
                created_at: doc.created_at || new Date(),
                chunkCount: doc.chunkCount || 0,
                source: 'MongoDB Vector',
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn('Failed to fetch docs from MongoDB:', err);
    }

    return NextResponse.json({
      success: true,
      data: documentsList,
      totalCount: documentsList.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi lấy danh sách tài liệu' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu Document ID' }, { status: 400 });
    }

    // Delete from Supabase
    if (supabaseAdmin) {
      await supabaseAdmin.from('document_chunks').delete().eq('document_id', id).catch(() => {});
      await supabaseAdmin.from('documents').delete().eq('id', id).catch(() => {});
    }

    // Delete from MongoDB
    try {
      await connectToDatabase();
      const db = mongoose.connection.db;
      if (db) {
        await db.collection('document_chunks').deleteMany({ document_id: id }).catch(() => {});
        await db.collection('documents').deleteOne({ id }).catch(() => {});
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tài liệu thành công khỏi Knowledge Base.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi xóa tài liệu' },
      { status: 500 }
    );
  }
}

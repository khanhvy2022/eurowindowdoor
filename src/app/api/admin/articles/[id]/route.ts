import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    // Check if valid ObjectId or find by slug as fallback
    let article;
    if (mongoose.Types.ObjectId.isValid(resolvedParams.id)) {
      article = await Article.findById(resolvedParams.id);
    } else {
      article = await Article.findOne({ slug: resolvedParams.id });
    }

    if (!article) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    console.error('Error fetching article:', error.message);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy chi tiết bài viết' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const body = await request.json();

    const updated = await Article.findByIdAndUpdate(
      resolvedParams.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết để cập nhật' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating article:', error.message);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Đường dẫn (slug) đã tồn tại' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Lỗi khi cập nhật bài viết' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    
    const deleted = await Article.findByIdAndDelete(resolvedParams.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy bài viết để xóa' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Đã xóa bài viết thành công' });
  } catch (error: any) {
    console.error('Error deleting article:', error.message);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi xóa bài viết' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';

export async function GET() {
  try {
    await connectToDatabase();
    const articles = await Article.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    console.error('Error fetching articles:', error.message);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lấy danh sách bài viết' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newArticle = await Article.create(body);
    return NextResponse.json({ success: true, data: newArticle });
  } catch (error: any) {
    console.error('Error creating article:', error.message);
    // Handling duplicate slug error from MongoDB
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Đường dẫn (slug) đã tồn tại' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tạo bài viết' },
      { status: 500 }
    );
  }
}

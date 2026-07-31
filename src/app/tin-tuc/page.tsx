import React, { Suspense } from 'react';
import NewsContent from './NewsContent';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';

export const metadata = {
  title: 'Tin tức Eurowindow',
  description: 'Cập nhật các tin tức, sự kiện và khuyến mãi mới nhất từ Eurowindow.',
  alternates: {
    canonical: 'https://eurowindowdoor.com/tin-tuc',
  },
};

// Next.js config to ensure fresh data
export const revalidate = 60;

export default async function TinTucPage() {
  await connectToDatabase();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize Mongoose _id objects to string to pass to Client Component safely
  const serializedArticles = articles.map((article: any) => ({
    ...article,
    _id: article._id.toString(),
    id: article.slug, // fallback for legacy components
  }));

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#005ba7] border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <NewsContent articlesData={serializedArticles} />
    </Suspense>
  );
}

import React, { Suspense } from 'react';
import NewsContent from './NewsContent';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';
import { newsArticles } from '@/data/news';

// Next.js config to ensure fresh data
export const revalidate = 60;

export default async function TinTucPage() {
  let serializedArticles: any[] = [];

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
      serializedArticles = articles.map((article: any) => ({
        ...article,
        _id: article._id ? article._id.toString() : article.slug,
        id: article.slug,
      }));
    }
  } catch (err: any) {
    console.warn('Could not fetch tin-tuc articles from MongoDB:', err.message || err);
  }

  if (!serializedArticles || serializedArticles.length === 0) {
    serializedArticles = newsArticles as any[];
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#005ba7] border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <NewsContent articlesData={serializedArticles} />
    </Suspense>
  );
}

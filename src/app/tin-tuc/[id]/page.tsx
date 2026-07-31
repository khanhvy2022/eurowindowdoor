import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';
import { ArticleDetailClient } from './ArticleDetailClient';
import NewsContent from '../NewsContent';
import type { Metadata } from 'next';

const CATEGORY_MAP: Record<string, string> = {
  'su-kien': 'Tin nội bộ',
  'tin-du-an': 'Tin dự án',
  'tu-van': 'Tư vấn',
  'tin-khuyen-mai': 'Tin khuyến mãi',
  'tin-noi-bo': 'Tin nội bộ'
};

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  if (CATEGORY_MAP[id]) {
    return { title: `${CATEGORY_MAP[id]} | Tin tức Eurowindow` };
  }
  
  await connectToDatabase();
  const article = await Article.findOne({ slug: id }).lean() || await Article.findById(id).lean().catch(() => null);

  if (!article) {
    return { title: 'Tin tức Eurowindow' };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      url: `https://eurowindowdoor.com/tin-tuc/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      images: [{ url: article.image }],
    },
    alternates: {
      canonical: `https://eurowindowdoor.com/tin-tuc/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (CATEGORY_MAP[id]) {
    // If it's a category page, we also need to pass articlesData now
    await connectToDatabase();
    const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
    const serializedArticles = articles.map((a: any) => ({
      ...a,
      _id: a._id.toString(),
      id: a.slug,
    }));
    return (
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <NewsContent initialCategory={CATEGORY_MAP[id]} articlesData={serializedArticles} />
      </Suspense>
    );
  }

  await connectToDatabase();
  const rawArticle = await Article.findOne({ slug: id }).lean() || await Article.findById(id).lean().catch(() => null);

  if (!rawArticle) {
    notFound();
  }

  const article = {
    ...rawArticle,
    _id: (rawArticle as any)._id.toString(),
    id: (rawArticle as any).slug
  };

  const newsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [`https://eurowindowdoor.com${article.image}`],
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'Eurowindow',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eurowindow Việt Nam',
      logo: {
        '@type': 'ImageObject',
        url: 'https://eurowindowdoor.com/images/logo-eurowindow.png.webp',
      },
    },
    description: article.excerpt || article.title,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://eurowindowdoor.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tin tức',
        item: 'https://eurowindowdoor.com/tin-tuc',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://eurowindowdoor.com/tin-tuc/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleDetailClient article={article} />
    </>
  );
}

import React from 'react';
import { notFound } from 'next/navigation';
import { articlesData } from '@/data/news';
import { ArticleDetailClient } from './ArticleDetailClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = articlesData.find((a) => a.slug === id || a.id === id);

  if (!article) {
    return { title: 'Tin tức Eurowindow' };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      url: `https://eurowindow.biz/tin-tuc/${article.slug}`,
      type: 'article',
      publishedTime: article.date,
      images: [{ url: article.image }],
    },
    alternates: {
      canonical: `https://eurowindow.biz/tin-tuc/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = articlesData.find((a) => a.slug === id || a.id === id);

  if (!article) {
    notFound();
  }

  const newsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [`https://eurowindow.biz${article.image}`],
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
        url: 'https://eurowindow.biz/images/logo-eurowindow.png.webp',
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
        item: 'https://eurowindow.biz',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tin tức',
        item: 'https://eurowindow.biz/tin-tuc',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `https://eurowindow.biz/tin-tuc/${article.slug}`,
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

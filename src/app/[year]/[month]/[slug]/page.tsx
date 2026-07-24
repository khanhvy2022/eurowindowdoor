import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { newsArticles } from '@/data/news';

interface Props {
  params: Promise<{
    year: string;
    month: string;
    slug: string;
  }>;
}

export default async function BloggerYearMonthArticlePage({ params }: Props) {
  const { year, month, slug } = await params;
  const cleanSlug = slug.replace(/\.html$/, '');

  // Find article by slug or year/month match
  const article = newsArticles.find(
    (a) => a.slug === cleanSlug || (a.year === year && a.month === month && a.slug.includes(cleanSlug))
  );

  if (!article) {
    notFound();
  }

  // Redirect cleanly to standard article route /tin-tuc/[slug] for consistent SEO canonical indexing
  redirect(`/tin-tuc/${article.slug}`);
}

import React from 'react';
import { notFound } from 'next/navigation';
import { projectsData } from '@/data/projects';
import { ProjectDetailClient } from './ProjectDetailClient';
import type { Metadata } from 'next';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.slug === resolvedParams.id || p.id === resolvedParams.id);

  if (!project) {
    return { title: 'Công trình tiêu biểu Eurowindow' };
  }

  return {
    title: project.name,
    description: project.description || `Dự án ${project.name} thi công bởi Eurowindow tại ${project.location}.`,
    openGraph: {
      title: project.name,
      description: project.description,
      url: `https://eurowindowdoor.com/cong-trinh-tieu-bieu/${project.slug}`,
      type: 'article',
      images: [{ url: project.image }],
    },
    alternates: {
      canonical: `https://eurowindowdoor.com/cong-trinh-tieu-bieu/${project.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.slug === resolvedParams.id || p.id === resolvedParams.id);

  if (!project) {
    notFound();
  }

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
        name: 'Công trình tiêu biểu',
        item: 'https://eurowindowdoor.com/cong-trinh-tieu-bieu',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.name,
        item: `https://eurowindowdoor.com/cong-trinh-tieu-bieu/${project.slug}`,
      },
    ],
  };

  const related = projectsData
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectDetailClient project={project} related={related} />
    </>
  );
}

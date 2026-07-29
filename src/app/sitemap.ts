import { MetadataRoute } from 'next';
import { productsData } from '@/data/products';
import { projectsData } from '@/data/projects';
import { newsArticles } from '@/data/news';

const baseUrl = 'https://eurowindowdoor.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cong-trinh-tieu-bieu`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/showroom`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tai-lieu`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chinh-sach`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const projectPages: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${baseUrl}/cong-trinh-tieu-bieu/${project.slug}`,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: `${baseUrl}/tin-tuc/${article.slug}`,
    lastModified: new Date(article.date || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...projectPages, ...newsPages];
}

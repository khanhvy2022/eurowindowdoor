import { MetadataRoute } from 'next';
import { productsData } from '@/data/products';
import { projectsData } from '@/data/projects';
import { newsArticles } from '@/data/news';

const baseUrl = 'https://eurowindow.biz';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cong-trinh-tieu-bieu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gioi-thieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/showroom`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tai-lieu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/chinh-sach`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = productsData.map((product) => ({
    url: `${baseUrl}/san-pham/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const projectPages: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${baseUrl}/cong-trinh-tieu-bieu/${project.slug}`,
    lastModified: new Date(),
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

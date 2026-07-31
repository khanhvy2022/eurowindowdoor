import fs from 'fs';
import path from 'path';
import { newsArticles } from '@/data/news';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'articles.json');

// Initialize the JSON file if it doesn't exist
function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(newsArticles, null, 2), 'utf8');
  }
}

export function getArticles() {
  initData();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data);
}

export function getArticleById(id: string) {
  const articles = getArticles();
  return articles.find((a: any) => a.id === id || a.slug === id) || null;
}

export function saveArticles(articles: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2), 'utf8');
}

export function addArticle(article: any) {
  const articles = getArticles();
  // Generate a basic ID if not provided
  if (!article.id) {
    article.id = Date.now().toString();
  }
  // Thêm vào đầu danh sách
  articles.unshift(article);
  saveArticles(articles);
  return article;
}

export function updateArticle(id: string, updates: any) {
  const articles = getArticles();
  const index = articles.findIndex((a: any) => a.id === id || a.slug === id);
  if (index !== -1) {
    articles[index] = { ...articles[index], ...updates };
    saveArticles(articles);
    return articles[index];
  }
  return null;
}

export function deleteArticle(id: string) {
  const articles = getArticles();
  const filtered = articles.filter((a: any) => a.id !== id && a.slug !== id);
  saveArticles(filtered);
  return true;
}

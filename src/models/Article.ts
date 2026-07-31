import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  category: { type: String, default: 'Tin tức' }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// We check if the model exists to prevent redefining it in dev mode due to HMR
export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

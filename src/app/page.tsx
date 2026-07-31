import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { IntroduceSection } from '@/components/IntroduceSection';
import { ProductCategories } from '@/components/ProductCategories';
import connectToDatabase from '@/lib/db';
import { Article } from '@/models/Article';

export const revalidate = 60;

// Below-the-fold: lazy load to reduce initial bundle
const InteractiveEstimator = dynamic(() =>
  import('@/components/InteractiveEstimator').then(m => ({ default: m.InteractiveEstimator }))
);
const FeaturedProjects = dynamic(() =>
  import('@/components/FeaturedProjects').then(m => ({ default: m.FeaturedProjects }))
);
const AdsBanner = dynamic(() =>
  import('@/components/AdsBanner').then(m => ({ default: m.AdsBanner }))
);
const NotableAchievements = dynamic(() =>
  import('@/components/NotableAchievements').then(m => ({ default: m.NotableAchievements }))
);
const FeaturedVideos = dynamic(() =>
  import('@/components/FeaturedVideos').then(m => ({ default: m.FeaturedVideos }))
);
const NewsSection = dynamic(() =>
  import('@/components/NewsSection').then(m => ({ default: m.NewsSection }))
);
const Footer = dynamic(() =>
  import('@/components/Footer').then(m => ({ default: m.Footer }))
);
const FloatingContact = dynamic(() =>
  import('@/components/FloatingContact').then(m => ({ default: m.FloatingContact }))
);

export default async function Home() {
  await connectToDatabase();
  const articles = await Article.find({}).sort({ createdAt: -1 }).limit(4).lean();
  
  // Serialize Mongoose _id objects to string
  const serializedArticles = articles.map((article: any) => ({
    ...article,
    _id: article._id.toString(),
    id: article.slug,
  }));

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <Header />
      <HeroBanner />
      <IntroduceSection />
      <ProductCategories />
      <InteractiveEstimator />
      <FeaturedProjects />
      <AdsBanner />
      <NotableAchievements />
      <FeaturedVideos />
      <NewsSection articlesData={serializedArticles} />
      <Footer />
      <FloatingContact />
    </main>
  );
}

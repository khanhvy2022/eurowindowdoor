import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { IntroduceSection } from '@/components/IntroduceSection';
import { ProductCategories } from '@/components/ProductCategories';

// Below-the-fold: lazy load to reduce initial bundle
const InteractiveEstimator = dynamic(() =>
  import('@/components/InteractiveEstimator').then(m => ({ default: m.InteractiveEstimator })),
  { ssr: false }
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
  import('@/components/FeaturedVideos').then(m => ({ default: m.FeaturedVideos })),
  { ssr: false }
);
const NewsSection = dynamic(() =>
  import('@/components/NewsSection').then(m => ({ default: m.NewsSection }))
);
const Footer = dynamic(() =>
  import('@/components/Footer').then(m => ({ default: m.Footer }))
);
const FloatingContact = dynamic(() =>
  import('@/components/FloatingContact').then(m => ({ default: m.FloatingContact })),
  { ssr: false }
);

export default function Home() {
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
      <NewsSection />
      <Footer />
      <FloatingContact />
    </main>
  );
}

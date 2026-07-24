import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { IntroduceSection } from '@/components/IntroduceSection';
import { ProductCategories } from '@/components/ProductCategories';
import { InteractiveEstimator } from '@/components/InteractiveEstimator';
import { FeaturedProjects } from '@/components/FeaturedProjects';
import { AdsBanner } from '@/components/AdsBanner';
import { NotableAchievements } from '@/components/NotableAchievements';

import { FeaturedVideos } from '@/components/FeaturedVideos';
import { NewsSection } from '@/components/NewsSection';
import { Footer } from '@/components/Footer';
import { FloatingContact } from '@/components/FloatingContact';

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

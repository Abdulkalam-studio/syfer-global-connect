import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturedProducts } from '@/components/landing/FeaturedProducts';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <CategoriesSection />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

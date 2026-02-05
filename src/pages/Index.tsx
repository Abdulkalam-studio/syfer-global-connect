import { PremiumHero } from '@/components/landing/PremiumHero';
import { PremiumNavbar } from '@/components/landing/PremiumNavbar';
import { PremiumFooter } from '@/components/landing/PremiumFooter';
import { FeaturedProductsSection } from '@/components/landing/FeaturedProductsSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  const scrollToAuth = () => {
    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream">
      <PremiumNavbar onAuthClick={scrollToAuth} />
      <PremiumHero scrollToAuth={scrollToAuth} />
      <FeaturedProductsSection />
      <CategoriesSection />
      <WhyChooseUsSection />
      <CTASection />
      <PremiumFooter />
    </div>
  );
};

export default Index;

import { PremiumHero } from '@/components/landing/PremiumHero';
import { PremiumNavbar } from '@/components/landing/PremiumNavbar';
import { PremiumFooter } from '@/components/landing/PremiumFooter';
import { FeaturedProductsSection } from '@/components/landing/FeaturedProductsSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { WhyChooseUsSection } from '@/components/landing/WhyChooseUsSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-navy">
      <PremiumNavbar />
      <PremiumHero />
      <FeaturedProductsSection />
      <CategoriesSection />
      <WhyChooseUsSection />
      <CTASection />
      <PremiumFooter />
    </div>
  );
};

export default Index;

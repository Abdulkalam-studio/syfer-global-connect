import { motion } from 'framer-motion';
import { Globe, Shield, TrendingUp } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PremiumHeroProps {
  scrollToAuth?: () => void;
}

export const PremiumHero = ({ scrollToAuth }: PremiumHeroProps) => {
  const { user, isAdmin } = useAuthContext();
  const navigate = useNavigate();

  const features = [
    { icon: Globe, label: 'Global Reach' },
    { icon: Shield, label: 'Quality Assured' },
    { icon: TrendingUp, label: 'Competitive Pricing' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cream via-cream to-gray-100 pt-20">
      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Trusted Export Partner Since 2020</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              <span className="text-primary italic">Syfer Exports</span>
              <br />
              <span className="text-foreground">Global Trade from India</span>
            </h1>

            {/* Description */}
            <motion.p
              className="text-lg text-muted-foreground max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Connecting premium Indian products with global buyers. From authentic
              spices to handcrafted textiles, we bring India's finest exports to your
              doorstep with unmatched quality and reliability.
            </motion.p>

            {/* Features */}
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {features.map((feature, index) => (
                <div key={feature.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{feature.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            id="auth-section"
            className="lg:justify-self-end w-full max-w-md"
          >
            {user ? (
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-display font-bold text-foreground">Welcome Back!</h3>
                  <p className="text-muted-foreground">You're already logged in.</p>
                  <button
                    onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
                <AuthForm />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { AuthModal } from '@/components/auth/AuthModal';
import { ChevronDown, Globe, Shield, TrendingUp } from 'lucide-react';

export const HeroSection = () => {
  const features = [
    { icon: Globe, label: 'Global Reach' },
    { icon: Shield, label: 'Quality Assured' },
    { icon: TrendingUp, label: 'Competitive Pricing' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle background: soft gradient + faint grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 via-background to-background" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-border mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="text-xs tracking-wide uppercase text-primary font-semibold">Trusted Export Partner · Since 2020</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6"
            >
              Premium Indian Exports,
              <br />
              <span className="italic font-normal text-secondary">delivered worldwide.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              A trusted sourcing partner for buyers in the UK, UAE and beyond. From authentic spices
              to handcrafted textiles — quality assured, fully documented, and shipped on time.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 divide-x divide-border rounded-lg bg-card border border-border shadow-sm overflow-hidden"
            >
              {[
                { value: '50+', label: 'Countries' },
                { value: '500+', label: 'Products' },
                { value: '1000+', label: 'Shipments' },
              ].map((stat) => (
                <div key={stat.label} className="text-center py-4 px-2">
                  <p className="font-display text-2xl lg:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Auth Modal */}
          <div id="auth-section" className="flex justify-center lg:justify-end">
            <AuthModal />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

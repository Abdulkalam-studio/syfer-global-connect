import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ParticleBackground } from './ParticleBackground';
import { AuthForm } from '@/components/auth/AuthForm';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export const PremiumHero = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy">
      <ParticleBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Premium Indian Exports</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-cream">SYFER</span>
              <span className="gold-text">EXPORTS</span>
            </h1>

            <motion.p
              className="text-xl md:text-2xl text-gold-light mb-4 font-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Global Trade from India
            </motion.p>

            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Connecting premium Indian products to global buyers. Experience seamless international trade 
              with quality assurance, competitive pricing, and reliable logistics.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                size="lg"
                className="premium-button text-lg px-8 py-6"
                onClick={() => setShowAuth(true)}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-border/50 hover:bg-accent/10"
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Products
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            {[
              { value: '500+', label: 'Products' },
              { value: '50+', label: 'Countries' },
              { value: '1000+', label: 'Happy Clients' },
              { value: '15+', label: 'Years Experience' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="glass-card p-6 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-3xl md:text-4xl font-bold gold-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Auth Dialog */}
      <Dialog open={showAuth} onOpenChange={setShowAuth}>
        <DialogContent className="sm:max-w-md">
          <VisuallyHidden>
            <DialogTitle>Authentication</DialogTitle>
          </VisuallyHidden>
          <button
            onClick={() => setShowAuth(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          <AuthForm onClose={() => setShowAuth(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

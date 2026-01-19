import { motion } from 'framer-motion';
import { Shield, Truck, Award, Clock, FileCheck, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Every product undergoes rigorous quality checks to meet international standards.',
  },
  {
    icon: Truck,
    title: 'Free Export Charges',
    description: 'No export charges from our side. Transparent pricing with no hidden fees.',
  },
  {
    icon: Award,
    title: 'Certified Products',
    description: 'All products come with necessary certifications and documentation.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'Committed to on-time delivery with real-time tracking for all shipments.',
  },
  {
    icon: FileCheck,
    title: 'Complete Documentation',
    description: 'Full export documentation including COO, quality certificates, and more.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: '24/7 customer support to assist you throughout the export process.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Commitment
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Why <span className="gold-text">Choose Us</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partner with Syfer Exports for a seamless, reliable, and premium export experience.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card p-8 h-full card-hover">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

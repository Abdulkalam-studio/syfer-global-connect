import { motion } from 'framer-motion';
import { Shield, Globe, Truck, Award, HeadphonesIcon, FileCheck } from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Quality Assured',
    description: 'Every product undergoes rigorous quality checks to meet international standards.',
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global Reach',
    description: 'Exporting to 50+ countries with established logistics and distribution networks.',
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Reliable Logistics',
    description: 'Seamless shipping and documentation handled by our expert team.',
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Competitive Pricing',
    description: 'Direct sourcing from manufacturers ensures the best prices for buyers.',
  },
  {
    icon: <HeadphonesIcon className="h-8 w-8" />,
    title: 'Dedicated Support',
    description: '24/7 customer support to assist you throughout your buying journey.',
  },
  {
    icon: <FileCheck className="h-8 w-8" />,
    title: 'Complete Documentation',
    description: 'All export documentation, certifications, and compliance handled professionally.',
  },
];

export const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-navy-light">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-cream mb-4">
            Why Choose <span className="gold-text">SYFEREXPORTS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to making international trade simple, reliable, and profitable for our partners.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 group hover:border-primary/50 transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all mb-6">
                {feature.icon}
              </div>
              <h3 className="font-display font-semibold text-xl text-cream mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Wheat, Leaf, Shirt, Palette, UtensilsCrossed, 
  Briefcase, Gem, FlaskConical, Cog, MoreHorizontal 
} from 'lucide-react';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types';

const categoryIcons: Record<ProductCategory, React.ComponentType<any>> = {
  'Agricultural Products': Wheat,
  'Spices & Herbs': Leaf,
  'Textiles & Fabrics': Shirt,
  'Handicrafts & Decor': Palette,
  'Food Products': UtensilsCrossed,
  'Leather Goods': Briefcase,
  'Gems & Jewelry': Gem,
  'Chemicals & Pharmaceuticals': FlaskConical,
  'Machinery & Equipment': Cog,
  'Other': MoreHorizontal,
};

export const CategoriesSection = () => {
  return (
    <section className="py-20 lg:py-32">
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
            Wide Range
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Export <span className="gold-text">Categories</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We source and export a diverse range of premium Indian products across multiple categories.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PRODUCT_CATEGORIES.map((category, index) => {
            const Icon = categoryIcons[category];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="group block"
                >
                  <div className="glass-card p-6 text-center card-hover h-full">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {category}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

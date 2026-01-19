import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Award, Globe, Shield, Users, Target, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'Every product undergoes rigorous quality checks to meet international standards.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Serving buyers across 50+ countries with reliable logistics and documentation.',
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Dedicated support and personalized service for every client.',
    },
    {
      icon: Target,
      title: 'Competitive Pricing',
      description: 'Direct sourcing from manufacturers ensures the best prices.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Your Trusted <span className="gold-text">Export Partner</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Syfer Exports is a leading Indian export company specializing in connecting 
                premium Indian products with global buyers. With years of experience and a 
                commitment to quality, we have established ourselves as a reliable partner 
                for international trade.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our <span className="gold-text">Story</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded with a vision to showcase India's finest products to the world, 
                    Syfer Exports has grown to become a trusted name in the export industry. 
                    We specialize in sourcing premium quality products directly from 
                    manufacturers across India.
                  </p>
                  <p>
                    Our extensive network spans agricultural products, spices, textiles, 
                    handicrafts, leather goods, and more. We work closely with artisans, 
                    farmers, and manufacturers to ensure that every product meets the 
                    highest standards of quality.
                  </p>
                  <p>
                    With a strong commitment to customer satisfaction, we handle everything 
                    from sourcing and quality control to documentation and logistics. Our 
                    team of experienced professionals ensures a seamless export experience 
                    for our clients worldwide.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { value: '50+', label: 'Countries Served' },
                  { value: '500+', label: 'Products' },
                  { value: '1000+', label: 'Shipments' },
                  { value: '100%', label: 'Quality Assured' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-6 text-center"
                  >
                    <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our <span className="gold-text">Values</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 text-center card-hover"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="glass-card p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    Quality & Compliance
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At Syfer Exports, we understand that international trade requires strict 
                    adherence to quality standards and regulatory compliance. Our dedicated 
                    quality control team ensures that every product meets international 
                    standards before shipment.
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>ISO-certified quality management processes</li>
                    <li>Complete export documentation (COO, phytosanitary certificates, etc.)</li>
                    <li>Compliance with international trade regulations</li>
                    <li>Rigorous pre-shipment inspection</li>
                    <li>Transparent pricing with no hidden charges</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

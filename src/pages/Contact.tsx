import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, MessageCircle, MapPin, Send, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDataStore } from '@/store/dataStore';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/lib/validation';

const Contact = () => {
  const { addContact } = useDataStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    addContact({
      id: generateId('contact'),
      ...form,
      createdAt: new Date(),
    });

    toast({
      title: 'Message Sent!',
      description: 'Thank you for reaching out. We will get back to you soon.',
    });

    setForm({ name: '', email: '', country: '', message: '' });
    setIsLoading(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'dinesh67love@gmail.com',
      href: 'mailto:dinesh67love@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone / WhatsApp',
      value: '+91 87540 63526',
      href: 'https://wa.me/918754063526',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Dinesh - Exporter (India)',
      href: 'https://www.linkedin.com/in/dinesh-undefined-b34a93309/',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'India',
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24">
        {/* Header */}
        <section className="py-16 lg:py-24 bg-card/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Get in Touch
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Contact <span className="gold-text">Us</span>
              </h1>
              <p className="text-muted-foreground">
                Have questions about our products or services? We're here to help. 
                Reach out to us and our team will respond promptly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="premium-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="premium-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="premium-input"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your requirements..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="premium-input min-h-[150px]"
                        required
                      />
                    </div>

                    <Button type="submit" variant="gold" size="lg" className="w-full gap-2" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="glass-card p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Contact Information
                  </h2>
                  
                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-primary transition-colors font-medium"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-foreground font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-card p-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Quick Contact
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://wa.me/918754063526"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="glass" className="w-full gap-2">
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                      </Button>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/dinesh-undefined-b34a93309/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button variant="glass" className="w-full gap-2">
                        <Linkedin className="w-5 h-5" />
                        LinkedIn
                      </Button>
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="glass-card p-8">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Response Time
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    We typically respond to all inquiries within 24 hours. 
                    For urgent matters, please contact us via WhatsApp for faster response.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

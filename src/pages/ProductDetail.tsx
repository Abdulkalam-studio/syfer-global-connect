import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Check, Package, CreditCard, Palette, 
  ChevronLeft, ChevronRight, Play, MessageCircle, Loader2 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useProductBySlug } from '@/hooks/useProducts';
import { useAuthStore } from '@/store/authStore';
import { RFQModal } from '@/components/products/RFQModal';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProductBySlug(slug);
  const { isAuthenticated } = useAuthStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showRFQModal, setShowRFQModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link to="/products">
            <Button variant="gold">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleRequestQuote = () => {
    if (!isAuthenticated) {
      navigate('/', { state: { scrollToAuth: true } });
      return;
    }
    setShowRFQModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 lg:pt-24">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden glass-card">
                <img
                  src={product.images[currentImageIndex] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary' : 'border-border/50 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Video */}
              {product.video_url && (
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 text-primary hover:underline"
                >
                  <Play className="w-5 h-5" />
                  Watch Product Video
                </a>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {product.category}
              </span>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                {product.full_description}
              </p>

              {/* Key Highlight */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-lg font-semibold text-green-500">{product.export_highlight}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  No export charges from our side. We handle all documentation and logistics.
                </p>
              </div>

              {/* MOQ */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Order Quantity</p>
                  <p className="text-xl font-bold text-foreground">{product.moq.toLocaleString()} pieces</p>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Payment Terms</h3>
                </div>
                <ul className="space-y-2">
                  {product.payment_terms.map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customization */}
              <div className="mb-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Customization Available</h3>
                </div>
                <p className="text-sm text-muted-foreground">{product.customization_note}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="gold" size="lg" className="flex-1" onClick={handleRequestQuote}>
                  Request Quotation
                </Button>
                <a
                  href="https://wa.me/918754063526"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="glass" size="lg" className="w-full gap-2">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Inquiry
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      {/* RFQ Modal */}
      <RFQModal
        isOpen={showRFQModal}
        onClose={() => setShowRFQModal(false)}
        product={product}
      />
    </div>
  );
};

export default ProductDetail;

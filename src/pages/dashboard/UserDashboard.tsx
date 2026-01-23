import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Clock, ArrowRight, Package, Loader2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { useRFQs } from '@/hooks/useRFQs';
import { formatDate } from '@/lib/validation';

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const { products, isLoading: productsLoading } = useProducts();
  const { rfqs, isLoading: rfqsLoading } = useRFQs();

  const userRFQs = rfqs.filter((r) => r.user_id === user?.id);
  const pendingRFQs = userRFQs.filter((r) => r.status !== 'Closed');
  const lastRFQ = userRFQs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  if (productsLoading || rfqsLoading) {
    return (
      <UserDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
      </UserDashboardLayout>
    );
  }

  return (
    <UserDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome, <span className="gold-text">{profile?.username || user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            User ID: <span className="text-primary font-mono">{profile?.user_code || 'N/A'}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userRFQs.length}</p>
                <p className="text-sm text-muted-foreground">Total RFQs</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{pendingRFQs.length}</p>
                <p className="text-sm text-muted-foreground">Open RFQs</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {lastRFQ ? formatDate(new Date(lastRFQ.created_at)) : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Last RFQ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">Featured Products</h2>
            <Link to="/dashboard/products">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/products/${product.slug}`}>
                <div className="glass-card overflow-hidden card-hover group">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={product.images?.[0] || '/placeholder.svg'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary">{product.category}</p>
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </UserDashboardLayout>
  );
};

export default UserDashboard;
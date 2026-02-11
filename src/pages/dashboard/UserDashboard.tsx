import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Clock, ArrowRight, Package } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useUserRFQs } from '@/hooks/useRFQs';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { formatDate } from '@/lib/validation';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { data: rfqs = [] } = useUserRFQs(user?.id);
  const { data: featuredProducts = [] } = useFeaturedProducts();

  const pendingRFQs = rfqs.filter((r: any) => r.status !== 'Closed');
  const lastRFQ = rfqs[0]; // Already ordered by created_at desc

  return (
    <UserDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome, <span className="gold-text">{user?.username}</span>
          </h1>
          <p className="text-muted-foreground">
            User ID: <span className="text-primary font-mono">{user?.userCode}</span>
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
                <p className="text-2xl font-bold text-foreground">{rfqs.length}</p>
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
            <Link to="/products">
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
                    <img src={product.images[0] || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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

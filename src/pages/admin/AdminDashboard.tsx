import { motion } from 'framer-motion';
import { Users, Package, FileText, MessageSquare } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { useDataStore } from '@/store/dataStore';

const AdminDashboard = () => {
  const { users, products, rfqs, contacts } = useDataStore();

  const stats = [
    { icon: Users, label: 'Total Users', value: users.length, color: 'text-blue-500 bg-blue-500/10' },
    { icon: Package, label: 'Products', value: products.length, color: 'text-green-500 bg-green-500/10' },
    { icon: FileText, label: 'RFQs', value: rfqs.length, color: 'text-primary bg-primary/10' },
    { icon: MessageSquare, label: 'Contact Inquiries', value: contacts.length, color: 'text-purple-500 bg-purple-500/10' },
  ];

  return (
    <AdminDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Admin Overview</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Recent RFQs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rfqs.slice(0, 5).map((rfq) => {
                  const user = users.find((u) => u.id === rfq.userId);
                  const product = products.find((p) => p.id === rfq.productId);
                  return (
                    <tr key={rfq.id} className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">{new Date(rfq.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-foreground">{user?.username || 'Unknown'}</td>
                      <td className="py-3 px-4 text-foreground">{product?.name || 'Unknown'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rfq.status === 'Pending' ? 'status-pending' :
                          rfq.status === 'In Discussion' ? 'status-discussion' : 'status-closed'
                        }`}>{rfq.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;

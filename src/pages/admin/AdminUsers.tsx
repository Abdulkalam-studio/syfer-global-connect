import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, FileText, MapPin, Building, Mail, Phone } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataStore } from '@/store/dataStore';
import { formatDate } from '@/lib/validation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminUsers = () => {
  const { users, rfqs, products } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const selectedUserRFQs = rfqs
    .filter((r) => r.userId === selectedUser)
    .map((rfq) => ({
      ...rfq,
      product: products.find((p) => p.id === rfq.productId),
    }));

  return (
    <AdminDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">User Management</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {users.length} Total Users
          </div>
        </div>

        {/* Search */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email, or company..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Username</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Phone</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Company</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Location</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Created</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-bold text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-foreground font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-foreground">{user.email}</td>
                    <td className="py-4 px-6 text-foreground">{user.phone}</td>
                    <td className="py-4 px-6 text-foreground">{user.companyName || 'N/A'}</td>
                    <td className="py-4 px-6 text-foreground">
                      {user.location
                        ? `${user.location.city}, ${user.location.country}`
                        : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-primary">{user.userCode}</span>
                    </td>
                    <td className="py-4 px-6 text-foreground">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-6">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUser(user.id)}
                        className="gap-2"
                      >
                        <Eye className="w-4 h-4" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">User Details</DialogTitle>
          </DialogHeader>
          {selectedUserData && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedUserData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-foreground">{selectedUserData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Company</p>
                    <p className="text-foreground">{selectedUserData.companyName || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-foreground">
                      {selectedUserData.location
                        ? `${selectedUserData.location.city}, ${selectedUserData.location.state}, ${selectedUserData.location.country}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User RFQs */}
              <div>
                <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> RFQ History
                </h4>
                {selectedUserRFQs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No RFQs submitted yet.</p>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-2 px-3 text-muted-foreground">Date</th>
                          <th className="text-left py-2 px-3 text-muted-foreground">Product</th>
                          <th className="text-left py-2 px-3 text-muted-foreground">Qty</th>
                          <th className="text-left py-2 px-3 text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedUserRFQs.map((rfq) => (
                          <tr key={rfq.id} className="border-t border-border">
                            <td className="py-2 px-3 text-foreground">{formatDate(rfq.createdAt)}</td>
                            <td className="py-2 px-3 text-foreground">{rfq.product?.name || 'Unknown'}</td>
                            <td className="py-2 px-3 text-foreground">{rfq.quantity.toLocaleString()}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  rfq.status === 'Pending'
                                    ? 'status-pending'
                                    : rfq.status === 'In Discussion'
                                    ? 'status-discussion'
                                    : 'status-closed'
                                }`}
                              >
                                {rfq.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminUsers;

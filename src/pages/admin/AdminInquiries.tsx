import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDataStore } from '@/store/dataStore';
import { formatDate } from '@/lib/validation';
import { RFQStatus } from '@/types';
import { RFQChat } from '@/components/chat/RFQChat';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const AdminInquiries = () => {
  const { rfqs, users, products, updateRFQ } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [chatRFQ, setChatRFQ] = useState<string | null>(null);

  const enrichedRFQs = rfqs.map((rfq) => ({
    ...rfq,
    user: users.find((u) => u.id === rfq.userId),
    product: products.find((p) => p.id === rfq.productId),
  }));

  const filteredRFQs = enrichedRFQs.filter((rfq) => {
    const matchesSearch =
      rfq.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfq.product?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rfq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (rfqId: string, newStatus: RFQStatus) => {
    updateRFQ(rfqId, { status: newStatus });
    toast.success(`Status updated to ${newStatus}`);
  };

  const selectedRFQData = enrichedRFQs.find((r) => r.id === selectedRFQ);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Discussion': return 'status-discussion';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  return (
    <AdminDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Buyer Inquiries</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            {rfqs.length} Total Inquiries
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer name, email, or product..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Discussion">In Discussion</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {rfqs.filter((r) => r.status === 'Pending').length}
            </p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {rfqs.filter((r) => r.status === 'In Discussion').length}
            </p>
            <p className="text-sm text-muted-foreground">In Discussion</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {rfqs.filter((r) => r.status === 'Closed').length}
            </p>
            <p className="text-sm text-muted-foreground">Closed</p>
          </div>
        </div>

        {/* RFQs Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Buyer</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Country</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Product</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-4 px-6 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRFQs.map((rfq, index) => (
                  <>
                    <tr
                      key={rfq.id}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                      }`}
                    >
                      <td className="py-4 px-6 text-foreground">{formatDate(rfq.createdAt)}</td>
                      <td className="py-4 px-6 text-foreground font-medium">{rfq.user?.username || 'Unknown'}</td>
                      <td className="py-4 px-6 text-foreground">{rfq.user?.email || 'N/A'}</td>
                      <td className="py-4 px-6 text-foreground">{rfq.country}</td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-foreground">{rfq.product?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">Qty: {rfq.quantity.toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Select
                          value={rfq.status}
                          onValueChange={(value) => handleStatusChange(rfq.id, value as RFQStatus)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(rfq.status)}`}>
                              {rfq.status}
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Discussion">In Discussion</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedRFQ(rfq.id)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={chatRFQ === rfq.id ? 'gold' : 'ghost'}
                            onClick={() => setChatRFQ(chatRFQ === rfq.id ? null : rfq.id)}
                            className="gap-1"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {chatRFQ === rfq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {chatRFQ === rfq.id && (
                      <tr key={`${rfq.id}-chat`}>
                        <td colSpan={7} className="p-0">
                          <div className="p-6 bg-muted/30 border-b border-border">
                            <RFQChat rfqId={rfq.id} userRole="admin" />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRFQs.length === 0 && (
          <div className="glass-card p-12 text-center mt-6">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Inquiries Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </motion.div>

      {/* RFQ Details Modal */}
      <Dialog open={!!selectedRFQ} onOpenChange={() => setSelectedRFQ(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">RFQ Details</DialogTitle>
          </DialogHeader>
          {selectedRFQData && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Buyer</p>
                  <p className="text-foreground font-medium">{selectedRFQData.user?.username}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedRFQData.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="text-foreground font-medium">{selectedRFQData.product?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="text-foreground">{selectedRFQData.quantity.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Price</p>
                  <p className="text-foreground">{selectedRFQData.targetPrice || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-foreground">{selectedRFQData.country}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground">{selectedRFQData.message}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default AdminInquiries;

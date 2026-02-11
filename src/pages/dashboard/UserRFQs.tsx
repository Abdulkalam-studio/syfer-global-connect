import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageSquare, Calendar, ChevronDown, ChevronUp, ArrowUpDown, Loader2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useUserRFQs } from '@/hooks/useRFQs';
import { formatDate } from '@/lib/validation';
import { RFQChat } from '@/components/chat/RFQChat';

const UserRFQs = () => {
  const { user } = useAuthStore();
  const { data: rawRFQs = [], isLoading } = useUserRFQs(user?.id);
  const [selectedRFQ, setSelectedRFQ] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'created_at' | 'status'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const userRFQs = [...rawRFQs].sort((a: any, b: any) => {
    if (sortField === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const statusOrder: Record<string, number> = { 'Pending': 1, 'In Discussion': 2, 'Closed': 3 };
      const orderA = statusOrder[a.status] || 0;
      const orderB = statusOrder[b.status] || 0;
      return sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
    }
  });

  const toggleSort = (field: 'created_at' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Discussion': return 'status-discussion';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  return (
    <UserDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">My RFQ History</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            {userRFQs.length} Total Requests
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : userRFQs.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No RFQs Yet</h3>
            <p className="text-muted-foreground">Browse products and submit your first quotation request.</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th 
                      className="text-left py-4 px-6 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort('created_at')}
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Date
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Product</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Quantity</th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Target Price</th>
                    <th 
                      className="text-left py-4 px-6 text-muted-foreground font-medium cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort('status')}
                    >
                      <span className="flex items-center gap-2">
                        Status
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    </th>
                    <th className="text-left py-4 px-6 text-muted-foreground font-medium">Chat</th>
                  </tr>
                </thead>
                <tbody>
                  {userRFQs.map((rfq: any, index: number) => (
                    <>
                      <tr 
                        key={rfq.id} 
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                      >
                        <td className="py-4 px-6 text-foreground">{formatDate(new Date(rfq.created_at))}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-foreground font-medium">{rfq.products?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{rfq.products?.category}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-foreground">{rfq.quantity.toLocaleString()}</td>
                        <td className="py-4 px-6 text-foreground">{rfq.target_price || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(rfq.status)}`}>
                            {rfq.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            size="sm"
                            variant={selectedRFQ === rfq.id ? 'gold' : 'ghost'}
                            onClick={() => setSelectedRFQ(selectedRFQ === rfq.id ? null : rfq.id)}
                            className="gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            {selectedRFQ === rfq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </td>
                      </tr>
                      {selectedRFQ === rfq.id && (
                        <tr key={`${rfq.id}-chat`}>
                          <td colSpan={6} className="p-0">
                            <div className="p-6 bg-muted/30 border-b border-border">
                              <RFQChat rfqId={rfq.id} userRole="user" />
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
        )}
      </motion.div>
    </UserDashboardLayout>
  );
};

export default UserRFQs;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, FileText, MapPin, Building, Mail, Phone, Trash2, Loader2 } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/validation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone: string;
  company_name: string | null;
  country: string;
  state: string;
  city: string;
  user_code: string;
  created_at: string;
}

interface RFQWithProduct {
  id: string;
  quantity: number;
  status: string;
  created_at: string;
  product: {
    name: string;
  } | null;
}

const AdminUsers = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [rfqs, setRfqs] = useState<RFQWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch profiles from Supabase
  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch RFQs for selected user
  const fetchUserRFQs = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select(`
          id,
          quantity,
          status,
          created_at,
          product:products(name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRfqs(data || []);
    } catch (error) {
      console.error('Error fetching RFQs:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserRFQs(selectedUser);
    }
  }, [selectedUser]);

  const filteredUsers = profiles.filter(
    (profile) =>
      profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserData = profiles.find((p) => p.user_id === selectedUser);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to delete users');
        return;
      }

      const response = await supabase.functions.invoke('delete-user', {
        body: { userId: userToDelete.user_id }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete user');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success(`User "${userToDelete.username}" has been deleted`);
      setUserToDelete(null);
      fetchProfiles(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">User Management</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {profiles.length} Total Users
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((profile, index) => (
                      <tr
                        key={profile.id}
                        className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold text-sm">
                                {profile.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-foreground font-medium">{profile.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-foreground">{profile.email}</td>
                        <td className="py-4 px-6 text-foreground">{profile.phone}</td>
                        <td className="py-4 px-6 text-foreground">{profile.company_name || 'N/A'}</td>
                        <td className="py-4 px-6 text-foreground">
                          {profile.city && profile.country
                            ? `${profile.city}, ${profile.country}`
                            : 'N/A'}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-primary">{profile.user_code}</span>
                        </td>
                        <td className="py-4 px-6 text-foreground">{formatDate(new Date(profile.created_at))}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedUser(profile.user_id)}
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" /> View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setUserToDelete(profile)}
                              className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
                    <p className="text-foreground">{selectedUserData.company_name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-foreground">
                      {selectedUserData.city && selectedUserData.state && selectedUserData.country
                        ? `${selectedUserData.city}, ${selectedUserData.state}, ${selectedUserData.country}`
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
                {rfqs.length === 0 ? (
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
                        {rfqs.map((rfq) => (
                          <tr key={rfq.id} className="border-t border-border">
                            <td className="py-2 px-3 text-foreground">{formatDate(new Date(rfq.created_at))}</td>
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

              {/* Delete Button in Modal */}
              <div className="pt-4 border-t border-border">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserToDelete(selectedUserData);
                  }}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => !isDeleting && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.username}</strong> ({userToDelete?.email})?
              <br /><br />
              This action will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>User account and profile</li>
                <li>All RFQs submitted by this user</li>
                <li>All chat messages from this user</li>
                <li>All associated tokens and session data</li>
              </ul>
              <br />
              <strong className="text-destructive">This action cannot be undone.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
};

export default AdminUsers;

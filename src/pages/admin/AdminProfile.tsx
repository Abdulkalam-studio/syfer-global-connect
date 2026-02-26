import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Clock, Save, KeyRound } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/validation';

const AdminProfile = () => {
  const { user } = useAuthStore();
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateEmail = async () => {
    if (newEmail && newEmail !== user?.email) {
      setIsUpdatingEmail(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Email update requested. Check your new email for confirmation.');
      }
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsUpdatingPassword(false);
  };

  return (
    <AdminDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Admin Profile</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{user?.username || 'Administrator'}</h2>
            <p className="text-sm text-primary mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
              <Shield className="w-4 h-4" /> Admin Access
            </div>
          </div>

          {/* Session Info */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Account Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Username</p>
                <p className="text-foreground font-medium">{user?.username}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">User Code</p>
                <p className="text-foreground font-medium font-mono">{user?.userCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Change Email */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" /> Change Email
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Email</Label>
                <p className="text-muted-foreground py-2">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>
              <Button onClick={handleUpdateEmail} variant="gold" className="gap-2" disabled={isUpdatingEmail}>
                <Save className="w-4 h-4" /> Update Email
              </Button>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" /> Change Password
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button onClick={handleUpdatePassword} variant="gold" className="gap-2" disabled={isUpdatingPassword}>
                <Save className="w-4 h-4" /> Update Password
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AdminDashboardLayout>
  );
};

export default AdminProfile;

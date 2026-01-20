import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Clock, Save, KeyRound } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/dashboard/AdminDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { validatePassword } from '@/lib/validation';

const AdminProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateEmail = () => {
    if (newEmail && newEmail !== user?.email) {
      updateUser({ email: newEmail });
      toast.success('Email updated successfully!');
    }
  };

  const handleUpdatePassword = () => {
    if (currentPassword !== '123qwe') {
      toast.error('Current password is incorrect');
      return;
    }
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.message);
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Mock session data
  const lastLogin = new Date();
  const lastLogout = new Date(Date.now() - 86400000);

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
            <h2 className="text-xl font-bold text-foreground mb-1">Administrator</h2>
            <p className="text-sm text-primary mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
              <Shield className="w-4 h-4" /> Admin Access
            </div>
          </div>

          {/* Session Info */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Session Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Last Login</p>
                <p className="text-foreground font-medium">
                  {lastLogin.toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Previous Logout</p>
                <p className="text-foreground font-medium">
                  {lastLogout.toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
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
              <Button onClick={handleUpdateEmail} variant="gold" className="gap-2">
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
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
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
              <Button onClick={handleUpdatePassword} variant="gold" className="gap-2">
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, MapPin, Save, Edit2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    country: user?.location?.country || '',
    state: user?.location?.state || '',
    city: user?.location?.city || '',
  });

  const handleSave = () => {
    updateUser({
      username: formData.username,
      phone: formData.phone,
      companyName: formData.companyName,
      location: {
        country: formData.country,
        state: formData.state,
        city: formData.city,
      },
    });
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <UserDashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="goldOutline" className="gap-2">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-1">{user?.username}</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {user?.userCode}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${user?.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {user?.emailVerified ? 'Verified' : 'Pending Verification'}
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-display text-lg font-bold text-foreground mb-6">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" /> Username
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2">{user?.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" /> Email
                </Label>
                <p className="text-foreground py-2">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" /> Phone
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2">{user?.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" /> Company
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2">{user?.companyName || 'N/A'}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" /> Location
                </Label>
                {isEditing ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    <Input
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                ) : (
                  <p className="text-foreground py-2">
                    {user?.location ? `${user.location.city}, ${user.location.state}, ${user.location.country}` : 'N/A'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-8">
                <Button onClick={handleSave} variant="gold" className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </UserDashboardLayout>
  );
};

export default UserProfile;

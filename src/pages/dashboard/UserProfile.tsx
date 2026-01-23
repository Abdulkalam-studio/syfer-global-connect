import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, MapPin, Save, Edit2, Loader2 } from 'lucide-react';
import { UserDashboardLayout } from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    company_name: '',
    country: '',
    state: '',
    city: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
        country: profile.country || '',
        state: profile.state || '',
        city: profile.city || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile({
      username: formData.username,
      phone: formData.phone,
      company_name: formData.company_name,
      country: formData.country,
      state: formData.state,
      city: formData.city,
    });

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  if (isLoading) {
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
            <h2 className="text-xl font-bold text-foreground mb-1">{profile?.username || user?.email?.split('@')[0]}</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {profile?.user_code || 'N/A'}</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${profile?.email_verified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {profile?.email_verified ? 'Verified' : 'Pending Verification'}
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
                  <p className="text-foreground py-2">{profile?.username}</p>
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
                  <p className="text-foreground py-2">{profile?.phone || 'N/A'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" /> Company
                </Label>
                {isEditing ? (
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                ) : (
                  <p className="text-foreground py-2">{profile?.company_name || 'N/A'}</p>
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
                    {profile?.city || profile?.state || profile?.country 
                      ? `${profile.city || ''}, ${profile.state || ''}, ${profile.country || ''}`.replace(/^, |, $|, ,/g, '') 
                      : 'N/A'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 mt-8">
                <Button onClick={handleSave} variant="gold" className="gap-2" disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" disabled={isSaving}>
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
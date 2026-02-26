import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore, checkIsAdmin } from '@/store/authStore';
import { useDataStore } from '@/store/dataStore';
import { validatePassword, validateEmail, validatePhone, generateUserCode, generateId } from '@/lib/validation';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type AuthTab = 'login' | 'register';

export const AuthModal = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const { users, addUser } = useDataStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    companyName: '',
    country: '',
    state: '',
    city: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check admin credentials
    const isAdmin = checkIsAdmin(loginForm.email, loginForm.password);
    
    if (isAdmin) {
      const adminUser = {
        id: 'admin',
        username: 'Admin',
        email: loginForm.email,
        phone: '',
        companyName: 'Syfer Exports',
        location: { country: 'India', state: '', city: '' },
        userCode: '00',
        emailVerified: true,
        isAdmin: true,
        createdAt: new Date(),
      };
      login(adminUser);
      toast({
        title: 'Welcome back, Admin!',
        description: 'Redirecting to admin dashboard...',
      });
      setIsLoading(false);
      navigate('/admin');
      return;
    }

    // Check regular user
    const user = users.find((u) => u.email === loginForm.email);
    if (user) {
      // In real app, verify password hash
      login(user);
      toast({
        title: `Welcome back, ${user.username}!`,
        description: 'Redirecting to your dashboard...',
      });
      setIsLoading(false);
      navigate('/dashboard');
      return;
    }

    toast({
      title: 'Login failed',
      description: 'Invalid email or password. Please try again.',
      variant: 'destructive',
    });
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate
    if (!validateEmail(registerForm.email)) {
      toast({ title: 'Invalid email format', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(registerForm.password);
    if (!passwordValidation.valid) {
      toast({ title: passwordValidation.message, variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    if (!validatePhone(registerForm.phone)) {
      toast({ title: 'Invalid phone number', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Check if email exists
    if (users.find((u) => u.email === registerForm.email)) {
      toast({ title: 'Email already registered', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser = {
      id: generateId('user'),
      username: registerForm.username,
      email: registerForm.email,
      phone: registerForm.phone,
      companyName: registerForm.companyName || undefined,
      location: {
        country: registerForm.country,
        state: registerForm.state,
        city: registerForm.city,
      },
      userCode: generateUserCode(),
      emailVerified: false,
      isAdmin: false,
      createdAt: new Date(),
    };

    addUser(newUser);
    login(newUser);
    
    toast({
      title: 'Registration successful!',
      description: 'Welcome to Syfer Exports. Please verify your email.',
    });
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="glass-card p-8">
        {/* Tabs */}
        <div className="flex mb-8 bg-muted rounded-lg p-1">
          {(['login', 'register'] as AuthTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-300',
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {activeTab === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10 premium-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="pl-10 pr-10 premium-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </a>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="JohnTrader"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      className="pl-10 premium-input"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+1-555-0123"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      className="pl-10 premium-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="pl-10 premium-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Company Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Your Company LLC"
                    value={registerForm.companyName}
                    onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                    className="pl-10 premium-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label className="text-foreground text-xs">Country *</Label>
                  <Input
                    placeholder="USA"
                    value={registerForm.country}
                    onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })}
                    className="premium-input text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs">State *</Label>
                  <Input
                    placeholder="California"
                    value={registerForm.state}
                    onChange={(e) => setRegisterForm({ ...registerForm, state: e.target.value })}
                    className="premium-input text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground text-xs">City *</Label>
                  <Input
                    placeholder="Los Angeles"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    className="premium-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-foreground">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 upper, 1 lower, 1 number, 1 symbol"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="pl-10 pr-10 premium-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol
                </p>
              </div>

              <Button type="submit" variant="gold" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

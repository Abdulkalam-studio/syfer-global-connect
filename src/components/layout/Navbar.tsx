import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  const isLandingPage = location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled || !isLandingPage
          ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <img 
                src={logo} 
                alt="Syfer Exports" 
                className="h-10 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary leading-tight">Syfer Exports</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Global Trade from India</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'nav-link text-sm font-medium',
                  location.pathname === link.href && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link to={user.isAdmin ? '/admin' : '/dashboard'}>
                  <Button variant="glass" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  if (isLandingPage) {
                    document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/', { state: { scrollToAuth: true } });
                  }
                }}
              >
                Login / Register
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card/95 backdrop-blur-xl rounded-b-xl border-b border-border/50 overflow-hidden"
            >
              <div className="py-4 px-2 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      location.pathname === link.href
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border/50">
                  {isAuthenticated && user ? (
                    <>
                      <Link
                        to={user.isAdmin ? '/admin' : '/dashboard'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Button
                      variant="gold"
                      className="w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (isLandingPage) {
                          document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          navigate('/', { state: { scrollToAuth: true } });
                        }
                      }}
                    >
                      Login / Register
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

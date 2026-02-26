import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { login, logout, setLoading } = useAuthStore();

  useEffect(() => {
    setLoading(true);

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Defer Supabase calls to avoid deadlock
          setTimeout(async () => {
            try {
              const userId = session.user.id;

              const [profileRes, roleRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('user_id', userId).single(),
                supabase.from('user_roles').select('role').eq('user_id', userId).single(),
              ]);

              if (profileRes.data) {
                const p = profileRes.data;
                const isAdmin = roleRes.data?.role === 'admin';
                login({
                  id: p.user_id,
                  username: p.username,
                  email: p.email,
                  phone: p.phone,
                  companyName: p.company_name || undefined,
                  location: {
                    country: p.country,
                    state: p.state,
                    city: p.city,
                  },
                  userCode: p.user_code,
                  emailVerified: p.email_verified,
                  isAdmin,
                  createdAt: new Date(p.created_at),
                });
              } else {
                setLoading(false);
              }
            } catch {
              setLoading(false);
            }
          }, 0);
        } else {
          logout();
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setLoading(false);
      }
      // If session exists, onAuthStateChange will handle it
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

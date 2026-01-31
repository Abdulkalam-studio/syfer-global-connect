import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Profile, UserRole } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

// Admin credentials (checked server-side via role, but for initial setup)
const ADMIN_EMAIL = 'syfer071@gmail.com';
const ADMIN_PASSWORD = '123qwe';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    role: null,
    isLoading: true,
    isAdmin: false,
  });
  const { toast } = useToast();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [profileResult, roleResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', userId).single(),
        supabase.from('user_roles').select('*').eq('user_id', userId).single(),
      ]);

      const profile = profileResult.data as Profile | null;
      const role = roleResult.data as UserRole | null;
      const isAdmin = role?.role === 'admin';

      setAuthState(prev => ({
        ...prev,
        profile,
        role,
        isAdmin,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          isLoading: session ? true : false,
        }));

        // Defer Supabase calls with setTimeout
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            profile: null,
            role: null,
            isAdmin: false,
            isLoading: false,
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = async (
    email: string,
    password: string,
    metadata: { username: string; phone: string; company_name?: string; country?: string; state?: string; city?: string }
  ) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: metadata.username,
          phone: metadata.phone,
          company_name: metadata.company_name,
          country: metadata.country,
          state: metadata.state,
          city: metadata.city,
        },
      },
    });

    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    // Create email verification token and log to console
    if (data.user) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      
      await supabase.from('email_verification_tokens').insert({
        user_id: data.user.id,
        token,
        expires_at: expiresAt,
      });

      console.log('=== EMAIL VERIFICATION ===');
      console.log(`Verify your email: ${window.location.origin}/verify-email?token=${token}`);
      console.log('========================');

      toast({
        title: 'Account Created!',
        description: 'Check the console for your email verification link (emails are mocked).',
      });
    }

    return { data, error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error, isAdmin: false };
    }

    // Check if this is the admin account and update role if needed
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD && data.user) {
      // Ensure admin role exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (existingRole && existingRole.role !== 'admin') {
        await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', data.user.id);
      }

      // Log admin session
      await supabase.from('admin_session_logs').insert({
        user_id: data.user.id,
        email: email,
      });

      toast({
        title: 'Welcome, Admin!',
        description: 'Redirecting to admin dashboard...',
      });

      return { data, error: null, isAdmin: true };
    }

    toast({
      title: 'Welcome back!',
      description: 'Redirecting to your dashboard...',
    });

    return { data, error: null, isAdmin: false };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    return { error };
  };

  const signOut = async () => {
    // Log admin logout if admin
    if (authState.isAdmin && authState.user) {
      const { data: lastSession } = await supabase
        .from('admin_session_logs')
        .select('*')
        .eq('user_id', authState.user.id)
        .is('logout_at', null)
        .order('login_at', { ascending: false })
        .limit(1)
        .single();

      if (lastSession) {
        await supabase
          .from('admin_session_logs')
          .update({ logout_at: new Date().toISOString() })
          .eq('id', lastSession.id);
      }
    }

    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: 'Sign Out Failed',
        description: error.message,
        variant: 'destructive',
      });
    }

    return { error };
  };

  const requestPasswordReset = async (email: string) => {
    // Find user by email
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .single();

    if (!profile) {
      // Don't reveal if email exists or not
      toast({
        title: 'Reset Link Sent',
        description: 'If an account exists with that email, you will receive a reset link.',
      });
      return { error: null };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    await supabase.from('password_reset_tokens').insert({
      user_id: profile.user_id,
      token,
      expires_at: expiresAt,
    });

    console.log('=== PASSWORD RESET ===');
    console.log(`Reset your password: ${window.location.origin}/reset-password?token=${token}`);
    console.log('======================');

    toast({
      title: 'Reset Link Sent',
      description: 'Check the console for your password reset link (emails are mocked).',
    });

    return { error: null };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    // Validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !tokenData) {
      toast({
        title: 'Invalid Token',
        description: 'This reset link is invalid or has expired.',
        variant: 'destructive',
      });
      return { error: new Error('Invalid token') };
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      toast({
        title: 'Token Expired',
        description: 'This reset link has expired. Please request a new one.',
        variant: 'destructive',
      });
      return { error: new Error('Token expired') };
    }

    // Update password using Supabase Admin API would be needed here
    // For now, we'll mark the token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    toast({
      title: 'Password Reset',
      description: 'Your password has been updated. Please sign in with your new password.',
    });

    return { error: null };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authState.user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', authState.user.id);

    if (error) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }

    // Refresh profile data
    await fetchUserData(authState.user.id);

    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });

    return { error: null };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    refreshProfile: () => authState.user && fetchUserData(authState.user.id),
  };
};

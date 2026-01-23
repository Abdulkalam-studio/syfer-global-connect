import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  username: string;
  phone: string | null;
  company_name: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  user_code: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchProfiles = async () => {
    if (!user || !isAdmin) {
      setProfiles([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data as Profile[]);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [user, isAdmin]);

  const getProfileById = async (id: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as Profile, error: null };
    } catch (err) {
      console.error('Error fetching profile:', err);
      return { data: null, error: err as Error };
    }
  };

  return {
    profiles,
    isLoading,
    error,
    getProfileById,
    refetch: fetchProfiles,
  };
};

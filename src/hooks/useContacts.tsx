import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface Contact {
  id: string;
  name: string;
  email: string;
  country: string | null;
  message: string;
  created_at: string;
}

export interface ContactInsert {
  name: string;
  email: string;
  country?: string;
  message: string;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchContacts = async () => {
    if (!user || !isAdmin) {
      setContacts([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data as Contact[]);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user, isAdmin]);

  const submitContact = async (contact: ContactInsert) => {
    try {
      const { data, error } = await (supabase as any)
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) throw error;
      toast.success('Message sent successfully!');
      return { data, error: null };
    } catch (err) {
      console.error('Error submitting contact:', err);
      toast.error('Failed to send message');
      return { data: null, error: err as Error };
    }
  };

  return {
    contacts,
    isLoading,
    error,
    submitContact,
    refetch: fetchContacts,
  };
};

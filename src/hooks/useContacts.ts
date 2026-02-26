import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type DbContact = Tables<'contacts'>;

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbContact[];
    },
  });
};

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: async (contact: { name: string; email: string; country: string; message: string }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type DbRFQ = Tables<'rfqs'>;

export const useUserRFQs = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['rfqs', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('rfqs')
        .select('*, products(name, category, slug, images)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useAllRFQs = () => {
  return useQuery({
    queryKey: ['rfqs', 'all'],
    queryFn: async () => {
      // Fetch RFQs with product info
      const { data: rfqData, error: rfqError } = await supabase
        .from('rfqs')
        .select('*, products(name, category, slug)')
        .order('created_at', { ascending: false });
      if (rfqError) throw rfqError;
      
      // Fetch all profiles to enrich RFQs
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, username, email, phone, company_name, country');
      if (profileError) throw profileError;
      
      // Merge profiles into RFQs
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      return (rfqData || []).map(rfq => ({
        ...rfq,
        profiles: profileMap.get(rfq.user_id) || null,
      }));
    },
  });
};

export const useCreateRFQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rfq: TablesInsert<'rfqs'>) => {
      const { data, error } = await supabase
        .from('rfqs')
        .insert(rfq)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast.success('RFQ submitted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit RFQ: ' + error.message);
    },
  });
};

export const useUpdateRFQ = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'rfqs'> }) => {
      const { data, error } = await supabase
        .from('rfqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast.success('RFQ status updated');
    },
    onError: (error) => {
      toast.error('Failed to update RFQ: ' + error.message);
    },
  });
};

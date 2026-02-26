import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type DbMessage = Tables<'messages'>;

export const useRFQMessages = (rfqId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', rfqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as DbMessage[];
    },
  });

  // Subscribe to realtime
  useEffect(() => {
    const channel = supabase
      .channel(`messages-${rfqId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `rfq_id=eq.${rfqId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', rfqId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rfqId, queryClient]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: TablesInsert<'messages'>) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['messages', data.rfq_id] });
    },
  });
};

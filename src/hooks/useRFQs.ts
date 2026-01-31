import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RFQ, RfqStatus, Message } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useRFQs = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get RFQs - filter by user if userId provided
  const rfqsQuery = useQuery({
    queryKey: ['rfqs', userId],
    queryFn: async () => {
      let query = supabase
        .from('rfqs')
        .select(`
          *,
          product:products(*)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as RFQ[];
    },
    enabled: true,
  });

  const createRFQ = useMutation({
    mutationFn: async (rfq: Omit<RFQ, 'id' | 'created_at' | 'updated_at' | 'product' | 'profile'>) => {
      const { data, error } = await supabase
        .from('rfqs')
        .insert(rfq)
        .select()
        .single();

      if (error) throw error;
      return data as RFQ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast({
        title: 'RFQ Submitted',
        description: 'Your request for quotation has been submitted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateRFQStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RfqStatus }) => {
      const { data, error } = await supabase
        .from('rfqs')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as RFQ;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] });
      toast({
        title: 'Status Updated',
        description: 'RFQ status has been updated successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    rfqs: rfqsQuery.data ?? [],
    isLoading: rfqsQuery.isLoading,
    error: rfqsQuery.error,
    createRFQ,
    updateRFQStatus,
    refetch: rfqsQuery.refetch,
  };
};

export const useRFQMessages = (rfqId: string | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const messagesQuery = useQuery({
    queryKey: ['messages', rfqId],
    queryFn: async () => {
      if (!rfqId) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!rfqId,
  });

  // Subscribe to real-time messages
  useEffect(() => {
    if (!rfqId) return;

    const channel = supabase
      .channel(`messages:${rfqId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `rfq_id=eq.${rfqId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['messages', rfqId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rfqId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (message: Omit<Message, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', rfqId] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    messages: messagesQuery.data ?? [],
    isLoading: messagesQuery.isLoading,
    error: messagesQuery.error,
    sendMessage,
    refetch: messagesQuery.refetch,
  };
};

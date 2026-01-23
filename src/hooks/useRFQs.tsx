import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export type RFQStatus = 'Pending' | 'In Discussion' | 'Closed';

export interface RFQ {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  target_price: string | null;
  country: string;
  message: string | null;
  status: RFQStatus;
  created_at: string;
}

export interface RFQInsert {
  product_id: string;
  quantity: number;
  target_price?: string;
  country: string;
  message?: string;
}

export const useRFQs = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchRFQs = async () => {
    if (!user) {
      setRfqs([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('rfqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRfqs(data as RFQ[]);
    } catch (err) {
      console.error('Error fetching RFQs:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, [user]);

  const addRFQ = async (rfq: RFQInsert) => {
    if (!user) {
      toast.error('You must be logged in to submit an RFQ');
      return { data: null, error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('rfqs')
        .insert([{ ...rfq, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setRfqs((prev) => [data as RFQ, ...prev]);
      toast.success('RFQ submitted successfully');
      return { data, error: null };
    } catch (err) {
      console.error('Error adding RFQ:', err);
      toast.error('Failed to submit RFQ');
      return { data: null, error: err as Error };
    }
  };

  const updateRFQStatus = async (id: string, status: RFQStatus) => {
    try {
      const { data, error } = await (supabase as any)
        .from('rfqs')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setRfqs((prev) =>
        prev.map((r) => (r.id === id ? (data as RFQ) : r))
      );
      toast.success('RFQ status updated');
      return { data, error: null };
    } catch (err) {
      console.error('Error updating RFQ:', err);
      toast.error('Failed to update RFQ status');
      return { data: null, error: err as Error };
    }
  };

  const getUserRFQs = () => {
    if (!user) return [];
    return rfqs.filter((r) => r.user_id === user.id);
  };

  return {
    rfqs,
    isLoading,
    error,
    addRFQ,
    updateRFQStatus,
    getUserRFQs,
    refetch: fetchRFQs,
  };
};

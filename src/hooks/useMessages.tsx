import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  rfq_id: string;
  sender_type: 'admin' | 'user';
  sender_id: string | null;
  text: string;
  created_at: string;
}

export interface MessageInsert {
  rfq_id: string;
  text: string;
}

export const useMessages = (rfqId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isAdmin } = useAuth();

  const fetchMessages = async () => {
    if (!rfqId || !user) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('messages')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [rfqId, user]);

  const sendMessage = async (text: string) => {
    if (!rfqId || !user) {
      toast.error('Unable to send message');
      return { data: null, error: new Error('Not authenticated or no RFQ selected') };
    }

    try {
      const messageData = {
        rfq_id: rfqId,
        text,
        sender_type: isAdmin ? 'admin' : 'user',
        sender_id: user.id,
      };

      const { data, error } = await (supabase as any)
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      setMessages((prev) => [...prev, data as Message]);
      return { data, error: null };
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
      return { data: null, error: err as Error };
    }
  };

  const getMessagesByRFQ = (rfqId: string) => {
    return messages.filter((m) => m.rfq_id === rfqId);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    getMessagesByRFQ,
    refetch: fetchMessages,
  };
};

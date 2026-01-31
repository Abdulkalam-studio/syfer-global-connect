import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile, AdminSessionLog, Contact } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const usersQuery = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });

  const updateUserStatus = useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ active })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'User Updated',
        description: 'User status has been updated successfully.',
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

  const exportUsersCSV = async () => {
    const users = usersQuery.data ?? [];
    
    const headers = ['id', 'username', 'email', 'phone', 'company_name', 'country', 'state', 'city', 'user_code', 'created_at', 'active'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => 
        headers.map(header => {
          const value = user[header as keyof Profile];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    updateUserStatus,
    exportUsersCSV,
    refetch: usersQuery.refetch,
  };
};

export const useAdminSessionLogs = () => {
  const sessionLogsQuery = useQuery({
    queryKey: ['admin', 'session-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_session_logs')
        .select('*')
        .order('login_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as AdminSessionLog[];
    },
  });

  return {
    sessionLogs: sessionLogsQuery.data ?? [],
    isLoading: sessionLogsQuery.isLoading,
    error: sessionLogsQuery.error,
  };
};

export const useAdminContacts = () => {
  const contactsQuery = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contact[];
    },
  });

  return {
    contacts: contactsQuery.data ?? [],
    isLoading: contactsQuery.isLoading,
    error: contactsQuery.error,
  };
};

export const useExportRFQsCSV = () => {
  const { toast } = useToast();

  const exportRFQsCSV = async () => {
    const { data: rfqs, error } = await supabase
      .from('rfqs')
      .select(`
        *,
        product:products(name),
        profile:profiles(username, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    const headers = ['id', 'buyer_name', 'buyer_email', 'country', 'product_name', 'quantity', 'target_price', 'status', 'created_at'];
    const csvContent = [
      headers.join(','),
      ...rfqs.map(rfq => [
        rfq.id,
        (rfq.profile as any)?.username ?? '',
        (rfq.profile as any)?.email ?? '',
        rfq.country,
        (rfq.product as any)?.name ?? '',
        rfq.quantity,
        rfq.target_price ?? '',
        rfq.status,
        rfq.created_at,
      ].map(val => typeof val === 'string' && val.includes(',') ? `"${val}"` : val).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rfqs_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Export Complete',
      description: 'RFQs have been exported successfully.',
    });
  };

  return { exportRFQsCSV };
};

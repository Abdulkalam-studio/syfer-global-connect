import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generateSlug } from '@/lib/validation';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type DbProduct = Tables<'products'>;

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as DbProduct[];
    },
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data as DbProduct[];
    },
  });
};

export const useProductBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'slug', slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data as DbProduct | null;
    },
    enabled: !!slug,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<TablesInsert<'products'>, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add product: ' + error.message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TablesUpdate<'products'> }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update product: ' + error.message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete product: ' + error.message);
    },
  });
};

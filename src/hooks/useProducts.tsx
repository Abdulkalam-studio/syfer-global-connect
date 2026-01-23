import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description: string | null;
  images: string[];
  video_url: string | null;
  featured: boolean;
  moq: number;
  export_highlight: string;
  payment_terms: string[];
  customization_note: string;
  created_at: string;
}

export interface ProductInsert {
  name: string;
  slug: string;
  category: string;
  short_description: string;
  full_description?: string | null;
  images?: string[];
  video_url?: string | null;
  featured?: boolean;
  moq?: number;
  export_highlight?: string;
  payment_terms?: string[];
  customization_note?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data as Product[]);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: ProductInsert) => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      setProducts((prev) => [data as Product, ...prev]);
      toast.success('Product added successfully');
      return { data, error: null };
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Failed to add product');
      return { data: null, error: err as Error };
    }
  };

  const updateProduct = async (id: string, updates: Partial<ProductInsert>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? (data as Product) : p))
      );
      toast.success('Product updated successfully');
      return { data, error: null };
    } catch (err) {
      console.error('Error updating product:', err);
      toast.error('Failed to update product');
      return { data: null, error: err as Error };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted successfully');
      return { error: null };
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Failed to delete product');
      return { error: err as Error };
    }
  };

  const getProductBySlug = async (slug: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return { data: data as Product, error: null };
    } catch (err) {
      console.error('Error fetching product:', err);
      return { data: null, error: err as Error };
    }
  };

  const getFeaturedProducts = () => {
    return products.filter((p) => p.featured);
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getFeaturedProducts,
    refetch: fetchProducts,
  };
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useCreateRFQ } from '@/hooks/useRFQs';
import { useToast } from '@/hooks/use-toast';
import type { DbProduct } from '@/hooks/useProducts';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DbProduct;
}

export const RFQModal = ({ isOpen, onClose, product }: RFQModalProps) => {
  const { user } = useAuthStore();
  const createRFQ = useCreateRFQ();
  const { toast } = useToast();
  
  const [form, setForm] = useState({
    quantity: '',
    targetPrice: '',
    country: user?.location.country || '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createRFQ.mutateAsync({
        user_id: user.id,
        product_id: product.id,
        quantity: parseInt(form.quantity),
        target_price: form.targetPrice || null,
        country: form.country,
        message: form.message,
      });

      toast({
        title: 'RFQ Submitted Successfully!',
        description: 'Our team will review and respond to your inquiry soon.',
      });

      onClose();
      setForm({ quantity: '', targetPrice: '', country: user.location.country || '', message: '' });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Request for Quotation</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Product</p>
              <p className="font-semibold text-foreground">{product.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Required *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 10000"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="premium-input"
                    required
                    min={product.moq}
                  />
                  <p className="text-xs text-muted-foreground">Min: {product.moq.toLocaleString()}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Target Price</Label>
                  <Input
                    id="price"
                    placeholder="e.g., $2.50/kg"
                    value={form.targetPrice}
                    onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                    className="premium-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Destination Country *</Label>
                <Input
                  id="country"
                  placeholder="United States"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="premium-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Requirements</Label>
                <Textarea
                  id="message"
                  placeholder="Describe any specific requirements, packaging preferences, certifications needed, etc."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="premium-input min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="glass" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1" disabled={createRFQ.isPending}>
                  {createRFQ.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit RFQ'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

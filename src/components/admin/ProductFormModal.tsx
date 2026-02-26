import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useProducts, useAddProduct, useUpdateProduct, type DbProduct } from '@/hooks/useProducts';
import { PRODUCT_CATEGORIES, ProductCategory } from '@/types';
import { generateSlug } from '@/lib/validation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUploader } from './ImageUploader';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProductId: string | null;
}

const defaultPaymentTerms = [
  '60% advance payment at the time of order confirmation',
  'Remaining 40% payment before issuance of Airway Bill (AWB)',
];

const defaultFormData = {
  name: '',
  category: '' as ProductCategory | '',
  shortDescription: '',
  fullDescription: '',
  images: [''],
  videoUrl: '',
  featured: false,
  moq: 5000,
  exportHighlight: 'FREE EXPORTING CHARGES',
  paymentTerms: [...defaultPaymentTerms],
  customizationNote: 'Customization in design, size, and branding is available as per your requirement.',
};

export const ProductFormModal = ({ isOpen, onClose, editingProductId }: ProductFormModalProps) => {
  const { data: products = [] } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const [formData, setFormData] = useState(defaultFormData);

  const editingProduct = editingProductId ? products.find((p) => p.id === editingProductId) : null;

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        shortDescription: editingProduct.short_description,
        fullDescription: editingProduct.full_description,
        images: editingProduct.images.length > 0 ? editingProduct.images : [''],
        videoUrl: editingProduct.video_url || '',
        featured: editingProduct.featured,
        moq: editingProduct.moq,
        exportHighlight: editingProduct.export_highlight,
        paymentTerms: editingProduct.payment_terms,
        customizationNote: editingProduct.customization_note,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingProduct]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.shortDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = {
      name: formData.name,
      slug: generateSlug(formData.name),
      category: formData.category as ProductCategory,
      short_description: formData.shortDescription,
      full_description: formData.fullDescription,
      images: formData.images.filter((img) => img.trim() !== ''),
      video_url: formData.videoUrl || null,
      featured: formData.featured,
      moq: formData.moq,
      export_highlight: formData.exportHighlight,
      payment_terms: formData.paymentTerms,
      customization_note: formData.customizationNote,
    };

    try {
      if (editingProductId) {
        await updateProduct.mutateAsync({ id: editingProductId, updates: productData });
      } else {
        await addProduct.mutateAsync(productData);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleImagesChange = (newImages: string[]) => {
    setFormData({ ...formData, images: newImages });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editingProductId ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground border-b border-border pb-2">
              Basic Information
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (auto-generated)</Label>
                <Input
                  value={generateSlug(formData.name)}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as ProductCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground border-b border-border pb-2">
              Descriptions
            </h4>
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief product description"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Detailed product description"
                rows={4}
              />
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground border-b border-border pb-2">Media</h4>
            <div className="space-y-3">
              <Label>Product Images</Label>
              <ImageUploader
                images={formData.images}
                onChange={handleImagesChange}
                maxImages={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL (YouTube/Vimeo)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground border-b border-border pb-2">Options</h4>
            <div className="flex items-center justify-between">
              <div>
                <Label>Featured Product</Label>
                <p className="text-sm text-muted-foreground">
                  Show this product in featured sections
                </p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moq">Minimum Order Quantity</Label>
                <Input
                  id="moq"
                  type="number"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exportHighlight">Export Highlight</Label>
                <Input
                  id="exportHighlight"
                  value={formData.exportHighlight}
                  onChange={(e) => setFormData({ ...formData, exportHighlight: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customizationNote">Customization Note</Label>
              <Textarea
                id="customizationNote"
                value={formData.customizationNote}
                onChange={(e) => setFormData({ ...formData, customizationNote: e.target.value })}
                rows={2}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="gold" 
              onClick={handleSubmit} 
              className="gap-2"
              disabled={addProduct.isPending || updateProduct.isPending}
            >
              <Save className="w-4 h-4" /> {editingProductId ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

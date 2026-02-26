import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useDataStore } from '@/store/dataStore';
import { PRODUCT_CATEGORIES, ProductCategory, Product } from '@/types';
import { generateId, generateSlug } from '@/lib/validation';
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
  const { products, addProduct, updateProduct } = useDataStore();
  const [formData, setFormData] = useState(defaultFormData);

  const editingProduct = editingProductId ? products.find((p) => p.id === editingProductId) : null;

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        shortDescription: editingProduct.shortDescription,
        fullDescription: editingProduct.fullDescription,
        images: editingProduct.images.length > 0 ? editingProduct.images : [''],
        videoUrl: editingProduct.videoUrl || '',
        featured: editingProduct.featured,
        moq: editingProduct.moq,
        exportHighlight: editingProduct.exportHighlight,
        paymentTerms: editingProduct.paymentTerms,
        customizationNote: editingProduct.customizationNote,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editingProduct]);

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.shortDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData: Omit<Product, 'id' | 'slug' | 'createdAt'> = {
      name: formData.name,
      category: formData.category as ProductCategory,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      images: formData.images.filter((img) => img.trim() !== ''),
      videoUrl: formData.videoUrl || undefined,
      featured: formData.featured,
      moq: formData.moq,
      exportHighlight: formData.exportHighlight,
      paymentTerms: formData.paymentTerms,
      customizationNote: formData.customizationNote,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productData);
      toast.success('Product updated successfully');
    } else {
      addProduct({
        id: generateId(),
        slug: generateSlug(formData.name),
        createdAt: new Date(),
        ...productData,
      });
      toast.success('Product added successfully');
    }

    onClose();
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
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
              <Label>Image URLs</Label>
              {formData.images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeImageField(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addImageField} className="gap-1">
                <Plus className="w-4 h-4" /> Add Image
              </Button>
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
            <Button variant="gold" onClick={handleSubmit} className="gap-2">
              <Save className="w-4 h-4" /> {editingProductId ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

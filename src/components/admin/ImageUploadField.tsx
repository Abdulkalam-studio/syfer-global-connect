import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useProductImageUpload } from '@/hooks/useProductImageUpload';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export const ImageUploadField = ({ images, onImagesChange }: ImageUploadFieldProps) => {
  const { uploadImage, deleteImage, isUploading, uploadProgress } = useProductImageUpload();
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) {
        onImagesChange([...images.filter(img => img.trim()), url]);
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onImagesChange([...images.filter(img => img.trim()), urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    
    // If it's a storage URL, try to delete from storage
    if (imageUrl.includes('product-images')) {
      await deleteImage(imageUrl);
    }
    
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const validImages = images.filter(img => img.trim());

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          "hover:border-primary/50 hover:bg-accent/50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
            <Progress value={uploadProgress} className="max-w-xs mx-auto" />
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click or drag images here to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG, WebP, GIF (max 10MB)
            </p>
          </>
        )}
      </div>

      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Or paste an image URL"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUrl())}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
        >
          Add URL
        </Button>
      </div>

      {/* Image Preview Grid */}
      {validImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {validImages.map((img, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={img}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {validImages.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No images added yet
        </div>
      )}
    </div>
  );
};

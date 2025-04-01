import { useState, useRef } from 'react';
import { ImageUploaderProps } from './types';
import ImageEditor from './components/ImageEditor';
import ImageGrid from './components/ImageGrid';
import DropZone from './components/DropZone';
import { useImageUpload } from './hooks/useImageUpload';

export default function ImageUploader({
  images = [],
  existingImages = [],
  onUpload,
  onReplace,
  onImagesUploaded,
  uploading = false,
  limit = 10
}: ImageUploaderProps) {
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleFileSelect,
    handleFileChange,
    isUploading,
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useImageUpload({
    onUpload,
    onReplace,
    onImagesUploaded,
    existingImages,
    images
  });

  const displayImages = images.length > 0 ? images : existingImages;

  return (
    <div className="w-full">
      {editingImage && (
        <ImageEditor
          image={editingImage}
          index={editingIndex!}
          onSave={handleFileSelect}
          onClose={() => {
            setEditingImage(null);
            setEditingIndex(null);
          }}
        />
      )}

      {displayImages.length > 0 ? (
        <ImageGrid
          images={displayImages}
          onEdit={(index) => {
            setEditingImage(displayImages[index]);
            setEditingIndex(index);
          }}
          onReplace={(index) => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          limit={limit}
          fileInputRef={fileInputRef}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          isDragging={isDragging}
        />
      ) : (
        <DropZone
          isUploading={isUploading}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          isDragging={isDragging}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
} 
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ImagePlaceholders } from '../types';

interface UseImageUploadProps {
  onUpload?: (file: File) => Promise<void>;
  onReplace?: (index: number, file: File) => Promise<void>;
  onImagesUploaded?: (urls: string[]) => void;
  existingImages: string[];
  images: string[];
}

export function useImageUpload({
  onUpload,
  onReplace,
  onImagesUploaded,
  existingImages,
  images
}: UseImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const supabase = createClientComponentClient();
  
  const displayImages = images.length > 0 ? images : existingImages;

  const uploadFile = async (file: File, oldUrl?: string, isEdited: boolean = false): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const folder = 'uploads';
    const filePath = `${folder}/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('docx')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('docx')
        .getPublicUrl(filePath);

      if (oldUrl) {
        await deleteImageFromStorage(oldUrl);
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const deleteImageFromStorage = async (url: string): Promise<boolean> => {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1].split('?')[0];
      
      const { error } = await supabase.storage
        .from('docx')
        .remove([`uploads/${filename}`]);

      return !error;
    } catch (error) {
      console.error('Error in deleteImageFromStorage:', error);
      return false;
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);

      if (replaceIndex !== null && onReplace) {
        await onReplace(replaceIndex, file);
      } else if (replaceIndex !== null && onImagesUploaded) {
        const oldImageUrl = displayImages[replaceIndex];
        const uploadedUrl = await uploadFile(file, oldImageUrl);
        const newUrls = [...displayImages];
        newUrls[replaceIndex] = uploadedUrl;
        onImagesUploaded(newUrls);
      } else if (onUpload) {
        await onUpload(file);
      } else if (onImagesUploaded) {
        const uploadedUrl = await uploadFile(file);
        onImagesUploaded([...displayImages, uploadedUrl]);
      }
    } catch (error) {
      console.error('Error handling file:', error);
    } finally {
      setIsUploading(false);
      setReplaceIndex(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return {
    handleFileSelect,
    handleFileChange,
    isUploading,
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    uploadFile,
    deleteImageFromStorage
  };
} 
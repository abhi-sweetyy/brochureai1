"use client";

import { useRef, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ImageUploaderProps {
  // Props for project page
  images?: string[];
  onUpload?: (file: File) => Promise<void>;
  onReplace?: (index: number, file: File) => Promise<void>;
  
  // Props for ImagesStep
  existingImages?: string[];
  onImagesUploaded?: (urls: string[]) => void;
  
  // Common props
  uploading?: boolean;
  limit?: number;
}

export default function ImageUploader({
  images = [],
  existingImages = [],
  onUpload,
  onReplace,
  onImagesUploaded,
  uploading = false,
  limit = 10
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(uploading);
  const [isDragging, setIsDragging] = useState(false);
  const supabase = createClientComponentClient();
  
  // Use either images or existingImages based on which is provided
  const displayImages = images.length > 0 ? images : existingImages;

  // Upload a file to Supabase storage
  const uploadFile = async (file: File): Promise<string> => {
    console.log('Uploading file to Supabase:', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    
    console.log('File path for upload:', filePath);
    console.log('Using bucket: docx');
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('docx')  // Using the correct bucket name
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful');
      
      const { data: urlData } = supabase.storage
        .from('docx')  // Using the correct bucket name
        .getPublicUrl(filePath);
      
      console.log('Public URL:', urlData.publicUrl);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadFile:', error);
      throw error;
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      
      if (replaceIndex !== null && onReplace) {
        // Replace existing image using onReplace
        console.log('Replacing image at index:', replaceIndex);
        await onReplace(replaceIndex, file);
      } else if (replaceIndex !== null && onImagesUploaded) {
        // Replace existing image using onImagesUploaded
        console.log('Replacing image at index (via onImagesUploaded):', replaceIndex);
        const uploadedUrl = await uploadFile(file);
        const newUrls = [...displayImages];
        newUrls[replaceIndex] = uploadedUrl;
        onImagesUploaded(newUrls);
      } else if (onUpload) {
        // Upload new image using onUpload
        console.log('Uploading new image (via onUpload)');
        await onUpload(file);
      } else if (onImagesUploaded) {
        // Upload new image using onImagesUploaded
        console.log('Uploading new image (via onImagesUploaded)');
        const uploadedUrl = await uploadFile(file);
        onImagesUploaded([...displayImages, uploadedUrl]);
      }
    } catch (error) {
      console.error('Error handling file:', error);
    } finally {
      setIsUploading(false);
      setReplaceIndex(null);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  const handleReplaceClick = (index: number) => {
    setReplaceIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {displayImages.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {displayImages.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Uploaded image ${index + 1}`}
                className="w-full aspect-video object-cover rounded-lg border border-[#2A3441]"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleReplaceClick(index)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Replace
                </button>
              </div>
            </div>
          ))}
          
          {displayImages.length < limit && (
            <div
              ref={dropAreaRef}
              className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragging 
                  ? 'border-purple-500 bg-purple-500/10 scale-105' 
                  : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
              }`}
              onClick={handleAreaClick}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-4 flex flex-col items-center">
                <svg className="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-sm font-medium text-gray-300">
                  {isUploading ? 'Uploading...' : 'Add Image'}
                </p>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Drop file here or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          ref={dropAreaRef}
          className={`flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragging 
              ? 'border-purple-500 bg-purple-500/10 scale-105' 
              : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
          }`}
          onClick={handleAreaClick}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-6 flex flex-col items-center">
            <svg className="w-16 h-16 text-purple-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium text-gray-300 mb-2">
              {isUploading ? 'Uploading...' : 'Upload Property Images'}
            </p>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              Drag and drop your images here, or click to browse your files
            </p>
            <p className="text-xs text-gray-600 mt-4">
              Supported formats: JPG, PNG, WEBP • Max size: 5MB
            </p>
          </div>
        </div>
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
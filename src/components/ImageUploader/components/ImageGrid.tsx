import { RefObject } from 'react';

interface ImageGridProps {
  images: string[];
  onEdit: (index: number) => void;
  onReplace: (index: number) => void;
  limit: number;
  fileInputRef: RefObject<HTMLInputElement>;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
}

export default function ImageGrid({
  images,
  onEdit,
  onReplace,
  limit,
  fileInputRef,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragging
}: ImageGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img 
            src={image} 
            alt={`Uploaded image ${index + 1}`}
            className="w-full aspect-video object-cover rounded-lg border border-[#2A3441]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(index)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onReplace(index)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      ))}

      {images.length < limit && (
        <div
          className={`flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-all ${
            isDragging 
              ? 'border-purple-500 bg-purple-500/10 scale-105' 
              : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="p-4 flex flex-col items-center">
            <svg className="w-8 h-8 text-purple-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-sm font-medium text-gray-300">Add Image</p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Drop file here or click to browse
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 
interface DropZoneProps {
  isUploading: boolean;
  isDragging: boolean;
  onClick: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function DropZone({
  isUploading,
  isDragging,
  onClick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop
}: DropZoneProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
        isDragging 
          ? 'border-purple-500 bg-purple-500/10 scale-105' 
          : 'border-[#2A3441] hover:border-purple-500/50 hover:bg-[#1D2839]/50'
      }`}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
  );
} 
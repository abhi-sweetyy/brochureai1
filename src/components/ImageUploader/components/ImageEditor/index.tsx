import { useRef } from 'react';
import { useImageEditor } from '../../hooks/useImageEditor';
import EditorControls from './EditorControls';
import BlurControls from './BlurControls';
import { EditorProps } from '../../types';

export default function ImageEditor({ 
  image, 
  index, 
  onSave, 
  onClose 
}: EditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    editorState,
    isUploading,
    handleBrightnessChange,
    handleContrastChange,
    handleBlurChange,
    handleBlurDrawingToggle,
    handleBlurStrengthChange,
    handleClearBlurRegions,
    handleReset,
    handleSave,
  } = useImageEditor({ image, canvasRef, onSave, index });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-[#1A202C] p-4 rounded-lg w-full md:w-auto max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-white">Edit Image</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Canvas Area */}
          <div className="flex-1 bg-[#121824] rounded-lg p-2 flex items-center justify-center">
            <div 
              ref={canvasRef} 
              className="canvas-container"
              style={{ 
                width: '100%',
                minHeight: '300px', 
                backgroundColor: '#0a0a0a',
                border: '1px solid #2A3441',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: editorState.isDrawingBlur ? 'crosshair' : 'default'
              }}
            />
          </div>

          {/* Controls Sidebar */}
          <div className="w-full lg:w-60 flex-shrink-0">
            <div className="p-3 bg-[#222A38] rounded-lg">
              <h3 className="text-base font-medium text-white mb-3">Adjustments</h3>
              
              <EditorControls
                editorState={editorState}
                onBrightnessChange={handleBrightnessChange}
                onContrastChange={handleContrastChange}
                onBlurChange={handleBlurChange}
              />

              <BlurControls
                editorState={editorState}
                onBlurDrawingToggle={handleBlurDrawingToggle}
                onBlurStrengthChange={handleBlurStrengthChange}
                onClearBlurRegions={handleClearBlurRegions}
              />

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={isUploading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                  {isUploading ? 'Saving...' : 'Save Changes'}
                </button>
                
                <button
                  onClick={handleReset}
                  className="bg-transparent border border-[#2A3441] text-gray-300 hover:bg-[#2A3441] px-4 py-2 rounded-md text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
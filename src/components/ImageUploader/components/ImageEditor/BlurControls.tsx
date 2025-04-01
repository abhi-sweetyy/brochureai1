import { EditorState } from '../../types';

interface BlurControlsProps {
  editorState: EditorState;
  onBlurDrawingToggle: () => void;
  onBlurStrengthChange: (value: number) => void;
  onClearBlurRegions: () => void;
}

export default function BlurControls({
  editorState,
  onBlurDrawingToggle,
  onBlurStrengthChange,
  onClearBlurRegions
}: BlurControlsProps) {
  return (
    <div className="mt-5 mb-3 border-t border-[#384152] pt-4">
      <div className="flex items-center mb-3">
        <label className="text-sm font-medium text-gray-300">Blur Areas</label>
        <div className="flex-1"></div>
        <button 
          className={`px-3 py-1 text-xs rounded-md ${
            editorState.isDrawingBlur 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
          onClick={onBlurDrawingToggle}
        >
          {editorState.isDrawingBlur ? 'Drawing Mode' : 'Select Mode'}
        </button>
      </div>

      <div className="mb-3">
        <div className="flex justify-between">
          <label className="text-xs text-gray-400 block mb-1">Blur Strength</label>
          <span className="text-xs text-gray-500">{editorState.blurBrushStrength}</span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={editorState.blurBrushStrength}
          onChange={(e) => onBlurStrengthChange(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="text-xs text-gray-500 italic mt-1 mb-3">
        <p>Click and drag to draw blur regions</p>
        <p>Double-click a region to remove it</p>
      </div>

      {editorState.blurRectangles.length > 0 && (
        <button
          onClick={onClearBlurRegions}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 px-2 py-1 rounded-md text-xs mt-2"
        >
          Clear All Blur Regions ({editorState.blurRectangles.length})
        </button>
      )}
    </div>
  );
} 
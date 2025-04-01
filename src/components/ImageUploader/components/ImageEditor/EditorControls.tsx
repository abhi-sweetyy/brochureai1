import { EditorState } from '../../types';

interface EditorControlsProps {
  editorState: EditorState;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onBlurChange: (value: number) => void;
}

export default function EditorControls({
  editorState,
  onBrightnessChange,
  onContrastChange,
  onBlurChange
}: EditorControlsProps) {
  return (
    <>
      <div className="mb-3">
        <label className="text-sm text-gray-300 block mb-1">Brightness</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={editorState.brightness}
          onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>-100</span>
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-300 block mb-1">Contrast</label>
        <input
          type="range"
          min="-100"
          max="100"
          value={editorState.contrast}
          onChange={(e) => onContrastChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>-100</span>
          <span>0</span>
          <span>100</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-sm text-gray-300 block mb-1">Global Blur</label>
        <input
          type="range"
          min="0"
          max="40"
          value={editorState.blur}
          onChange={(e) => onBlurChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>20</span>
          <span>40</span>
        </div>
      </div>
    </>
  );
} 
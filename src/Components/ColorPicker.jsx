import { useState } from 'react';
import { X } from 'lucide-react';

export default function ColorPicker({ colors, selectedColors, onColorSelect, onColorRemove, maxColors = null }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorClick = (color) => {
    if (selectedColors.includes(color.id)) {
      onColorRemove(color.id);
    } else {
      if (maxColors && selectedColors.length >= maxColors) {
        return; // Max colors reached
      }
      onColorSelect(color.id);
    }
  };

  const selectedColorObjects = colors.filter(c => selectedColors.includes(c.id));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {selectedColorObjects.map((color) => (
          <div
            key={color.id}
            className="relative group inline-flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200"
          >
            {color.hex_code && (
              <div
                className="w-5 h-5 rounded border border-slate-300"
                style={{ backgroundColor: color.hex_code }}
              />
            )}
            <span className="text-sm font-medium text-slate-700">{color.name}</span>
            <button
              type="button"
              onClick={() => onColorRemove(color.id)}
              className="ml-1 text-slate-400 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {selectedColors.length === 0 && (
          <span className="text-sm text-slate-500">No colors selected</span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {isOpen ? 'Close Color Picker' : 'Select Colors'}
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-lg w-80 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => handleColorClick(color)}
                  disabled={maxColors && selectedColors.length >= maxColors && !selectedColors.includes(color.id)}
                  className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                    selectedColors.includes(color.id)
                      ? 'border-rose-600 ring-2 ring-rose-200'
                      : 'border-slate-200 hover:border-slate-400'
                  } ${maxColors && selectedColors.length >= maxColors && !selectedColors.includes(color.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: color.hex_code || '#e5e7eb' }}
                  title={color.name}
                >
                  {selectedColors.includes(color.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-rose-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {colors.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">No colors available</p>
            )}
            {maxColors && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                {selectedColors.length}/{maxColors} colors selected
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

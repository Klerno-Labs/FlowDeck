'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Palette, Check } from 'lucide-react';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const DEFAULT_PRESETS = [
  '#00B4D8', // Cyan
  '#1E5AA8', // Blue
  '#8DC63F', // Green
  '#F17A2C', // Orange
  '#4169E1', // Royal Blue
  '#E91E63', // Pink
  '#9C27B0', // Purple
  '#FF5722', // Deep Orange
  '#00BCD4', // Cyan Light
  '#4CAF50', // Green Light
  '#FFC107', // Amber
  '#607D8B', // Blue Grey
];

/**
 * Elite Color Picker Popover
 * Beautiful color selection with presets and custom picker
 */
export function ColorPickerPopover({
  color,
  onChange,
  presetColors = DEFAULT_PRESETS,
}: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color);

  const handlePresetClick = (presetColor: string) => {
    onChange(presetColor);
    setCustomColor(presetColor);
  };

  const handleCustomColorChange = (newColor: string) => {
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all active:scale-95 touch-manipulation shadow-sm hover:shadow-md relative group"
        style={{ backgroundColor: color }}
        title="Change color"
      >
        <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
          <Palette className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
        </div>
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Popover Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              className="absolute bottom-full mb-2 left-0 z-50 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 w-64"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">Pick Color</span>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: customColor }}
                />
              </div>

              {/* Preset Colors */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                  Presets
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      onClick={() => handlePresetClick(presetColor)}
                      className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 active:scale-95 touch-manipulation relative group"
                      style={{
                        backgroundColor: presetColor,
                        borderColor:
                          presetColor === color
                            ? '#000'
                            : 'rgba(0, 0, 0, 0.1)',
                      }}
                      title={presetColor}
                    >
                      {presetColor === color && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Picker */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 block">
                  Custom
                </label>
                <div className="rounded-xl overflow-hidden shadow-inner">
                  <HexColorPicker
                    color={customColor}
                    onChange={handleCustomColorChange}
                    style={{ width: '100%', height: '150px' }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(value)) {
                        handleCustomColorChange(value);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg text-sm font-mono uppercase focus:border-blue-500 focus:outline-none"
                    placeholder="#000000"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all active:scale-95"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

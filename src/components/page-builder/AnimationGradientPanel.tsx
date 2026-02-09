'use client';

import { useState } from 'react';
import { Wand2, Palette } from 'lucide-react';

interface AnimationGradientPanelProps {
  currentAnimation?: string;
  currentBackground?: string;
  onAnimationChange: (animation: string | null) => void;
  onGradientChange: (gradient: string) => void;
}

const ANIMATION_PRESETS = [
  { name: 'None', value: null },
  { name: 'Fade In', value: 'fadeIn' },
  { name: 'Slide In Left', value: 'slideInLeft' },
  { name: 'Slide In Right', value: 'slideInRight' },
  { name: 'Slide In Up', value: 'slideInUp' },
  { name: 'Slide In Down', value: 'slideInDown' },
  { name: 'Scale In', value: 'scaleIn' },
  { name: 'Bounce In', value: 'bounceIn' },
  { name: 'Rotate In', value: 'rotateIn' },
];

const GRADIENT_PRESETS = [
  { name: 'Solid Color', value: '' },
  { name: 'Blue to Purple', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Pink to Orange', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: 'Green to Blue', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  { name: 'Cool Blues', value: 'linear-gradient(135deg, #2196f3 0%, #4fc3f7 100%)' },
  { name: 'Warm Sunset', value: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: 'Royal', value: 'linear-gradient(135deg, #4b1248 0%, #d8166e 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)' },
];

export function AnimationGradientPanel({
  currentAnimation,
  currentBackground,
  onAnimationChange,
  onGradientChange,
}: AnimationGradientPanelProps) {
  const [showAnimations, setShowAnimations] = useState(false);
  const [showGradients, setShowGradients] = useState(false);

  return (
    <div className="space-y-4">
      {/* Animation Presets */}
      <div>
        <button
          onClick={() => setShowAnimations(!showAnimations)}
          className="w-full flex items-center justify-between px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium text-purple-700"
        >
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            <span>Animations</span>
          </div>
          <span className="text-xs">{currentAnimation || 'None'}</span>
        </button>

        {showAnimations && (
          <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg space-y-1 max-h-64 overflow-y-auto">
            {ANIMATION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  onAnimationChange(preset.value);
                  setShowAnimations(false);
                }}
                className={`w-full text-left px-3 py-2 rounded hover:bg-purple-50 transition-colors text-sm ${
                  currentAnimation === preset.value ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Gradient Presets */}
      <div>
        <button
          onClick={() => setShowGradients(!showGradients)}
          className="w-full flex items-center justify-between px-3 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors text-sm font-medium text-pink-700"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Gradients</span>
          </div>
          {currentBackground?.startsWith('linear-gradient') ? (
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundImage: currentBackground }}
            />
          ) : (
            <span className="text-xs">Solid</span>
          )}
        </button>

        {showGradients && (
          <div className="mt-2 p-2 bg-white border border-gray-200 rounded-lg space-y-2 max-h-80 overflow-y-auto">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  onGradientChange(preset.value);
                  setShowGradients(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-pink-50 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                  style={{
                    background: preset.value || '#e5e7eb',
                  }}
                />
                <span className="text-sm text-gray-700 flex-1 text-left">{preset.name}</span>
                {currentBackground === preset.value && (
                  <span className="text-xs text-pink-600 font-semibold">Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Animation Duration (if animation is selected) */}
      {currentAnimation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Animation Duration
          </label>
          <select
            onChange={(e) => {
              // This will be handled by parent component
              const event = new CustomEvent('animationDurationChange', { detail: e.target.value });
              window.dispatchEvent(event);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          >
            <option value="0.5s">Fast (0.5s)</option>
            <option value="1s" selected>Normal (1s)</option>
            <option value="1.5s">Slow (1.5s)</option>
            <option value="2s">Very Slow (2s)</option>
          </select>
        </div>
      )}
    </div>
  );
}

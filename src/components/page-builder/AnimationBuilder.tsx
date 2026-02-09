'use client';

import { useState } from 'react';
import { X, Play, Pause, RotateCcw, Zap, Clock, Repeat, TrendingUp } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface AnimationBuilderProps {
  onClose: () => void;
  onApplyAnimation: (animation: AnimationConfig) => void;
  currentElement?: any;
}

interface AnimationConfig {
  name: string;
  duration: number; // seconds
  delay: number; // seconds
  iterationCount: string; // 'infinite' or number
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  timingFunction: string;
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  keyframes?: string;
}

interface AnimationPreset {
  name: string;
  description: string;
  category: string;
  keyframes: string;
  duration: number;
  timingFunction: string;
}

export function AnimationBuilder({ onClose, onApplyAnimation, currentElement }: AnimationBuilderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<AnimationPreset | null>(null);

  // Animation settings
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [iterationCount, setIterationCount] = useState('1');
  const [direction, setDirection] = useState<AnimationConfig['direction']>('normal');
  const [timingFunction, setTimingFunction] = useState('ease');
  const [fillMode, setFillMode] = useState<AnimationConfig['fillMode']>('forwards');

  const animationPresets: AnimationPreset[] = [
    {
      name: 'Fade In',
      description: 'Smooth fade in from transparent',
      category: 'Entrance',
      keyframes: 'fadeIn',
      duration: 1,
      timingFunction: 'ease-in',
    },
    {
      name: 'Fade Out',
      description: 'Smooth fade out to transparent',
      category: 'Exit',
      keyframes: 'fadeOut',
      duration: 1,
      timingFunction: 'ease-out',
    },
    {
      name: 'Slide In Left',
      description: 'Slide in from the left',
      category: 'Entrance',
      keyframes: 'slideInLeft',
      duration: 0.8,
      timingFunction: 'ease-out',
    },
    {
      name: 'Slide In Right',
      description: 'Slide in from the right',
      category: 'Entrance',
      keyframes: 'slideInRight',
      duration: 0.8,
      timingFunction: 'ease-out',
    },
    {
      name: 'Slide In Up',
      description: 'Slide in from the bottom',
      category: 'Entrance',
      keyframes: 'slideInUp',
      duration: 0.8,
      timingFunction: 'ease-out',
    },
    {
      name: 'Slide In Down',
      description: 'Slide in from the top',
      category: 'Entrance',
      keyframes: 'slideInDown',
      duration: 0.8,
      timingFunction: 'ease-out',
    },
    {
      name: 'Bounce In',
      description: 'Bounce in with elastic effect',
      category: 'Entrance',
      keyframes: 'bounceIn',
      duration: 1.2,
      timingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    {
      name: 'Zoom In',
      description: 'Scale up from center',
      category: 'Entrance',
      keyframes: 'zoomIn',
      duration: 0.8,
      timingFunction: 'ease-out',
    },
    {
      name: 'Zoom Out',
      description: 'Scale down to center',
      category: 'Exit',
      keyframes: 'zoomOut',
      duration: 0.8,
      timingFunction: 'ease-in',
    },
    {
      name: 'Rotate In',
      description: 'Rotate and fade in',
      category: 'Entrance',
      keyframes: 'rotateIn',
      duration: 1,
      timingFunction: 'ease-out',
    },
    {
      name: 'Flip In X',
      description: 'Flip horizontally',
      category: 'Entrance',
      keyframes: 'flipInX',
      duration: 1,
      timingFunction: 'ease-out',
    },
    {
      name: 'Flip In Y',
      description: 'Flip vertically',
      category: 'Entrance',
      keyframes: 'flipInY',
      duration: 1,
      timingFunction: 'ease-out',
    },
    {
      name: 'Shake',
      description: 'Shake horizontally',
      category: 'Attention',
      keyframes: 'shake',
      duration: 0.8,
      timingFunction: 'ease-in-out',
    },
    {
      name: 'Pulse',
      description: 'Pulsing scale effect',
      category: 'Attention',
      keyframes: 'pulse',
      duration: 1,
      timingFunction: 'ease-in-out',
    },
    {
      name: 'Bounce',
      description: 'Bouncing effect',
      category: 'Attention',
      keyframes: 'bounce',
      duration: 1,
      timingFunction: 'cubic-bezier(0.280, 0.840, 0.420, 1)',
    },
    {
      name: 'Swing',
      description: 'Swinging rotation',
      category: 'Attention',
      keyframes: 'swing',
      duration: 1,
      timingFunction: 'ease-in-out',
    },
    {
      name: 'Flash',
      description: 'Quick opacity flashes',
      category: 'Attention',
      keyframes: 'flash',
      duration: 1,
      timingFunction: 'ease-in-out',
    },
    {
      name: 'Rubber Band',
      description: 'Elastic stretching',
      category: 'Attention',
      keyframes: 'rubberBand',
      duration: 1,
      timingFunction: 'ease-in-out',
    },
  ];

  const timingFunctions = [
    { name: 'Ease', value: 'ease' },
    { name: 'Ease In', value: 'ease-in' },
    { name: 'Ease Out', value: 'ease-out' },
    { name: 'Ease In Out', value: 'ease-in-out' },
    { name: 'Linear', value: 'linear' },
    { name: 'Bounce', value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
    { name: 'Elastic', value: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
  ];

  const categories = ['All', 'Entrance', 'Exit', 'Attention'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPresets = selectedCategory === 'All'
    ? animationPresets
    : animationPresets.filter((p) => p.category === selectedCategory);

  const applyPreset = (preset: AnimationPreset) => {
    setSelectedPreset(preset);
    setDuration(preset.duration);
    setTimingFunction(preset.timingFunction);
    setIsPlaying(true);
    showToast(`${preset.name} preset applied`, 'success');

    // Auto-stop after animation duration
    setTimeout(() => setIsPlaying(false), preset.duration * 1000);
  };

  const handleApply = () => {
    if (!selectedPreset) {
      showToast('Please select an animation preset', 'error');
      return;
    }

    const config: AnimationConfig = {
      name: selectedPreset.keyframes,
      duration,
      delay,
      iterationCount,
      direction,
      timingFunction,
      fillMode,
      keyframes: selectedPreset.keyframes,
    };

    onApplyAnimation(config);
    onClose();
    showToast('Animation applied to element', 'success');
  };

  const playPreview = () => {
    setIsPlaying(true);
    if (selectedPreset) {
      setTimeout(() => setIsPlaying(false), duration * 1000);
    }
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setTimeout(() => {
      if (selectedPreset) {
        playPreview();
      }
    }, 10);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex">
        {/* Left Panel - Presets */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pink-500 to-rose-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Animations</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/90">Choose from preset animations</p>
          </div>

          {/* Category Filter */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Presets List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPreset?.name === preset.name
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-gray-900">{preset.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      preset.category === 'Entrance'
                        ? 'bg-green-100 text-green-700'
                        : preset.category === 'Exit'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{preset.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{preset.duration}s • {preset.timingFunction}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Panel - Settings */}
        <div className="w-96 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-xl font-bold text-gray-900">Animation Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Customize your animation</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration: {duration.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.1s</span>
                <span>5s</span>
              </div>
            </div>

            {/* Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delay: {delay.toFixed(1)}s
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={delay}
                onChange={(e) => setDelay(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0s</span>
                <span>5s</span>
              </div>
            </div>

            {/* Timing Function */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Easing Function
              </label>
              <select
                value={timingFunction}
                onChange={(e) => setTimingFunction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {timingFunctions.map((tf) => (
                  <option key={tf.value} value={tf.value}>
                    {tf.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Iteration Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Repeat className="w-4 h-4 inline mr-1" />
                Repeat
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={iterationCount === 'infinite' ? '∞' : iterationCount}
                  onChange={(e) => setIterationCount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1"
                />
                <button
                  onClick={() => setIterationCount(iterationCount === 'infinite' ? '1' : 'infinite')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    iterationCount === 'infinite'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ∞
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {iterationCount === 'infinite' ? 'Loop forever' : `Repeat ${iterationCount} time(s)`}
              </p>
            </div>

            {/* Direction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
                <option value="alternate-reverse">Alternate Reverse</option>
              </select>
            </div>

            {/* Fill Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fill Mode
              </label>
              <select
                value={fillMode}
                onChange={(e) => setFillMode(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">None</option>
                <option value="forwards">Forwards</option>
                <option value="backwards">Backwards</option>
                <option value="both">Both</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {fillMode === 'forwards' && 'Keeps final state after animation'}
                {fillMode === 'backwards' && 'Applies first state before animation'}
                {fillMode === 'both' && 'Combines forwards and backwards'}
                {fillMode === 'none' && 'Returns to original state'}
              </p>
            </div>

            {/* CSS Output */}
            {selectedPreset && (
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated CSS
                </label>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                  animation: {selectedPreset.keyframes} {duration}s {timingFunction} {delay}s {iterationCount} {direction} {fillMode};
                </div>
              </div>
            )}
          </div>

          {/* Apply Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={!selectedPreset}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" />
              Apply Animation
            </button>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="p-6 border-b border-gray-200 bg-white flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedPreset ? selectedPreset.name : 'Select an animation to preview'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={playPreview}
                disabled={!selectedPreset}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                Play
              </button>
              <button
                onClick={resetPreview}
                disabled={!selectedPreset}
                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-12 flex items-center justify-center">
            {selectedPreset ? (
              <div
                className={`w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center ${
                  isPlaying ? selectedPreset.keyframes : ''
                }`}
                style={{
                  animation: isPlaying
                    ? `${selectedPreset.keyframes} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`
                    : 'none',
                }}
              >
                <p className="text-white text-2xl font-bold">Preview</p>
              </div>
            ) : (
              <div className="text-center">
                <Zap className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Animation Selected</h3>
                <p className="text-gray-500">
                  Choose an animation preset from the left to see it in action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation Keyframes (injected into page) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideInDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes zoomIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes zoomOut {
          from { transform: scale(1); opacity: 1; }
          to { transform: scale(0); opacity: 0; }
        }

        @keyframes rotateIn {
          from { transform: rotate(-200deg); opacity: 0; }
          to { transform: rotate(0); opacity: 1; }
        }

        @keyframes flipInX {
          from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
          to { transform: perspective(400px) rotateX(0); opacity: 1; }
        }

        @keyframes flipInY {
          from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
          to { transform: perspective(400px) rotateY(0); opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-30px); }
          60% { transform: translateY(-15px); }
        }

        @keyframes swing {
          20% { transform: rotate(15deg); }
          40% { transform: rotate(-10deg); }
          60% { transform: rotate(5deg); }
          80% { transform: rotate(-5deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes flash {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }

        @keyframes rubberBand {
          0%, 100% { transform: scale(1); }
          30% { transform: scaleX(1.25) scaleY(0.75); }
          40% { transform: scaleX(0.75) scaleY(1.25); }
          50% { transform: scaleX(1.15) scaleY(0.85); }
          65% { transform: scaleX(0.95) scaleY(1.05); }
          75% { transform: scaleX(1.05) scaleY(0.95); }
        }
      `}</style>
    </div>
  );
}

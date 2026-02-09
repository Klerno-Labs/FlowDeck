'use client';

import { useState, useEffect } from 'react';
import { PageElement } from '@/types/page-builder';
import { X, Save, Trash2, Sparkles, Box, Type, Image as ImageIcon, Square } from 'lucide-react';
import { safeLocalStorage } from '@/lib/error-handler';

interface PresetItem {
  id: string;
  name: string;
  element: Omit<PageElement, 'id' | 'position'>;
  thumbnail?: string;
  createdAt: string;
}

interface PresetsLibraryProps {
  onClose: () => void;
  onApplyPreset: (element: Omit<PageElement, 'id' | 'position'>) => void;
  selectedElement?: PageElement | null;
  onSaveCurrentElement?: () => void;
}

export function PresetsLibrary({
  onClose,
  onApplyPreset,
  selectedElement,
  onSaveCurrentElement,
}: PresetsLibraryProps) {
  const [presets, setPresets] = useState<PresetItem[]>([]);
  const [presetName, setPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Load presets from localStorage
  useEffect(() => {
    const stored = safeLocalStorage.getItem('page-builder-presets');
    if (stored) {
      const parsed = safeLocalStorage.parseJSON(stored, []);
      setPresets(parsed);
    }
  }, []);

  // Save preset
  const savePreset = () => {
    if (!selectedElement || !presetName.trim()) return;

    const newPreset: PresetItem = {
      id: `preset-${Date.now()}`,
      name: presetName.trim(),
      element: {
        type: selectedElement.type,
        content: selectedElement.content,
        styles: { ...selectedElement.styles },
        visible: true,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    safeLocalStorage.setItem('page-builder-presets', JSON.stringify(updated));
    setPresetName('');
    setShowSaveDialog(false);
  };

  // Delete preset
  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    safeLocalStorage.setItem('page-builder-presets', JSON.stringify(updated));
  };

  // Get icon for element type
  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
      case 'heading':
        return <Type className="w-6 h-6" />;
      case 'button':
        return <Square className="w-6 h-6" />;
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'container':
        return <Box className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-500">
          <div className="flex items-center gap-3">
            <Box className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Element Presets Library</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Current Element Section */}
        {selectedElement && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-purple-200">
            {showSaveDialog ? (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Enter preset name..."
                  className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && savePreset()}
                  autoFocus
                />
                <button
                  onClick={savePreset}
                  disabled={!presetName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPresetName('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSaveDialog(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                <span className="font-semibold">Save Current Element as Preset</span>
              </button>
            )}
          </div>
        )}

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {presets.length === 0 ? (
            <div className="text-center py-20">
              <Box className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Presets Yet</h3>
              <p className="text-gray-500 mb-6">
                Save your favorite elements to reuse them quickly
              </p>
              {selectedElement && (
                <button
                  onClick={() => setShowSaveDialog(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span className="font-semibold">Save Your First Preset</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="group border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-400 hover:shadow-xl transition-all bg-white"
                >
                  {/* Preview */}
                  <div
                    className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => onApplyPreset(preset.element)}
                  >
                    <div className="text-center">
                      <div
                        className="inline-flex items-center justify-center mb-2"
                        style={{
                          color: preset.element.styles.color || '#000000',
                          backgroundColor: preset.element.styles.backgroundColor || 'transparent',
                          fontSize: '14px',
                          fontWeight: preset.element.styles.fontWeight || 'normal',
                          padding: '8px 16px',
                          borderRadius: preset.element.styles.borderRadius || '0',
                          border: preset.element.styles.border || 'none',
                        }}
                      >
                        {getElementIcon(preset.element.type)}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {preset.element.type} • {preset.element.content ? `"${preset.element.content.substring(0, 20)}..."` : 'Empty'}
                      </p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{preset.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {new Date(preset.createdAt).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onApplyPreset(preset.element)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all text-sm font-medium"
                      >
                        Use Preset
                      </button>
                      <button
                        onClick={() => deletePreset(preset.id)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Preset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> Presets save element styles and content, but not position or size.
            Click "Use Preset" to add to canvas.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Type,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Download,
  Upload,
  X,
} from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface BrandColor {
  id: string;
  name: string;
  hex: string;
  usage?: string; // "primary", "secondary", "accent", "text", "background"
}

interface BrandFont {
  id: string;
  name: string;
  fontFamily: string;
  usage?: string; // "heading", "body", "accent"
}

interface BrandLogo {
  id: string;
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'icon';
}

interface BrandKitData {
  id: string;
  name: string;
  colors: BrandColor[];
  fonts: BrandFont[];
  logos: BrandLogo[];
  createdAt: string;
  updatedAt: string;
}

interface BrandKitProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyColor?: (color: string) => void;
  onApplyFont?: (fontFamily: string) => void;
  onApplyLogo?: (logoUrl: string) => void;
}

/**
 * Elite Brand Kit Manager
 * Canva-style brand asset management system
 */
export function BrandKit({
  isOpen,
  onClose,
  onApplyColor,
  onApplyFont,
  onApplyLogo,
}: BrandKitProps) {
  const [brandKit, setBrandKit] = useState<BrandKitData | null>(null);
  const [activeTab, setActiveTab] = useState<'colors' | 'fonts' | 'logos'>('colors');
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#1E5AA8');
  const [newColorName, setNewColorName] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadBrandKit();
    }
  }, [isOpen]);

  const loadBrandKit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/brand-kit');
      if (response.ok) {
        const data = await response.json();
        setBrandKit(data.brandKit);
      } else {
        // Create default brand kit
        setBrandKit({
          id: 'default',
          name: 'FlowDeck Brand',
          colors: [
            { id: '1', name: 'Primary Blue', hex: '#1E5AA8', usage: 'primary' },
            { id: '2', name: 'Cyan', hex: '#00B4D8', usage: 'secondary' },
            { id: '3', name: 'Green', hex: '#8DC63F', usage: 'accent' },
            { id: '4', name: 'Orange', hex: '#F17A2C', usage: 'accent' },
          ],
          fonts: [
            { id: '1', name: 'Inter', fontFamily: 'Inter, sans-serif', usage: 'heading' },
            { id: '2', name: 'System UI', fontFamily: 'system-ui, sans-serif', usage: 'body' },
          ],
          logos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error loading brand kit:', error);
      showToast('Failed to load brand kit', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addColor = async () => {
    if (!newColorName.trim()) {
      showToast('Please enter a color name', 'error');
      return;
    }

    const newBrandColor: BrandColor = {
      id: Date.now().toString(),
      name: newColorName,
      hex: newColor,
    };

    const updatedBrandKit = {
      ...brandKit!,
      colors: [...(brandKit?.colors || []), newBrandColor],
      updatedAt: new Date().toISOString(),
    };

    setBrandKit(updatedBrandKit);
    setNewColorName('');
    setShowColorPicker(false);
    showToast('Color added to brand kit!', 'success');

    // Save to backend
    await saveBrandKit(updatedBrandKit);
  };

  const removeColor = async (colorId: string) => {
    const updatedBrandKit = {
      ...brandKit!,
      colors: brandKit!.colors.filter((c) => c.id !== colorId),
      updatedAt: new Date().toISOString(),
    };

    setBrandKit(updatedBrandKit);
    showToast('Color removed', 'success');

    // Save to backend
    await saveBrandKit(updatedBrandKit);
  };

  const saveBrandKit = async (data: BrandKitData) => {
    try {
      await fetch('/api/brand-kit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandKit: data }),
      });
    } catch (error) {
      console.error('Error saving brand kit:', error);
    }
  };

  const exportBrandKit = () => {
    const dataStr = JSON.stringify(brandKit, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand-kit-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Brand kit exported!', 'success');
  };

  const importBrandKit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      setBrandKit(imported);
      await saveBrandKit(imported);
      showToast('Brand kit imported successfully!', 'success');
    } catch (error) {
      showToast('Failed to import brand kit', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[100] p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Brand Kit</h2>
                <p className="text-sm text-gray-400">
                  Manage your brand colors, fonts, and logos
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".json"
                onChange={importBrandKit}
                className="hidden"
                id="import-brand-kit"
              />
              <label htmlFor="import-brand-kit">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 cursor-pointer"
                  as="span"
                >
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
              </label>
              <Button
                onClick={exportBrandKit}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-all active:scale-95"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-white/5 px-6">
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'colors'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Palette className="w-5 h-5 inline mr-2" />
              Colors
              {activeTab === 'colors' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'fonts'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Type className="w-5 h-5 inline mr-2" />
              Fonts
              {activeTab === 'fonts' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('logos')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'logos'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              Logos
              {activeTab === 'logos' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {brandKit?.colors.map((color) => (
                        <motion.div
                          key={color.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group relative"
                        >
                          <div
                            className="h-32 rounded-2xl border-2 border-white/10 cursor-pointer hover:border-white/30 transition-all relative overflow-hidden"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => onApplyColor?.(color.hex)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeColor(color.id);
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-red-600/80 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                          <div className="mt-2">
                            <div className="font-semibold text-white text-sm">
                              {color.name}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                              {color.hex}
                            </div>
                            {color.usage && (
                              <div className="text-xs text-purple-400 capitalize mt-1">
                                {color.usage}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}

                      {/* Add Color Button */}
                      <button
                        onClick={() => setShowColorPicker(true)}
                        className="h-32 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white"
                      >
                        <Plus className="w-8 h-8" />
                        <span className="text-sm font-semibold">Add Color</span>
                      </button>
                    </div>

                    {/* Add Color Modal */}
                    <AnimatePresence>
                      {showColorPicker && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                        >
                          <h3 className="text-lg font-bold text-white mb-4">
                            Add New Color
                          </h3>
                          <div className="flex gap-6">
                            <div className="flex-1">
                              <HexColorPicker
                                color={newColor}
                                onChange={setNewColor}
                                style={{ width: '100%', height: '200px' }}
                              />
                              <input
                                type="text"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="mt-4 w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-mono text-sm focus:border-purple-500 focus:outline-none"
                                placeholder="#000000"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-sm font-semibold text-white mb-2">
                                Color Name
                              </label>
                              <input
                                type="text"
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                placeholder="e.g., Primary Blue"
                              />
                              <div className="mt-6 flex gap-3">
                                <Button
                                  onClick={() => setShowColorPicker(false)}
                                  variant="ghost"
                                  size="md"
                                  className="flex-1 text-white hover:bg-white/10"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={addColor}
                                  variant="primary"
                                  size="md"
                                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Color
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Fonts Tab */}
                {activeTab === 'fonts' && (
                  <div>
                    <div className="space-y-4">
                      {brandKit?.fonts.map((font) => (
                        <motion.div
                          key={font.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                          onClick={() => onApplyFont?.(font.fontFamily)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div
                                className="text-3xl font-bold text-white mb-2"
                                style={{ fontFamily: font.fontFamily }}
                              >
                                {font.name}
                              </div>
                              <div className="text-sm text-gray-400">
                                {font.fontFamily}
                              </div>
                              {font.usage && (
                                <div className="text-xs text-purple-400 capitalize mt-2">
                                  {font.usage}
                                </div>
                              )}
                            </div>
                            <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Logos Tab */}
                {activeTab === 'logos' && (
                  <div>
                    <div className="text-center py-20 text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No logos added yet</p>
                      <p className="text-sm mt-2">
                        Upload your brand logos to use them in your designs
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        <Plus className="w-4 h-4" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

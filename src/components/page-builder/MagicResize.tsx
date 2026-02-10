'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Monitor,
  Smartphone,
  Check,
  Sparkles,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface ResizeFormat {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  icon: React.ReactNode;
  category: 'social' | 'print' | 'web';
  description: string;
}

const RESIZE_FORMATS: ResizeFormat[] = [
  // Instagram
  {
    id: 'ig-square',
    name: 'Instagram Square Post',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    icon: <Instagram className="w-5 h-5" />,
    category: 'social',
    description: '1:1 ratio, perfect for feed posts',
  },
  {
    id: 'ig-portrait',
    name: 'Instagram Portrait',
    platform: 'Instagram',
    width: 1080,
    height: 1350,
    icon: <Instagram className="w-5 h-5" />,
    category: 'social',
    description: '4:5 ratio, maximum vertical space',
  },
  {
    id: 'ig-story',
    name: 'Instagram Story',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    icon: <Instagram className="w-5 h-5" />,
    category: 'social',
    description: '9:16 ratio, full-screen mobile',
  },
  {
    id: 'ig-reel',
    name: 'Instagram Reel',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    icon: <Instagram className="w-5 h-5" />,
    category: 'social',
    description: '9:16 ratio, vertical video',
  },

  // LinkedIn
  {
    id: 'li-post',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    width: 1200,
    height: 627,
    icon: <Linkedin className="w-5 h-5" />,
    category: 'social',
    description: '1.91:1 ratio, link preview',
  },
  {
    id: 'li-story',
    name: 'LinkedIn Story',
    platform: 'LinkedIn',
    width: 1080,
    height: 1920,
    icon: <Linkedin className="w-5 h-5" />,
    category: 'social',
    description: '9:16 ratio, mobile story',
  },

  // Facebook
  {
    id: 'fb-post',
    name: 'Facebook Post',
    platform: 'Facebook',
    width: 1200,
    height: 630,
    icon: <Facebook className="w-5 h-5" />,
    category: 'social',
    description: '1.91:1 ratio, feed post',
  },
  {
    id: 'fb-story',
    name: 'Facebook Story',
    platform: 'Facebook',
    width: 1080,
    height: 1920,
    icon: <Facebook className="w-5 h-5" />,
    category: 'social',
    description: '9:16 ratio, story format',
  },
  {
    id: 'fb-cover',
    name: 'Facebook Cover',
    platform: 'Facebook',
    width: 820,
    height: 312,
    icon: <Facebook className="w-5 h-5" />,
    category: 'social',
    description: 'Wide banner for page cover',
  },

  // Twitter/X
  {
    id: 'tw-post',
    name: 'Twitter Post',
    platform: 'Twitter',
    width: 1200,
    height: 675,
    icon: <Twitter className="w-5 h-5" />,
    category: 'social',
    description: '16:9 ratio, optimal display',
  },
  {
    id: 'tw-header',
    name: 'Twitter Header',
    platform: 'Twitter',
    width: 1500,
    height: 500,
    icon: <Twitter className="w-5 h-5" />,
    category: 'social',
    description: '3:1 ratio, profile banner',
  },

  // YouTube
  {
    id: 'yt-thumbnail',
    name: 'YouTube Thumbnail',
    platform: 'YouTube',
    width: 1280,
    height: 720,
    icon: <Youtube className="w-5 h-5" />,
    category: 'social',
    description: '16:9 ratio, video preview',
  },
  {
    id: 'yt-banner',
    name: 'YouTube Banner',
    platform: 'YouTube',
    width: 2560,
    height: 1440,
    icon: <Youtube className="w-5 h-5" />,
    category: 'social',
    description: 'Channel banner, desktop view',
  },

  // Web
  {
    id: 'web-desktop',
    name: 'Desktop Banner',
    platform: 'Web',
    width: 1920,
    height: 1080,
    icon: <Monitor className="w-5 h-5" />,
    category: 'web',
    description: '16:9 ratio, full HD',
  },
  {
    id: 'web-mobile',
    name: 'Mobile Banner',
    platform: 'Web',
    width: 750,
    height: 1334,
    icon: <Smartphone className="w-5 h-5" />,
    category: 'web',
    description: '9:16 ratio, mobile optimized',
  },
];

interface MagicResizeProps {
  isOpen: boolean;
  onClose: () => void;
  currentWidth: number;
  currentHeight: number;
  onResize: (width: number, height: number, format: ResizeFormat) => void;
}

/**
 * Magic Resize Component
 * One-click resize to any social media format
 */
export function MagicResize({
  isOpen,
  onClose,
  currentWidth,
  currentHeight,
  onResize,
}: MagicResizeProps) {
  const [selectedCategory, setSelectedCategory] = useState<'social' | 'print' | 'web' | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<ResizeFormat | null>(null);
  const [resizing, setResizing] = useState(false);

  const filteredFormats =
    selectedCategory === 'all'
      ? RESIZE_FORMATS
      : RESIZE_FORMATS.filter((f) => f.category === selectedCategory);

  const handleResize = async (format: ResizeFormat) => {
    setSelectedFormat(format);
    setResizing(true);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    onResize(format.width, format.height, format);
    setResizing(false);
    showToast(
      `Resized to ${format.name} (${format.width}x${format.height})`,
      'success'
    );
    onClose();
  };

  const currentAspectRatio = (currentWidth / currentHeight).toFixed(2);

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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Magic Resize</h2>
                <p className="text-sm text-gray-400">
                  Current size: {currentWidth} × {currentHeight} (
                  {currentAspectRatio}:1)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 p-6 border-b border-white/10 bg-white/5">
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'social', label: 'Social Media' },
              { id: 'web', label: 'Web' },
              { id: 'print', label: 'Print' },
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Formats Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-3 gap-4">
              {filteredFormats.map((format) => {
                const aspectRatio = (format.width / format.height).toFixed(2);
                const isCurrentSize =
                  format.width === currentWidth && format.height === currentHeight;

                return (
                  <motion.button
                    key={format.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleResize(format)}
                    disabled={isCurrentSize || resizing}
                    className={`group relative bg-white/5 rounded-2xl p-6 border transition-all ${
                      isCurrentSize
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-white/10 hover:border-white/30 hover:bg-white/10'
                    } ${resizing && selectedFormat?.id === format.id ? 'cursor-wait' : 'cursor-pointer'}`}
                  >
                    {isCurrentSize && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                        {format.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-white text-sm">
                          {format.platform}
                        </div>
                        <div className="text-xs text-gray-400">
                          {aspectRatio}:1
                        </div>
                      </div>
                    </div>

                    <div className="text-left mb-3">
                      <div className="font-bold text-white mb-1">
                        {format.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format.description}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-cyan-400 font-mono">
                        {format.width} × {format.height}
                      </div>
                      {resizing && selectedFormat?.id === format.id ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
            <div className="text-sm text-gray-400">
              💡 Tip: Elements will automatically reposition to fit the new size
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

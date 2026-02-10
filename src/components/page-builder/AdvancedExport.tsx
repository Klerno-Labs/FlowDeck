'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  FileImage,
  FileText,
  Image as ImageIcon,
  Check,
  Loader2,
  Sparkles,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  icon: React.ReactNode;
  description: string;
  supportsQuality: boolean;
  supportsTransparency: boolean;
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'png',
    name: 'PNG',
    extension: '.png',
    icon: <FileImage className="w-5 h-5" />,
    description: 'Lossless, supports transparency',
    supportsQuality: false,
    supportsTransparency: true,
  },
  {
    id: 'jpg',
    name: 'JPG',
    extension: '.jpg',
    icon: <ImageIcon className="w-5 h-5" />,
    description: 'Smaller file size, no transparency',
    supportsQuality: true,
    supportsTransparency: false,
  },
  {
    id: 'webp',
    name: 'WebP',
    extension: '.webp',
    icon: <FileImage className="w-5 h-5" />,
    description: 'Modern format, best compression',
    supportsQuality: true,
    supportsTransparency: true,
  },
  {
    id: 'pdf',
    name: 'PDF',
    extension: '.pdf',
    icon: <FileText className="w-5 h-5" />,
    description: 'Print-ready document format',
    supportsQuality: true,
    supportsTransparency: false,
  },
];

interface AdvancedExportProps {
  isOpen: boolean;
  onClose: () => void;
  canvasElement: HTMLElement | null;
  fileName?: string;
}

/**
 * Advanced Export Component
 * Export designs to multiple formats with quality controls
 */
export function AdvancedExport({
  isOpen,
  onClose,
  canvasElement,
  fileName = 'design',
}: AdvancedExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(
    EXPORT_FORMATS[0]
  );
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState(1);
  const [includeBackground, setIncludeBackground] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!canvasElement) {
      showToast('No canvas element found', 'error');
      return;
    }

    setExporting(true);

    try {
      // Import html-to-image dynamically
      const htmlToImage = await import('html-to-image');

      let dataUrl: string;

      if (selectedFormat.id === 'pdf') {
        // For PDF, first create PNG then convert
        dataUrl = await htmlToImage.toPng(canvasElement, {
          quality: quality / 100,
          pixelRatio: scale,
          backgroundColor: includeBackground ? '#ffffff' : 'transparent',
        });

        // Import jsPDF dynamically
        const { jsPDF } = await import('jspdf');

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [
            canvasElement.offsetWidth,
            canvasElement.offsetHeight,
          ],
        });

        pdf.addImage(
          dataUrl,
          'PNG',
          0,
          0,
          canvasElement.offsetWidth,
          canvasElement.offsetHeight
        );

        pdf.save(`${fileName}${selectedFormat.extension}`);
      } else {
        // For images
        const options = {
          quality: quality / 100,
          pixelRatio: scale,
          backgroundColor: includeBackground ? '#ffffff' : 'transparent',
        };

        switch (selectedFormat.id) {
          case 'png':
            dataUrl = await htmlToImage.toPng(canvasElement, options);
            break;
          case 'jpg':
            dataUrl = await htmlToImage.toJpeg(canvasElement, options);
            break;
          case 'webp':
            dataUrl = await htmlToImage.toJpeg(canvasElement, {
              ...options,
              type: 'image/webp',
            });
            break;
          default:
            dataUrl = await htmlToImage.toPng(canvasElement, options);
        }

        // Download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}${selectedFormat.extension}`;
        link.click();
      }

      showToast(
        `Exported as ${selectedFormat.name} successfully!`,
        'success'
      );
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to export. Please try again.', 'error');
    } finally {
      setExporting(false);
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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Advanced Export
                </h2>
                <p className="text-sm text-gray-400">
                  Export your design with custom settings
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

          {/* Content */}
          <div className="p-8">
            {/* Format Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Select Format
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {EXPORT_FORMATS.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all ${
                      selectedFormat.id === format.id
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    {selectedFormat.id === format.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-3">
                      {format.icon}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-white mb-1">
                        {format.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Export Settings
              </h3>

              {/* Quality Slider */}
              {selectedFormat.supportsQuality && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-white">
                      Quality
                    </label>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-sm text-white font-mono">
                      {quality}%
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Lower size</span>
                    <span>Higher quality</span>
                  </div>
                </div>
              )}

              {/* Scale Slider */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-white">
                    Resolution Scale
                  </label>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-sm text-white font-mono">
                    {scale}x
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.5"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Standard</span>
                  <span>4K/Retina</span>
                </div>
              </div>

              {/* Background Toggle */}
              {selectedFormat.supportsTransparency && (
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">
                      Include Background
                    </div>
                    <div className="text-xs text-gray-400">
                      Uncheck for transparent background
                    </div>
                  </div>
                  <button
                    onClick={() => setIncludeBackground(!includeBackground)}
                    className={`relative w-14 h-8 rounded-full transition-all ${
                      includeBackground
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg ${
                        includeBackground ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Preview Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-1">
                    Export Preview
                  </h4>
                  <p className="text-sm text-gray-400">
                    Your design will be exported as{' '}
                    <span className="font-semibold text-white">
                      {selectedFormat.name}
                    </span>{' '}
                    at{' '}
                    <span className="font-semibold text-white">
                      {scale}x resolution
                    </span>
                    {selectedFormat.supportsQuality && (
                      <>
                        {' '}
                        with{' '}
                        <span className="font-semibold text-white">
                          {quality}% quality
                        </span>
                      </>
                    )}
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
            <Button
              onClick={onClose}
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10"
              disabled={exporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={exporting || !canvasElement}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Export {selectedFormat.name}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

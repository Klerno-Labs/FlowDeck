'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Loader2, Check, X, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';

interface BackgroundRemoverProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onComplete: (processedImageUrl: string) => void;
}

/**
 * AI Background Remover
 * Uses AI to automatically remove backgrounds from images
 */
export function BackgroundRemover({
  isOpen,
  onClose,
  imageUrl,
  onComplete,
}: BackgroundRemoverProps) {
  const [processing, setProcessing] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const removeBackground = async () => {
    setProcessing(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Call background removal API
      const response = await fetch('/api/images/remove-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Background removal failed');
      }

      const data = await response.json();
      setProcessedImageUrl(data.processedImageUrl);
      setProgress(100);
      showToast('Background removed successfully! ✨', 'success');
    } catch (error) {
      console.error('Error removing background:', error);
      showToast('Failed to remove background. Please try again.', 'error');
      setProcessing(false);
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleApply = () => {
    if (processedImageUrl) {
      onComplete(processedImageUrl);
      onClose();
    }
  };

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `no-bg-${Date.now()}.png`;
      link.click();
      showToast('Image downloaded!', 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Background Remover</h2>
                <p className="text-sm text-gray-400">
                  Automatically remove image backgrounds with AI
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
            <div className="grid grid-cols-2 gap-8">
              {/* Original Image */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Original</h3>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-400">
                    With Background
                  </div>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 bg-checkerboard">
                  <img
                    src={imageUrl}
                    alt="Original"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Processed Image */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Processed</h3>
                  {processedImageUrl && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full text-xs text-green-400 border border-green-500/30">
                      <Check className="w-3 h-3" />
                      Background Removed
                    </div>
                  )}
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white/10 bg-checkerboard">
                  {processing ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                      <div className="text-white font-semibold mb-2">
                        Removing background...
                      </div>
                      <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-400 mt-2">{progress}%</div>
                    </div>
                  ) : processedImageUrl ? (
                    <img
                      src={processedImageUrl}
                      alt="Processed"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                      <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-lg font-semibold">No background removed yet</p>
                      <p className="text-sm mt-2">Click "Remove Background" to start</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-1">
                    AI-Powered Processing
                  </h4>
                  <p className="text-sm text-gray-400">
                    Our AI automatically detects and removes the background, preserving fine details like hair and edges. Works best with clear subjects and good lighting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
            <Button
              onClick={onClose}
              variant="ghost"
              size="md"
              className="text-white hover:bg-white/10"
              disabled={processing}
            >
              Cancel
            </Button>
            <div className="flex gap-3">
              {processedImageUrl && (
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="md"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              )}
              {!processedImageUrl ? (
                <Button
                  onClick={removeBackground}
                  disabled={processing}
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" />
                      Remove Background
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleApply}
                  variant="primary"
                  size="md"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 shadow-lg shadow-green-500/50"
                >
                  <Check className="w-4 h-4" />
                  Apply to Design
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Checkerboard CSS */}
      <style jsx>{`
        .bg-checkerboard {
          background-image: linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
            linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
          background-size: 20px 20px;
          background-position:
            0 0,
            0 10px,
            10px -10px,
            -10px 0px;
        }
      `}</style>
    </AnimatePresence>
  );
}

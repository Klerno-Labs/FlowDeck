'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Download,
  Heart,
  Info,
  ExternalLink,
  Loader2,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/components/ui/Toast';
import { debounce } from 'lodash';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
    profile_image: { small: string };
    links: { html: string };
  };
  description: string | null;
  alt_description: string | null;
  likes: number;
  width: number;
  height: number;
  color: string;
  links: {
    download_location: string;
    html: string;
  };
}

interface StockPhotosProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (photoUrl: string, photoData: UnsplashPhoto) => void;
}

const TRENDING_SEARCHES = [
  'business',
  'technology',
  'nature',
  'office',
  'people',
  'abstract',
  'food',
  'architecture',
  'travel',
  'minimalist',
  'workspace',
  'team',
];

/**
 * Stock Photos Library
 * Unsplash integration for millions of free stock photos
 */
export function StockPhotos({
  isOpen,
  onClose,
  onSelectPhoto,
}: StockPhotosProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<UnsplashPhoto | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTrendingPhotos();
    }
  }, [isOpen]);

  const loadTrendingPhotos = async () => {
    setLoading(true);
    try {
      // Load curated/editorial photos as "trending"
      const response = await fetch(
        '/api/stock-photos/curated?page=1&per_page=30'
      );
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Error loading trending photos:', error);
      showToast('Failed to load photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const searchPhotos = async (query: string, pageNum: number = 1) => {
    if (!query.trim()) {
      loadTrendingPhotos();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/stock-photos/search?query=${encodeURIComponent(query)}&page=${pageNum}&per_page=30`
      );
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
        setTotalPages(data.total_pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error searching photos:', error);
      showToast('Failed to search photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => searchPhotos(query), 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleTrendingClick = (term: string) => {
    setSearchQuery(term);
    searchPhotos(term);
  };

  const handleSelectPhoto = async (photo: UnsplashPhoto) => {
    setSelectedPhoto(photo);

    // Trigger download tracking (required by Unsplash API guidelines)
    try {
      await fetch('/api/stock-photos/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadLocation: photo.links.download_location }),
      });
    } catch (error) {
      console.error('Error tracking download:', error);
    }

    onSelectPhoto(photo.urls.regular, photo);
    showToast(
      `Photo by ${photo.user.name} added to your design!`,
      'success'
    );
    onClose();
  };

  const loadNextPage = () => {
    if (page < totalPages) {
      searchPhotos(searchQuery, page + 1);
    }
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      searchPhotos(searchQuery, page - 1);
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
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Stock Photos</h2>
                <p className="text-sm text-gray-400">
                  Millions of free images powered by Unsplash
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

          {/* Search Bar */}
          <div className="p-6 border-b border-white/10 bg-white/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for images (business, nature, technology...)"
                className="w-full pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 rounded-2xl text-white placeholder-gray-400 text-lg focus:border-green-500 focus:outline-none transition-all"
                autoFocus
              />
            </div>

            {/* Trending Searches */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-gray-400">
                  Trending Searches
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white transition-all hover:scale-105 active:scale-95"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No photos found</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {photos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.03 }}
                      className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
                      onClick={() => handleSelectPhoto(photo)}
                    >
                      <img
                        src={photo.urls.small}
                        alt={photo.alt_description || 'Stock photo'}
                        className="w-full h-full object-cover"
                        style={{ backgroundColor: photo.color }}
                      />

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={photo.user.profile_image.small}
                              alt={photo.user.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-semibold truncate">
                                {photo.user.name}
                              </div>
                            </div>
                            <Heart className="w-4 h-4 text-white" />
                            <span className="text-white text-xs">
                              {photo.likes}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-xs text-white/80">
                              {photo.width} × {photo.height}
                            </div>
                            <Download className="w-4 h-4 text-white ml-auto" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      onClick={loadPreviousPage}
                      disabled={page === 1}
                      variant="secondary"
                      size="md"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Previous
                    </Button>
                    <div className="text-white font-semibold">
                      Page {page} of {totalPages}
                    </div>
                    <Button
                      onClick={loadNextPage}
                      disabled={page === totalPages}
                      variant="secondary"
                      size="md"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Powered by</span>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-green-400 transition-colors flex items-center gap-1"
              >
                Unsplash
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="text-xs text-gray-500">
              Photos are free to use under the Unsplash License
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

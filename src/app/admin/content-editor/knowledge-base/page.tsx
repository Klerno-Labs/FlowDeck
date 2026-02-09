'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronRight, Plus, Trash2, Save, Upload } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface KnowledgeSlideItem {
  id: string;
  slide_id: string;
  content: string;
  display_order: number;
}

interface KnowledgeSlide {
  id: string;
  slide_key: string;
  title: string;
  subtitle: string | null;
  layout: 'content-left' | 'content-right';
  image_path: string;
  quote: string | null;
  display_order: number;
  items: KnowledgeSlideItem[];
}

export default function KnowledgeBaseEditorPage() {
  const router = useRouter();
  const [slides, setSlides] = useState<KnowledgeSlide[]>([]);
  const [expandedSlideId, setExpandedSlideId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    try {
      const res = await fetch('/api/content-editor/knowledge-base');
      if (!res.ok) throw new Error('Failed to fetch slides');
      const data = await res.json();
      setSlides(data.slides || []);
      // Auto-expand first slide
      if (data.slides && data.slides.length > 0) {
        setExpandedSlideId(data.slides[0].id);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      showToast('Failed to load slides', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(slideId: string) {
    setSaving(true);
    try {
      const slide = slides.find(s => s.id === slideId);
      if (!slide) return;

      const res = await fetch('/api/content-editor/knowledge-base', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: slide.id,
          data: {
            title: slide.title,
            subtitle: slide.subtitle,
            layout: slide.layout,
            image_path: slide.image_path,
            quote: slide.quote,
          },
          items: slide.items,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      showToast('Slide saved successfully', 'success');
      router.refresh();
    } catch (error) {
      console.error('Error saving slide:', error);
      showToast('Failed to save slide', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(slideId: string, file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      setSlides(prev => prev.map(slide =>
        slide.id === slideId
          ? { ...slide, image_path: data.url }
          : slide
      ));

      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  function updateSlideField(slideId: string, field: keyof KnowledgeSlide, value: any) {
    setSlides(prev => prev.map(slide =>
      slide.id === slideId ? { ...slide, [field]: value } : slide
    ));
  }

  function updateSlideItem(slideId: string, itemId: string, field: keyof KnowledgeSlideItem, value: any) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.map(item =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      };
    }));
  }

  function addSlideItem(slideId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      const maxOrder = Math.max(0, ...slide.items.map(i => i.display_order));
      return {
        ...slide,
        items: [
          ...slide.items,
          {
            id: `temp-${Date.now()}`,
            slide_id: slideId,
            content: '',
            display_order: maxOrder + 1,
          },
        ],
      };
    }));
  }

  function removeSlideItem(slideId: string, itemId: string) {
    setSlides(prev => prev.map(slide => {
      if (slide.id !== slideId) return slide;
      return {
        ...slide,
        items: slide.items.filter(item => item.id !== itemId),
      };
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Knowledge Base Slides</h1>
        <p className="text-lg text-gray-600">
          Edit carousel slides for the Knowledge Base section
        </p>
      </div>

      {/* Slides */}
      <div className="space-y-4">
        {slides.map(slide => {
          const isExpanded = expandedSlideId === slide.id;

          return (
            <div key={slide.id} className="rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-md">
              {/* Slide Header */}
              <button
                onClick={() => setExpandedSlideId(isExpanded ? null : slide.id)}
                className="w-full p-6 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors touch-manipulation"
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-800">{slide.title}</h3>
                </div>
                <span className="text-sm text-gray-500">{slide.items.length} items</span>
              </button>

              {/* Slide Content */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateSlideField(slide.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                      placeholder="Enter title..."
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Subtitle <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => updateSlideField(slide.id, 'subtitle', e.target.value || null)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter subtitle..."
                    />
                  </div>

                  {/* Layout */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Layout</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => updateSlideField(slide.id, 'layout', 'content-left')}
                        className={`p-4 rounded-xl border-2 transition-all touch-manipulation ${
                          slide.layout === 'content-left'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-bold">Content Left</div>
                        <div className="text-sm mt-1">Image on right</div>
                      </button>
                      <button
                        onClick={() => updateSlideField(slide.id, 'layout', 'content-right')}
                        className={`p-4 rounded-xl border-2 transition-all touch-manipulation ${
                          slide.layout === 'content-right'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-bold">Content Right</div>
                        <div className="text-sm mt-1">Image on left</div>
                      </button>
                    </div>
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image</label>
                    {slide.image_path && (
                      <div className="mb-4">
                        <Image
                          src={slide.image_path}
                          alt={slide.title}
                          width={300}
                          height={200}
                          className="rounded-xl object-cover"
                        />
                      </div>
                    )}
                    <label className="inline-flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors touch-manipulation">
                      <Upload className="w-5 h-5" />
                      <span className="font-semibold">
                        {uploading ? 'Uploading...' : 'Upload New Image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(slide.id, file);
                        }}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Quote */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Quote Overlay <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={slide.quote || ''}
                      onChange={(e) => updateSlideField(slide.id, 'quote', e.target.value || null)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                      placeholder="Enter quote text to display over image..."
                    />
                  </div>

                  {/* Content Items */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Content Items</label>
                    <div className="space-y-3">
                      {slide.items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={item.content}
                              onChange={(e) => updateSlideItem(slide.id, item.id, 'content', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                              placeholder={`Item ${index + 1}...`}
                            />
                          </div>
                          <button
                            onClick={() => removeSlideItem(slide.id, item.id)}
                            className="p-3 rounded-xl hover:bg-red-100 text-red-600 transition-colors touch-manipulation"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => addSlideItem(slide.id)}
                      className="mt-4 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600 font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation"
                    >
                      <Plus className="w-5 h-5" />
                      Add Content Item
                    </button>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t-2 border-gray-100">
                    <button
                      onClick={() => handleSave(slide.id)}
                      disabled={saving}
                      className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95 touch-manipulation"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

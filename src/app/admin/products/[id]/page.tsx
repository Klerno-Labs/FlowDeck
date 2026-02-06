'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Upload, Loader2, Save, Plus, Package, Check } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_path?: string;
  display_order: number;
  product_line_id: string;
  specs?: Array<{
    id: string;
    spec_key: string;
    spec_value: string;
    display_order: number;
  }>;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Form fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  // Auto-save with debounce
  const autoSave = useCallback(async () => {
    if (!params.id || !name || !slug) return;

    setAutoSaveStatus('saving');

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          image_path: imagePath,
          display_order: displayOrder,
        }),
      });

      if (res.ok) {
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('idle');
    }
  }, [params.id, name, slug, imagePath, displayOrder]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!product) return; // Don't auto-save before initial load

    const timer = setTimeout(() => {
      autoSave();
    }, 1500); // Wait 1.5s after last change

    return () => clearTimeout(timer);
  }, [name, slug, displayOrder, autoSave, product]);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  async function fetchProduct() {
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();

      if (data.product) {
        setProduct(data.product);
        setName(data.product.name);
        setSlug(data.product.slug);
        setImagePath(data.product.image_path || '');
        setDisplayOrder(data.product.display_order);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setImagePath(data.url);
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          image_path: imagePath,
          display_order: displayOrder,
        }),
      });

      if (res.ok) {
        showToast('Product saved successfully!', 'success');
        setTimeout(() => router.push('/admin/products'), 1000);
      } else {
        showToast('Failed to save product', 'error');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showToast('Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-600 mb-6">Product not found</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-lg text-gray-600 hover:text-gray-900 mb-4 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to products
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-bold text-gray-900">Edit Product</h1>
          {autoSaveStatus !== 'idle' && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              autoSaveStatus === 'saving'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-green-50 text-green-600'
            }`}>
              {autoSaveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-medium">Saved</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Product Image */}
          <div className="bg-white shadow-xl rounded-3xl border-2 border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Image</h2>

            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mb-6 overflow-hidden border-2 border-gray-200">
              {imagePath ? (
                <Image
                  src={imagePath}
                  alt={name}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full p-6"
                />
              ) : (
                <Package className="w-24 h-24 text-gray-300" />
              )}
            </div>

            <label className="cursor-pointer w-full inline-flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 transition-all active:scale-95 touch-manipulation">
              <Upload className="w-6 h-6" />
              {uploading ? 'Uploading...' : 'Upload New Image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploading && (
              <div className="flex items-center justify-center gap-2 mt-4 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Processing...</span>
              </div>
            )}

            <p className="mt-4 text-sm text-gray-500 text-center">
              JPEG, PNG, WebP, or GIF<br />Maximum 10MB
            </p>
          </div>

          {/* Right Column - Product Details & Specs */}
          <div className="col-span-2 space-y-6">
            {/* Product Details Card */}
            <div className="bg-white shadow-xl rounded-3xl border-2 border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>

              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., Clarify 250"
                    required
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-5 py-4 text-lg font-mono border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    placeholder="e.g., clarify-250"
                    pattern="[a-z0-9-]+"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    URL-friendly identifier (lowercase, hyphens only)
                  </p>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Display Order <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    min={1}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Lower numbers appear first in the product list
                  </p>
                </div>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white shadow-xl rounded-3xl border-2 border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Specifications
                  {product.specs && product.specs.length > 0 && (
                    <span className="ml-3 text-lg font-normal text-gray-500">
                      ({product.specs.length})
                    </span>
                  )}
                </h2>
                <Link
                  href={`/admin/products/${params.id}/specifications`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold shadow-green-500/30 active:scale-95 touch-manipulation"
                >
                  <Plus className="w-5 h-5" />
                  Manage Specs
                </Link>
              </div>

              {product.specs && product.specs.length > 0 ? (
                <div className="space-y-3">
                  {product.specs.slice(0, 8).map((spec) => (
                    <div
                      key={spec.id}
                      className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-semibold text-gray-700 text-base">{spec.spec_key}</span>
                      <span className="text-gray-600 text-right ml-6 max-w-md text-base">
                        {spec.spec_value.substring(0, 80)}
                        {spec.spec_value.length > 80 && '...'}
                      </span>
                    </div>
                  ))}
                  {product.specs.length > 8 && (
                    <p className="text-base text-gray-500 pt-3 text-center font-medium">
                      + {product.specs.length - 8} more specifications
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-base text-gray-500">No specifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Manage Specs" to add specifications</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all text-xl font-bold shadow-lg shadow-blue-500/30 active:scale-95 touch-manipulation"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    Save & Exit
                  </>
                )}
              </button>
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center px-8 py-5 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all text-xl font-bold active:scale-95 touch-manipulation"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, FolderTree, Loader2, Search } from 'lucide-react';
import Image from 'next/image';

interface ProductLine {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  logo_path: string | null;
  display_order: number;
}

interface Category {
  id: string;
  code: string;
  title: string;
  slug: string;
  background_color: string;
}

export default function ProductLinesPage() {
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingLine, setEditingLine] = useState<ProductLine | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [linesRes, catsRes] = await Promise.all([
        fetch('/api/product-lines'),
        fetch('/api/categories'),
      ]);

      const linesData = await linesRes.json();
      const catsData = await catsRes.json();

      setProductLines(linesData.productLines || []);
      setCategories(catsData.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(line: ProductLine) {
    setEditingLine(line);
    setShowModal(true);
  }

  function handleCreate() {
    setEditingLine(null);
    setShowModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product line? This will also delete all associated products.')) {
      return;
    }

    try {
      const res = await fetch(`/api/product-lines/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete product line');
      }
    } catch (error) {
      console.error('Error deleting product line:', error);
      alert('Failed to delete product line');
    }
  }

  const filteredLines = productLines.filter((line) => {
    const matchesSearch = line.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || line.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Product Lines</h1>
          <p className="text-xl text-gray-600">
            {productLines.length} total product lines • {filteredLines.length} shown
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all text-lg font-bold shadow-lg shadow-purple-500/30 active:scale-95 touch-manipulation"
        >
          <Plus className="w-6 h-6" />
          Add Product Line
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search product lines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.code} - {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Product Lines Grid */}
      {filteredLines.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-20 text-center">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">
            {searchTerm || selectedCategory !== 'all'
              ? 'No product lines found matching your filters.'
              : 'No product lines yet. Create one to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredLines.map((line) => {
            const category = categories.find((c) => c.id === line.category_id);

            return (
              <div
                key={line.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-purple-300"
              >
                {/* Category Badge */}
                {category && (
                  <div
                    className="h-2"
                    style={{ backgroundColor: category.background_color }}
                  ></div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Logo */}
                  <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                    {line.logo_path ? (
                      <Image
                        src={line.logo_path}
                        alt={line.title}
                        width={150}
                        height={150}
                        className="object-contain w-full h-full p-4"
                      />
                    ) : (
                      <FolderTree className="w-16 h-16 text-gray-300" />
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                    {line.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {line.slug}
                    </span>
                    <span className="text-xs">#{line.display_order}</span>
                  </div>

                  {/* Category Tag */}
                  {category && (
                    <div className="mb-4">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: category.background_color }}
                      >
                        {category.code}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(line)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-semibold active:scale-95 touch-manipulation"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(line.id)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-semibold active:scale-95 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductLineModal
          productLine={editingLine}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingLine(null);
          }}
          onSave={() => {
            setShowModal(false);
            setEditingLine(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function ProductLineModal({
  productLine,
  categories,
  onClose,
  onSave,
}: {
  productLine: ProductLine | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    category_id: productLine?.category_id || categories[0]?.id || '',
    title: productLine?.title || '',
    slug: productLine?.slug || '',
    logo_path: productLine?.logo_path || '',
    display_order: productLine?.display_order || 1,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        setFormData((prev) => ({ ...prev, logo_path: data.url }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = productLine
        ? `/api/product-lines/${productLine.id}`
        : '/api/product-lines';
      const method = productLine ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product line');
      }
    } catch (error) {
      console.error('Error saving product line:', error);
      alert('Failed to save product line');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-8 border-b-2 border-gray-100 rounded-t-3xl">
          <h3 className="text-3xl font-bold text-gray-900">
            {productLine ? 'Edit Product Line' : 'Create Product Line'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.code} - {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., CLARIFY"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
              className="w-full px-5 py-4 text-lg font-mono border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g., clarify"
              pattern="[a-z0-9-]+"
              required
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Display Order <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              min={1}
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Logo
            </label>
            {formData.logo_path && (
              <div className="mb-4 relative w-32 h-32 bg-gray-100 rounded-xl mx-auto">
                <Image
                  src={formData.logo_path}
                  alt={formData.title}
                  fill
                  className="object-contain p-2 rounded-xl"
                />
              </div>
            )}
            <label className="cursor-pointer w-full inline-flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-300 rounded-2xl text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-400 transition-all active:scale-95 touch-manipulation">
              <Plus className="w-5 h-5" />
              {uploading ? 'Uploading...' : formData.logo_path ? 'Change Logo' : 'Upload Logo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-8 py-5 bg-purple-600 text-white rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all active:scale-95 touch-manipulation"
            >
              {saving ? 'Saving...' : productLine ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-8 py-5 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all active:scale-95 touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

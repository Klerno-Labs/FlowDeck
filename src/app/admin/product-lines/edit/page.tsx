'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, ArrowLeft, Upload, X } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
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
  background_color: string;
}

interface EditingField {
  lineId: string;
  field: 'title' | 'slug';
}

export default function VisualProductLineEditor() {
  const router = useRouter();
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredLines = selectedCategory === 'all'
    ? productLines
    : productLines.filter((line) => line.category_id === selectedCategory);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProductLines((items) => {
        const filtered = items.filter((item) =>
          selectedCategory === 'all' || item.category_id === selectedCategory
        );

        const oldIndex = filtered.findIndex((item) => item.id === active.id);
        const newIndex = filtered.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(filtered, oldIndex, newIndex);

        // Update display_order
        const updated = reordered.map((line, idx) => ({
          ...line,
          display_order: idx + 1,
        }));

        // Merge back with other categories
        const otherCategories = items.filter((item) =>
          selectedCategory !== 'all' && item.category_id !== selectedCategory
        );

        setHasChanges(true);
        return [...otherCategories, ...updated];
      });
    }
  }

  function updateProductLine(id: string, field: keyof ProductLine, value: string) {
    setProductLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
    setHasChanges(true);
  }

  async function handleLogoUpload(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        updateProductLine(id, 'logo_path', data.url);
        showToast('Logo uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      showToast('Failed to upload logo', 'error');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all(
        productLines.map((line) =>
          fetch(`/api/product-lines/${line.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category_id: line.category_id,
              title: line.title,
              slug: line.slug,
              logo_path: line.logo_path,
              display_order: line.display_order,
            }),
          })
        )
      );

      showToast('All changes saved successfully!', 'success');
      setHasChanges(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving product lines:', error);
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading product lines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.back()}
                className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-5xl font-black text-gray-900 mb-2">Visual Product Line Editor</h1>
                <p className="text-xl text-gray-600">
                  Drag to reorder • Click to edit • Upload logos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {hasChanges && (
                <div className="px-6 py-3 bg-yellow-100 text-yellow-800 rounded-2xl font-bold border-2 border-yellow-200">
                  Unsaved Changes
                </div>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                <Save className="w-6 h-6" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full max-w-md px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white cursor-pointer font-semibold"
            >
              <option value="all">All Categories ({productLines.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.code} - {cat.title} ({productLines.filter((l) => l.category_id === cat.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag and Drop List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredLines.map((l) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {filteredLines.map((line) => {
                const category = categories.find((c) => c.id === line.category_id);
                return (
                  <SortableProductLineCard
                    key={line.id}
                    productLine={line}
                    category={category}
                    onUpdate={updateProductLine}
                    onLogoUpload={handleLogoUpload}
                    editingField={editingField}
                    setEditingField={setEditingField}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {filteredLines.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-20 text-center border-2 border-gray-100">
            <p className="text-2xl text-gray-500">No product lines in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableProductLineCard({
  productLine,
  category,
  onUpdate,
  onLogoUpload,
  editingField,
  setEditingField,
}: {
  productLine: ProductLine;
  category: Category | undefined;
  onUpdate: (id: string, field: keyof ProductLine, value: string) => void;
  onLogoUpload: (id: string, file: File) => void;
  editingField: EditingField | null;
  setEditingField: (field: EditingField | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: productLine.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = (field: string) =>
    editingField?.lineId === productLine.id && editingField?.field === field;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-purple-200"
    >
      <div className="flex items-center gap-6 p-8">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <GripVertical className="w-8 h-8 text-gray-600" />
        </div>

        {/* Order Badge */}
        <div className="flex-shrink-0">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ backgroundColor: category?.background_color || '#6B7280' }}
          >
            <span className="text-3xl font-black text-white">#{productLine.display_order}</span>
          </div>
        </div>

        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-200 relative group">
            {productLine.logo_path ? (
              <>
                <Image
                  src={productLine.logo_path}
                  alt={productLine.title}
                  width={150}
                  height={150}
                  className="object-contain p-4"
                  quality={100}
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onLogoUpload(productLine.id, file);
                    }}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-all">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500 font-semibold">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onLogoUpload(productLine.id, file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Title
            </label>
            {isEditing('title') ? (
              <input
                type="text"
                value={productLine.title}
                onChange={(e) => onUpdate(productLine.id, 'title', e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="w-full px-6 py-4 text-3xl font-black border-2 border-purple-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-200"
              />
            ) : (
              <div
                onClick={() => setEditingField({ lineId: productLine.id, field: 'title' })}
                className="px-6 py-4 text-3xl font-black bg-gray-50 rounded-2xl cursor-pointer hover:bg-purple-50 hover:border-2 hover:border-purple-300 transition-all"
              >
                {productLine.title}
              </div>
            )}
          </div>

          {/* Slug & Category */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Slug
              </label>
              {isEditing('slug') ? (
                <input
                  type="text"
                  value={productLine.slug}
                  onChange={(e) => onUpdate(productLine.id, 'slug', e.target.value.toLowerCase())}
                  onBlur={() => setEditingField(null)}
                  autoFocus
                  className="w-full px-4 py-3 text-lg font-mono border-2 border-purple-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200"
                />
              ) : (
                <div
                  onClick={() => setEditingField({ lineId: productLine.id, field: 'slug' })}
                  className="px-4 py-3 text-lg font-mono bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 hover:border-2 hover:border-purple-300 transition-all"
                >
                  {productLine.slug}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Category
              </label>
              <div
                className="px-4 py-3 rounded-xl text-lg font-bold flex items-center gap-3"
                style={{ backgroundColor: category?.background_color + '20' }}
              >
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: category?.background_color }}
                ></div>
                {category?.code} - {category?.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { GripVertical, Save, X, ArrowLeft, Palette } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Image from 'next/image';

interface Category {
  id: string;
  code: string;
  title: string;
  slug: string;
  background_color: string;
  subtitle: string | null;
  display_order: number;
}

interface EditingField {
  categoryId: string;
  field: 'title' | 'code' | 'subtitle' | 'slug' | 'background_color';
}

export default function VisualCategoryEditor() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(items, oldIndex, newIndex);

        // Update display_order
        const updated = reordered.map((cat, idx) => ({
          ...cat,
          display_order: idx + 1,
        }));

        setHasChanges(true);
        return updated;
      });
    }
  }

  function updateCategory(id: string, field: keyof Category, value: string | number) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
    setHasChanges(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Update all categories with their new display order and data
      await Promise.all(
        categories.map((cat) =>
          fetch(`/api/categories/${cat.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: cat.code,
              title: cat.title,
              slug: cat.slug,
              background_color: cat.background_color,
              subtitle: cat.subtitle,
              display_order: cat.display_order,
            }),
          })
        )
      );

      showToast('All changes saved successfully!', 'success');
      setHasChanges(false);
      await fetchCategories();
    } catch (error) {
      console.error('Error saving categories:', error);
      showToast('Failed to save changes', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.back()}
                className="p-4 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-5xl font-black text-gray-900 mb-2">Visual Category Editor</h1>
                <p className="text-xl text-gray-600">
                  Drag to reorder • Click to edit • Premium quality controls
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
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                <Save className="w-6 h-6" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Drag and Drop List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {categories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  onUpdate={updateCategory}
                  editingField={editingField}
                  setEditingField={setEditingField}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h3>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Drag the grip handle</strong> to reorder categories</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Click any text field</strong> to edit it inline</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Click the color square</strong> to pick a new color</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Click Save</strong> when you&rsquo;re done to apply all changes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SortableCategoryCard({
  category,
  onUpdate,
  editingField,
  setEditingField,
}: {
  category: Category;
  onUpdate: (id: string, field: keyof Category, value: string | number) => void;
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
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = (field: string) =>
    editingField?.categoryId === category.id && editingField?.field === field;

  const logoMap: Record<string, string> = {
    ls: '/logos/brands/ClarifyColor-Edited.png',
    ll: '/logos/brands/StrataColor-Edited.png',
    gl: '/logos/brands/CyphonColor-Edited.png',
    gs: '/logos/brands/SeprumColor-Edited.png',
  };

  const categoryId = category.code.toLowerCase();
  const logoPath = logoMap[categoryId];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200"
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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-black text-white">#{category.display_order}</span>
          </div>
        </div>

        {/* Preview */}
        <div
          className="flex-shrink-0 w-72 h-32 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200"
          style={{ backgroundColor: category.background_color }}
        >
          <div className="h-full flex items-center justify-center px-6">
            {logoPath && (
              <Image
                src={logoPath}
                alt={category.title}
                width={200}
                height={80}
                className="h-16 w-auto brightness-0 invert drop-shadow-lg"
                quality={100}
              />
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Code
            </label>
            {isEditing('code') ? (
              <input
                type="text"
                value={category.code}
                onChange={(e) => onUpdate(category.id, 'code', e.target.value.toUpperCase())}
                onBlur={() => setEditingField(null)}
                autoFocus
                maxLength={2}
                className="w-full px-4 py-3 text-2xl font-black border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            ) : (
              <div
                onClick={() => setEditingField({ categoryId: category.id, field: 'code' })}
                className="px-4 py-3 text-2xl font-black bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
              >
                {category.code}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Title
            </label>
            {isEditing('title') ? (
              <input
                type="text"
                value={category.title}
                onChange={(e) => onUpdate(category.id, 'title', e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="w-full px-4 py-3 text-xl font-bold border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            ) : (
              <div
                onClick={() => setEditingField({ categoryId: category.id, field: 'title' })}
                className="px-4 py-3 text-xl font-bold bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
              >
                {category.title}
              </div>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Subtitle
            </label>
            {isEditing('subtitle') ? (
              <input
                type="text"
                value={category.subtitle || ''}
                onChange={(e) => onUpdate(category.id, 'subtitle', e.target.value)}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="w-full px-4 py-3 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            ) : (
              <div
                onClick={() => setEditingField({ categoryId: category.id, field: 'subtitle' })}
                className="px-4 py-3 text-lg bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
              >
                {category.subtitle || <span className="text-gray-400 italic">Click to add</span>}
              </div>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Slug
            </label>
            {isEditing('slug') ? (
              <input
                type="text"
                value={category.slug}
                onChange={(e) => onUpdate(category.id, 'slug', e.target.value.toLowerCase())}
                onBlur={() => setEditingField(null)}
                autoFocus
                className="w-full px-4 py-3 text-lg font-mono border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            ) : (
              <div
                onClick={() => setEditingField({ categoryId: category.id, field: 'slug' })}
                className="px-4 py-3 text-lg font-mono bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
              >
                {category.slug}
              </div>
            )}
          </div>
        </div>

        {/* Color Picker */}
        <div className="flex-shrink-0">
          <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider text-center">
            <Palette className="w-4 h-4 inline mr-1" />
            Color
          </label>
          <div className="relative">
            <input
              type="color"
              value={category.background_color}
              onChange={(e) => onUpdate(category.id, 'background_color', e.target.value)}
              className="w-24 h-24 rounded-2xl cursor-pointer border-4 border-gray-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl"
              title="Click to change color"
            />
          </div>
          <div className="mt-2 text-center">
            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {category.background_color}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

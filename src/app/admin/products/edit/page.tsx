'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { GripVertical, Save, ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { showToast } from '@/components/ui/Toast';
import Image from 'next/image';

interface Product {
  id: string;
  product_line_id: string;
  name: string;
  slug: string;
  image_path: string | null;
  display_order: number;
}

interface ProductLine {
  id: string;
  title: string;
  category_id: string;
}

export default function VisualProductEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [productLines, setProductLines] = useState<ProductLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>('all');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    try {
      const [productsRes, linesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/product-lines'),
      ]);

      const productsData = await productsRes.json();
      const linesData = await linesRes.json();

      setProducts(productsData.products || []);
      setProductLines(linesData.productLines || []);

      // Set initial filter from URL
      const lineParam = searchParams.get('line');
      if (lineParam) {
        setSelectedLine(lineParam);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = selectedLine === 'all'
    ? products
    : products.filter((p) => p.product_line_id === selectedLine);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProducts((items) => {
        const filtered = items.filter((item) =>
          selectedLine === 'all' || item.product_line_id === selectedLine
        );

        const oldIndex = filtered.findIndex((item) => item.id === active.id);
        const newIndex = filtered.findIndex((item) => item.id === over.id);

        const reordered = arrayMove(filtered, oldIndex, newIndex);

        // Update display_order
        const updated = reordered.map((product, idx) => ({
          ...product,
          display_order: idx + 1,
        }));

        // Merge back with other product lines
        const otherLines = items.filter((item) =>
          selectedLine !== 'all' && item.product_line_id !== selectedLine
        );

        setHasChanges(true);
        return [...otherLines, ...updated];
      });
    }
  }

  function updateProduct(id: string, field: keyof Product, value: string) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
    setHasChanges(true);
  }

  async function handleImageUpload(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        updateProduct(id, 'image_path', data.url);
        showToast('Image uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all(
        products.map((product) =>
          fetch(`/api/products/${product.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: product.name,
              slug: product.slug,
              image_path: product.image_path,
              display_order: product.display_order,
            }),
          })
        )
      );

      showToast('All changes saved successfully!', 'success');
      setHasChanges(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving products:', error);
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
          <p className="text-xl text-gray-600">Loading products...</p>
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
                <h1 className="text-5xl font-black text-gray-900 mb-2">Visual Product Editor</h1>
                <p className="text-xl text-gray-600">
                  Drag to reorder • Click to edit • Upload images
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
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                <Save className="w-6 h-6" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>

          {/* Product Line Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider">
              Filter by Product Line
            </label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full max-w-md px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white cursor-pointer font-semibold"
            >
              <option value="all">All Product Lines ({products.length})</option>
              {productLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.title} ({products.filter((p) => p.product_line_id === line.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag and Drop List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const productLine = productLines.find((l) => l.id === product.product_line_id);
                return (
                  <SortableProductCard
                    key={product.id}
                    product={product}
                    productLine={productLine}
                    onUpdate={updateProduct}
                    onImageUpload={handleImageUpload}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-20 text-center border-2 border-gray-100">
            <p className="text-2xl text-gray-500">No products in this product line</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableProductCard({
  product,
  productLine,
  onUpdate,
  onImageUpload,
}: {
  product: Product;
  productLine: ProductLine | undefined;
  onUpdate: (id: string, field: keyof Product, value: string) => void;
  onImageUpload: (id: string, file: File) => void;
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-black text-white">#{product.display_order}</span>
          </div>
        </div>

        {/* Image */}
        <div className="flex-shrink-0">
          <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-gray-200 relative group">
            {product.image_path ? (
              <>
                <Image
                  src={product.image_path}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain p-4"
                  quality={100}
                />
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                  <Upload className="w-10 h-10 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onImageUpload(product.id, file);
                    }}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center hover:bg-gray-100 transition-all">
                <Upload className="w-16 h-16 text-gray-400 mb-3" />
                <span className="text-sm text-gray-500 font-semibold">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(product.id, file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex-1 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Product Name
            </label>
            {isEditingName ? (
              <input
                type="text"
                value={product.name}
                onChange={(e) => onUpdate(product.id, 'name', e.target.value)}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className="w-full px-6 py-4 text-3xl font-black border-2 border-blue-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200"
              />
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="px-6 py-4 text-3xl font-black bg-gray-50 rounded-2xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
              >
                {product.name}
              </div>
            )}
          </div>

          {/* Slug & Product Line */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Slug
              </label>
              {isEditingSlug ? (
                <input
                  type="text"
                  value={product.slug}
                  onChange={(e) => onUpdate(product.id, 'slug', e.target.value.toLowerCase())}
                  onBlur={() => setIsEditingSlug(false)}
                  autoFocus
                  className="w-full px-4 py-3 text-lg font-mono border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
                />
              ) : (
                <div
                  onClick={() => setIsEditingSlug(true)}
                  className="px-4 py-3 text-lg font-mono bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-2 hover:border-blue-300 transition-all"
                >
                  {product.slug}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                Product Line
              </label>
              <div className="px-4 py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                {productLine?.title || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

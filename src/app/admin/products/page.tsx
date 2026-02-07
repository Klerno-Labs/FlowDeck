'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Search, Loader2, Package, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsModal } from '@/components/ui/KeyboardShortcutsModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  image_path?: string;
  display_order: number;
  product_line_id: string;
}

export default function ProductsAdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 'k',
      ctrl: true,
      description: 'Focus search bar',
      action: () => searchInputRef.current?.focus(),
    },
    {
      key: 'n',
      ctrl: true,
      description: 'Create new product',
      action: () => router.push('/admin/products/new'),
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Go to dashboard',
      action: () => router.push('/admin'),
    },
  ];

  useKeyboardShortcuts(shortcuts);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-xl text-gray-600">
            {products.length} total products • {filteredProducts.length} shown
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/products/edit"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all text-lg font-bold shadow-lg shadow-blue-500/30 active:scale-95 touch-manipulation"
          >
            <Sparkles className="w-6 h-6" />
            Visual Editor
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all text-lg font-bold shadow-lg shadow-blue-500/30 active:scale-95 touch-manipulation"
          >
            <Plus className="w-6 h-6" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Search Bar - iPad Optimized */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products by name or slug... (Ctrl+K)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 p-20 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">
            {searchTerm ? 'No products found matching your search.' : 'No products yet. Add your first product to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 active:scale-95 touch-manipulation"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 group-hover:bg-blue-50 transition-colors">
                {product.image_path ? (
                  <Image
                    src={product.image_path}
                    alt={product.name}
                    width={150}
                    height={150}
                    className="object-contain h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5 border-t-2 border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{product.slug}</span>
                  <span className="text-xs">#{product.display_order}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  <Edit className="w-4 h-4" />
                  <span>Edit Product</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <KeyboardShortcutsModal shortcuts={shortcuts} />
    </div>
  );
}

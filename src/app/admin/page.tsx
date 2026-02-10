import Link from 'next/link';
import { Package, Layers, FolderTree, ArrowRight, TrendingUp, Clock, Users, Sparkles, FileText, BookOpen } from 'lucide-react';
import { AdminFlowDeckPage } from '@/components/layout/AdminFlowDeckPage';

export default async function AdminDashboard() {
  // Fetch quick stats
  const [productsRes, categoriesRes, linesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/products`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/categories`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/product-lines`, { cache: 'no-store' }),
  ]).catch(() => [null, null, null]);

  const products = productsRes ? await productsRes.json().catch(() => ({ products: [] })) : { products: [] };
  const categories = categoriesRes ? await categoriesRes.json().catch(() => ({ categories: [] })) : { categories: [] };
  const productLines = linesRes ? await linesRes.json().catch(() => ({ productLines: [] })) : { productLines: [] };
  const quickLinks = [
    {
      title: 'Page Builder',
      description: 'Elite drag-and-drop editor for all presentation pages',
      href: '/admin/page-builder',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-pink-600 to-purple-600',
      shadow: 'shadow-purple-500/50',
      featured: true,
    },
    {
      title: 'Content Editor',
      description: 'Edit intro slides and knowledge base content',
      href: '/admin/content-editor/intro',
      icon: FileText,
      color: 'bg-cyan-600',
      shadow: 'shadow-cyan-500/30',
    },
    {
      title: 'Products',
      description: 'Manage all products and their specifications',
      href: '/admin/products',
      icon: Package,
      color: 'bg-blue-600',
      shadow: 'shadow-blue-500/30',
    },
    {
      title: 'Categories',
      description: 'Manage product categories (LS, LL, GL, GS)',
      href: '/admin/categories',
      icon: Layers,
      color: 'bg-green-600',
      shadow: 'shadow-green-500/30',
    },
    {
      title: 'Product Lines',
      description: 'Manage product lines (Clarify, Sieva, etc.)',
      href: '/admin/product-lines',
      icon: FolderTree,
      color: 'bg-purple-600',
      shadow: 'shadow-purple-500/30',
    },
  ];

  const stats = [
    {
      title: 'Total Products',
      value: products.products?.length || 0,
      icon: Package,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Categories',
      value: categories.categories?.length || 0,
      icon: Layers,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Product Lines',
      value: productLines.productLines?.length || 0,
      icon: FolderTree,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <AdminFlowDeckPage
      title="Content Management"
      subtitle="All changes sync instantly across all connected devices"
      showHome={true}
      showBack={false}
    >
      <div className="max-w-7xl mx-auto">

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                  <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access Cards - iPad Optimized */}
      <div className="grid grid-cols-3 gap-8 mb-10">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          const count = link.title === 'Products' ? products.products?.length || 0 :
                       link.title === 'Categories' ? categories.categories?.length || 0 :
                       link.title === 'Product Lines' ? productLines.productLines?.length || 0 :
                       null;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 active:scale-95 touch-manipulation ${
                link.featured
                  ? 'col-span-3 border-purple-300 hover:border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              {link.featured && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  ✨ NEW
                </div>
              )}
              <div className={`relative ${link.featured ? 'p-10 flex items-center gap-8' : 'p-8'}`}>
                {/* Icon with Count Badge */}
                <div className="relative inline-block mb-6">
                  <div className={`inline-flex items-center justify-center ${link.featured ? 'w-24 h-24' : 'w-20 h-20'} rounded-2xl ${link.color} ${link.shadow} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`${link.featured ? 'w-12 h-12' : 'w-10 h-10'} text-white`} />
                  </div>
                  {count !== null && (
                    <div className="absolute -top-2 -right-2 bg-white border-2 border-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  )}
                </div>

                <div className={link.featured ? 'flex-1' : ''}>
                  {/* Content */}
                  <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors ${link.featured ? 'text-4xl' : 'text-2xl'}`}>
                    {link.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed mb-4 ${link.featured ? 'text-xl' : 'text-base'}`}>
                    {link.description}
                  </p>

                  {/* Arrow */}
                  <div className={`flex items-center font-semibold ${link.featured ? 'text-purple-600' : 'text-blue-600'}`}>
                    <span className={link.featured ? 'text-base' : 'text-sm'}>
                      {link.featured ? 'Open Elite Editor' : 'Manage'}
                    </span>
                    <ArrowRight className={`${link.featured ? 'w-6 h-6' : 'w-5 h-5'} ml-2 group-hover:translate-x-2 transition-transform`} />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Tips Section */}
      <div className="bg-amber-50 rounded-3xl shadow-lg border-2 border-amber-100 p-8 mb-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Tips for Efficient Editing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-gray-700">Use the search bar to quickly find products by name or slug</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">Changes save automatically and sync within 5 seconds</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">Display order numbers control the sort position (lower = earlier)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-gray-700">Images are stored in cloud CDN for fast loading everywhere</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-blue-600 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            How Real-Time Editing Works
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">✓ Universal Access</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                All authenticated users (dev, admin, sales) can edit content without restrictions
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">⚡ Instant Sync</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Changes appear for all users within 5 seconds via real-time polling mechanism
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">☁️ Cloud Storage</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Product images stored in Vercel Blob with CDN delivery for optimal performance
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-3">📝 Change Tracking</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                All edits are logged in the database with timestamp and user attribution
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AdminFlowDeckPage>
  );
}

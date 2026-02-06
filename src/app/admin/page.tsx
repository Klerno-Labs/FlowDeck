import Link from 'next/link';
import { Package, Layers, Tag, FolderTree } from 'lucide-react';

export default function AdminDashboard() {
  const quickLinks = [
    {
      title: 'Products',
      description: 'Manage all products and their specifications',
      href: '/admin/products',
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      description: 'Manage product categories (LS, LL, GL, GS)',
      href: '/admin/categories',
      icon: Layers,
      color: 'bg-green-500',
    },
    {
      title: 'Product Lines',
      description: 'Manage product lines (Clarify, Sieva, etc.)',
      href: '/admin/product-lines',
      icon: FolderTree,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your FlowDeck content. All changes are saved immediately and visible to all users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`${link.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">
          How Editing Works
        </h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• All authenticated users can edit content</li>
          <li>• Changes are saved immediately to the database</li>
          <li>• Updates appear for all users within 5-10 seconds</li>
          <li>• Product images are stored in Vercel Blob storage</li>
          <li>• All changes are tracked for auditing</li>
        </ul>
      </div>
    </div>
  );
}

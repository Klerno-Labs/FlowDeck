/**
 * Navigation Routes
 * Simple routing table for back button destinations
 * Maps each page to where its back button should navigate
 */

export const ADMIN_ROUTES = {
  // Dashboard
  '/admin': '/home',

  // Categories
  '/admin/categories': '/admin',
  '/admin/categories/new': '/admin/categories',
  '/admin/categories/edit': '/admin/categories',

  // Products
  '/admin/products': '/admin',
  '/admin/products/new': '/admin/products',
  '/admin/products/edit': '/admin/products',

  // Product Lines
  '/admin/product-lines': '/admin',
  '/admin/product-lines/new': '/admin/product-lines',
  '/admin/product-lines/edit': '/admin/product-lines',

  // Users
  '/admin/users': '/admin',
  '/admin/users/new': '/admin/users',
  '/admin/users/edit': '/admin/users',

  // Content Editor
  '/admin/content-editor': '/admin',
  '/admin/content-editor/intro': '/admin/content-editor',
  '/admin/content-editor/knowledge-base': '/admin/content-editor',
  '/admin/content-editor/products': '/admin/content-editor',
} as const;

export const PRESENTATION_ROUTES = {
  // Home
  '/home': null, // No back button on home

  // Intro Presentation
  '/intro-presentation': '/home',
  '/intro-presentation/what-we-guarantee': '/intro-presentation',

  // Products
  '/products': '/home',
  '/products/liquid-solid': '/products',
  '/products/liquid-liquid': '/products',
  '/products/gas-liquid': '/products',
  '/products/gas-solid': '/products',

  // Knowledge Base
  '/knowledge-base': '/home',
} as const;

/**
 * Get the back destination for a given route
 * Returns null if no back button should be shown
 */
export function getBackRoute(currentPath: string): string | null {
  // Check admin routes first
  if (currentPath in ADMIN_ROUTES) {
    return ADMIN_ROUTES[currentPath as keyof typeof ADMIN_ROUTES];
  }

  // Check presentation routes
  if (currentPath in PRESENTATION_ROUTES) {
    return PRESENTATION_ROUTES[currentPath as keyof typeof PRESENTATION_ROUTES];
  }

  // Handle dynamic routes (e.g., /admin/products/edit/[id])
  if (currentPath.startsWith('/admin/products/edit/')) {
    return '/admin/products';
  }
  if (currentPath.startsWith('/admin/categories/edit/')) {
    return '/admin/categories';
  }
  if (currentPath.startsWith('/admin/product-lines/edit/')) {
    return '/admin/product-lines';
  }
  if (currentPath.startsWith('/admin/users/edit/')) {
    return '/admin/users';
  }

  // Default: no back button
  return null;
}

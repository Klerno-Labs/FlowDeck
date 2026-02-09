'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export function AdminBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show back button on main admin dashboard
  if (pathname === '/admin') {
    return null;
  }

  const handleBack = () => {
    // If we're deep in a section, try to go to the section's root first
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length > 2) {
      // E.g., /admin/page-builder/something → /admin/page-builder
      router.push('/' + segments.slice(0, 2).join('/'));
    } else {
      // Otherwise go back to admin dashboard
      router.push('/admin');
    }
  };

  return (
    <button
      onClick={handleBack}
      className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all touch-manipulation group"
      title="Go Back"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
    </button>
  );
}

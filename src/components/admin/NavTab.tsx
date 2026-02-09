'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavTabProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function NavTab({ href, icon, label }: NavTabProps) {
  const pathname = usePathname();

  // Check if this tab is active
  // Exact match for /admin, prefix match for other routes
  const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-sm transition-all border active:scale-95 touch-manipulation ${
        isActive
          ? 'bg-white text-blue-600 border-white shadow-lg'
          : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white'
      }`}
    >
      <span className={isActive ? 'text-blue-600' : 'text-white/90'}>{icon}</span>
      <span className="text-sm font-bold tracking-wide">{label}</span>
    </Link>
  );
}

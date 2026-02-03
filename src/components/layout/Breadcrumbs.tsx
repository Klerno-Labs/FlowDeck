'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 py-4 px-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-ftc-blue transition-colors uppercase font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 uppercase font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
    </nav>
  );
}

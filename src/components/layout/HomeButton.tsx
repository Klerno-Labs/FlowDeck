'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

export function HomeButton() {
  return (
    <Link
      href="/home"
      className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full bg-ftc-gray-200 hover:bg-ftc-gray-300 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg"
      aria-label="Go to home"
    >
      <Home className="w-6 h-6 text-ftc-gray-700" />
    </Link>
  );
}

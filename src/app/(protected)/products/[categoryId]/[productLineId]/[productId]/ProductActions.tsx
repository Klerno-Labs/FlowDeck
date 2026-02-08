'use client';

import Link from 'next/link';
import { Home, Download, Mail, ArrowLeft } from 'lucide-react';

interface ProductActionsProps {
  bgColor: string;
  categoryId: string;
  productLineId: string;
}

export default function ProductActions({ bgColor, categoryId, productLineId }: ProductActionsProps) {
  // Extract hex color from Tailwind class
  const hexColor = bgColor.replace('bg-[', '').replace(']', '');

  return (
    <div className="absolute bottom-8 right-8 z-10 flex items-center gap-4">
      <Link
        href={`/products/${categoryId}/${productLineId}`}
        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
        aria-label="Back to products"
      >
        <ArrowLeft className="w-6 h-6" style={{ color: hexColor }} />
      </Link>
      <button
        onClick={() => {/* PDF download functionality */}}
        className="px-6 py-3 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all flex items-center gap-3"
        aria-label="Download PDF"
      >
        <Download className="w-5 h-5" style={{ color: hexColor }} />
        <span className="font-bold text-sm" style={{ color: hexColor }}>PDF</span>
      </button>
      <button
        onClick={() => {/* Email functionality */}}
        className="px-6 py-3 rounded-xl bg-white/90 hover:bg-white shadow-lg transition-all flex items-center gap-3"
        aria-label="Email Content"
      >
        <Mail className="w-5 h-5" style={{ color: hexColor }} />
        <span className="font-bold text-sm" style={{ color: hexColor }}>Email</span>
      </button>
      <Link
        href="/home"
        className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center"
        aria-label="Home"
      >
        <Home className="w-6 h-6" style={{ color: hexColor }} />
      </Link>
    </div>
  );
}

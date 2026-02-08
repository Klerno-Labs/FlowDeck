'use client';

import Link from 'next/link';
import { Home, Download, Mail, ArrowLeft } from 'lucide-react';

interface ProductActionsProps {
  bgColor: string;
  categoryId: string;
  productLineId: string;
}

export default function ProductActions({ bgColor, categoryId, productLineId }: ProductActionsProps) {
  return (
    <div className="absolute top-8 right-8 z-10 flex items-center gap-4">
      <Link
        href={`/products/${categoryId}/${productLineId}`}
        className="w-14 h-14 rounded-full bg-gray-900/95 hover:bg-gray-900 shadow-2xl ring-2 ring-white/20 transition-all flex items-center justify-center"
        aria-label="Back to products"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      <button
        onClick={() => {/* PDF download functionality */}}
        className="px-5 py-2.5 rounded-xl bg-gray-900/95 hover:bg-gray-900 shadow-2xl ring-2 ring-white/20 transition-all flex items-center gap-2"
        aria-label="Download PDF"
      >
        <Download className="w-4 h-4 text-white" />
        <span className="font-bold text-xs text-white">PDF</span>
      </button>
      <button
        onClick={() => {/* Email functionality */}}
        className="px-5 py-2.5 rounded-xl bg-gray-900/95 hover:bg-gray-900 shadow-2xl ring-2 ring-white/20 transition-all flex items-center gap-2"
        aria-label="Email Content"
      >
        <Mail className="w-4 h-4 text-white" />
        <span className="font-bold text-xs text-white">Email</span>
      </button>
      <Link
        href="/home"
        className="w-14 h-14 rounded-full bg-gray-900/95 hover:bg-gray-900 shadow-2xl ring-2 ring-white/20 transition-all flex items-center justify-center"
        aria-label="Home"
      >
        <Home className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}

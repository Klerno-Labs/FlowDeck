'use client';

import { Loader2 } from 'lucide-react';

// Full page loading
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="text-center">
        <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment...</p>
      </div>
    </div>
  );
}

// Section/Card loading
export function SectionLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-12 bg-white rounded-lg border border-gray-200">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
}

// Inline loading (for buttons, etc.)
export function InlineLoader({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />;
}

// Skeleton loaders for content
export function SkeletonLoader({
  type = 'text',
  count = 1,
}: {
  type?: 'text' | 'card' | 'image' | 'circle';
  count?: number;
}) {
  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'circle') {
    return (
      <div className="flex gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  return null;
}

// Progress bar
export function ProgressBar({ progress, label }: { progress: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
    </div>
  );
}

// Shimmer effect (alternative to pulse)
export function ShimmerLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </div>
  );
}

// Spinner variants
export function SpinnerDots() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
    </div>
  );
}

// Add to global CSS:
// @keyframes shimmer {
//   100% {
//     transform: translateX(100%);
//   }
// }

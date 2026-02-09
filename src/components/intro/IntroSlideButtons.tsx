'use client';

import { useRouter } from 'next/navigation';
import { Mail, ChevronRight } from 'lucide-react';

interface IntroSlideButtonsProps {
  nextPage?: string;
}

export function IntroSlideButtons({ nextPage }: IntroSlideButtonsProps) {
  const router = useRouter();

  return (
    <div className="absolute top-8 right-8 flex gap-3 z-30">
      <button
        onClick={() => router.push('/home')}
        className="w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 transition-all flex items-center justify-center touch-manipulation"
        aria-label="Home"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
      <button
        onClick={() => {/* Email functionality */}}
        className="w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 transition-all flex items-center justify-center touch-manipulation"
        aria-label="Email"
      >
        <Mail className="w-6 h-6 text-white" />
      </button>
      {nextPage && (
        <button
          onClick={() => router.push(nextPage)}
          className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 transition-all flex items-center justify-center touch-manipulation"
          aria-label="Next page"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

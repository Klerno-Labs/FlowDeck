'use client';

import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButton {
  type: 'home' | 'back' | 'custom';
  onClick?: () => void;
  label?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface FlowDeckNavigationProps {
  /** Show home button (default: true) */
  showHome?: boolean;
  /** Show back button (default: false) */
  showBack?: boolean;
  /** Back button destination (default: router.back()) */
  backTo?: string;
  /** Custom buttons to add */
  customButtons?: NavigationButton[];
  /** Pagination dots for carousels */
  showDots?: boolean;
  /** Current slide index (for dots) */
  currentSlide?: number;
  /** Total number of slides (for dots) */
  totalSlides?: number;
  /** Callback when dot is clicked */
  onDotClick?: (index: number) => void;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Callback for previous button */
  onPrevious?: () => void;
  /** Callback for next button */
  onNext?: () => void;
  /** Disable previous button */
  disablePrevious?: boolean;
  /** Disable next button */
  disableNext?: boolean;
}

/**
 * FlowDeck Navigation Component
 * Provides consistent navigation across all FlowDeck pages
 * - Home button (bottom-right by default)
 * - Back button (top-left when enabled)
 * - Pagination dots (top-right when carousel enabled)
 * - Previous/Next arrows (sides when enabled)
 */
export function FlowDeckNavigation({
  showHome = true,
  showBack = false,
  backTo,
  customButtons = [],
  showDots = false,
  currentSlide = 0,
  totalSlides = 0,
  onDotClick,
  showPrevNext = false,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}: FlowDeckNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <>
      {/* Back Button - Top Left */}
      {showBack && (
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-30 p-3 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {/* Pagination Dots - Top Right */}
      {showDots && totalSlides > 0 && (
        <div className="absolute top-8 right-8 z-30 flex gap-1">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => onDotClick?.(index)}
              className="p-2 rounded-full transition-all touch-manipulation hover:bg-gray-100 active:bg-gray-200"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide ? 'bg-gray-500' : 'bg-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Home Button - Bottom Right */}
      {showHome && (
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center touch-manipulation"
            aria-label="Home"
          >
            <Home className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Previous Button - Left Side */}
      {showPrevNext && !disablePrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center touch-manipulation"
          aria-label="Previous"
          disabled={disablePrevious}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Next Button - Right Side */}
      {showPrevNext && !disableNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center touch-manipulation"
          aria-label="Next"
          disabled={disableNext}
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Custom Buttons */}
      {customButtons.map((button, index) => (
        <div
          key={index}
          className={`absolute z-30 ${
            button.position === 'top-left'
              ? 'top-4 left-4'
              : button.position === 'top-right'
              ? 'top-4 right-4'
              : button.position === 'bottom-left'
              ? 'bottom-8 left-8'
              : 'bottom-8 right-8'
          }`}
        >
          <button
            onClick={button.onClick}
            className="w-14 h-14 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all flex items-center justify-center touch-manipulation"
            aria-label={button.label || 'Custom action'}
          >
            {/* Add icon based on button type */}
          </button>
        </div>
      ))}
    </>
  );
}

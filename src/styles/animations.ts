/**
 * Smooth animation utilities optimized for 60fps
 * All animations use GPU-accelerated properties (transform, opacity)
 */

// Smooth transitions - use these for interactive elements
export const transitions = {
  // Fast - for hover states and quick feedback
  fast: 'transition-all duration-150 ease-out',

  // Default - for most UI interactions
  default: 'transition-all duration-200 ease-in-out',

  // Smooth - for modals and larger movements
  smooth: 'transition-all duration-300 ease-in-out',

  // Slow - for emphasis and important changes
  slow: 'transition-all duration-500 ease-in-out',
};

// Fade animations
export const fadeIn = {
  initial: 'opacity-0',
  animate: 'opacity-100',
  exit: 'opacity-0',
  transition: transitions.smooth,
};

export const fadeInUp = {
  initial: 'opacity-0 translate-y-4',
  animate: 'opacity-100 translate-y-0',
  exit: 'opacity-0 translate-y-4',
  transition: transitions.smooth,
};

export const fadeInDown = {
  initial: 'opacity-0 -translate-y-4',
  animate: 'opacity-100 translate-y-0',
  exit: 'opacity-0 -translate-y-4',
  transition: transitions.smooth,
};

// Scale animations
export const scaleIn = {
  initial: 'opacity-0 scale-95',
  animate: 'opacity-100 scale-100',
  exit: 'opacity-0 scale-95',
  transition: transitions.smooth,
};

// Slide animations
export const slideInRight = {
  initial: 'translate-x-full',
  animate: 'translate-x-0',
  exit: 'translate-x-full',
  transition: transitions.smooth,
};

export const slideInLeft = {
  initial: '-translate-x-full',
  animate: 'translate-x-0',
  exit: '-translate-x-full',
  transition: transitions.smooth,
};

// Hover effects - optimized for touch
export const hoverEffects = {
  // Lift effect for cards
  lift: 'hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',

  // Glow effect for buttons
  glow: 'hover:shadow-lg hover:brightness-110 active:brightness-90',

  // Subtle scale for icons
  iconScale: 'hover:scale-110 active:scale-95',

  // Opacity for disabled states
  disabled: 'opacity-50 cursor-not-allowed',
};

// Loading animations
export const loadingPulse = 'animate-pulse';
export const loadingSpin = 'animate-spin';
export const loadingBounce = 'animate-bounce';

// Touch feedback - instant visual response
export const touchFeedback = {
  scale: 'active:scale-95',
  opacity: 'active:opacity-70',
  brighten: 'active:brightness-90',
};

// Smooth spring animations (for physics-based feel)
export const spring = {
  // Bouncy spring - playful
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 15,
  },

  // Smooth spring - natural
  smooth: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  },

  // Gentle spring - subtle
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 25,
  },
};

// Staggered children animations
export const staggerChildren = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Focus visible styles (accessibility)
export const focusVisible = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

// Smooth scroll behavior
export const smoothScroll = 'scroll-smooth';

// Backdrop blur effects (for modals)
export const backdropBlur = {
  light: 'backdrop-blur-sm',
  medium: 'backdrop-blur-md',
  strong: 'backdrop-blur-lg',
};

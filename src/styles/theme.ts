/**
 * FTC FlowDeck Design System
 * Refined color palette and design tokens
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main brand color
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Secondary Accent
  secondary: {
    50: '#FCE7F3',
    100: '#FBCFE8',
    200: '#F9A8D4',
    300: '#F472B6',
    400: '#EC4899',
    500: '#DB2777', // Accent color
    600: '#BE185D',
    700: '#9D174D',
    800: '#831843',
    900: '#701A38',
  },

  // Neutrals
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
};

// Refined Gradient Palette (reduced from 15+ to 6 core gradients)
export const gradients = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  secondary: 'bg-gradient-to-r from-pink-500 to-rose-500',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  warning: 'bg-gradient-to-r from-orange-500 to-amber-500',
  neutral: 'bg-gradient-to-r from-gray-600 to-gray-800',
};

// Button Styles
export const buttons = {
  primary: `
    bg-gradient-to-r from-indigo-600 to-purple-600
    hover:from-indigo-700 hover:to-purple-700
    text-white font-medium rounded-lg shadow-lg
    transition-all duration-200
    min-h-[44px] px-5 py-3
  `,
  secondary: `
    bg-white border-2 border-gray-300
    hover:border-gray-400 hover:bg-gray-50
    text-gray-700 font-medium rounded-lg
    transition-all duration-200
    min-h-[44px] px-5 py-3
  `,
  success: `
    bg-gradient-to-r from-emerald-600 to-teal-600
    hover:from-emerald-700 hover:to-teal-700
    text-white font-medium rounded-lg shadow-lg
    transition-all duration-200
    min-h-[44px] px-5 py-3
  `,
  danger: `
    bg-gradient-to-r from-red-600 to-rose-600
    hover:from-red-700 hover:to-rose-700
    text-white font-medium rounded-lg shadow-lg
    transition-all duration-200
    min-h-[44px] px-5 py-3
  `,
  ghost: `
    bg-transparent hover:bg-gray-100
    text-gray-700 font-medium rounded-lg
    transition-all duration-200
    min-h-[44px] px-5 py-3
  `,
};

// Spacing Scale (consistent throughout app)
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

// Border Radius
export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// Typography
export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, sans-serif',
    mono: 'ui-monospace, monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Z-Index Scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Animation Durations
export const transitions = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Category Colors (for products section)
export const categoryColors = {
  liquidSolid: '#F17A2C',
  liquidLiquid: '#00B4D8',
  gasLiquid: '#4169E1',
  gasSolid: '#7AC142',
};

// Helper function to get gradient class
export function getGradient(type: keyof typeof gradients): string {
  return gradients[type];
}

// Helper function to get button class
export function getButtonClass(variant: keyof typeof buttons): string {
  return buttons[variant];
}

// Dark mode colors (for future dark mode support)
export const darkMode = {
  bg: {
    primary: colors.gray[900],
    secondary: colors.gray[800],
    tertiary: colors.gray[700],
  },
  text: {
    primary: colors.gray[50],
    secondary: colors.gray[300],
    tertiary: colors.gray[400],
  },
  border: colors.gray[700],
};

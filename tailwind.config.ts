import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ftc: {
          // Brand colors
          blue: '#1E5AA8',
          cyan: '#00B4D8',
          green: '#8DC63F',
          orange: '#F17A2C',
          lightBlue: '#5B9BD5',

          // Admin colors (NEW - for unified admin UI)
          admin: {
            primary: '#1E5AA8',
            secondary: '#5B9BD5',
            accent: '#00B4D8',
            success: '#8DC63F',
            warning: '#F17A2C',
            danger: '#DC2626',
          },

          // Section colors (for presentation pages)
          intro: '#00B4D8',
          products: {
            ls: '#F17A2C',  // Liquid-Solid
            ll: '#00B4D8',  // Liquid-Liquid
            gl: '#4169E1',  // Gas-Liquid
            gs: '#7AC142',  // Gas-Solid
          },

          // Gray scale
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

          // Semantic colors (surface)
          surface: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      screens: {
        'ipad': '1024px',
        'ipad-air': '1180px',
        'ipad-pro': '1366px',
      },
      aspectRatio: {
        'ipad': '4/3',
        'ipad-pro': '4/3',
      },
      // Button sizing standards (WCAG AAA compliant)
      spacing: {
        '44': '2.75rem',  // Keep existing
        'touch-sm': '2.5rem',   // 40px
        'touch-md': '2.75rem',  // 44px (WCAG AAA minimum)
        'touch-lg': '3rem',     // 48px (primary actions)
        'touch-xl': '3.5rem',   // 56px (hero CTAs)
      },

      // Typography scale
      fontSize: {
        'touch': '1.125rem',  // Keep existing
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-md': ['3rem', { lineHeight: '1.2', fontWeight: '800' }],
        'heading-lg': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-md': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-sm': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },

      // Shadow system
      boxShadow: {
        'touch': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'touch-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'touch-active': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'modal': '0 20px 60px rgba(0, 0, 0, 0.3)',
      },

      // Transition durations
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

import Image from 'next/image';

interface FTCLogoProps {
  /** Position of the logo */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Opacity level */
  opacity?: number;
}

const sizeMap = {
  sm: { width: 60, height: 20, className: 'h-6' },
  md: { width: 100, height: 40, className: 'h-10' },
  lg: { width: 120, height: 40, className: 'h-12' },
};

const positionMap = {
  'top-left': 'absolute top-4 left-4 z-10',
  'top-center': 'absolute top-4 left-1/2 -translate-x-1/2 z-10',
  'top-right': 'absolute top-4 right-4 z-10',
  'bottom-left': 'absolute bottom-6 left-6 z-10',
  'bottom-center': 'absolute bottom-6 left-1/2 -translate-x-1/2 z-10',
  'bottom-right': 'absolute bottom-6 right-6 z-10',
  'center': 'flex justify-center',
};

/**
 * FTC Logo Component
 * Provides consistent FTC branding across all pages
 */
export function FTCLogo({
  position = 'top-center',
  size = 'md',
  className = '',
  opacity = 1,
}: FTCLogoProps) {
  const { width, height, className: sizeClass } = sizeMap[size];
  const positionClass = positionMap[position];

  const opacityClass = opacity < 1 ? `opacity-${Math.round(opacity * 100)}` : '';

  return (
    <div className={`${positionClass} ${className}`}>
      <Image
        src="/logos/ftc/FTC_LogoNotag.png"
        alt="FTC Logo"
        width={width}
        height={height}
        className={`${sizeClass} w-auto ${opacityClass}`}
        priority
      />
    </div>
  );
}

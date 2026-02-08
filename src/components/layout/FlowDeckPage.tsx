'use client';

import { ReactNode } from 'react';
import { FlowDeckTablet } from './FlowDeckTablet';
import { FlowDeckNavigation } from '../navigation/FlowDeckNavigation';
import { FTCLogo } from '../branding/FTCLogo';

export type FlowDeckSection = 'intro' | 'products' | 'knowledge-base';

interface FlowDeckPageProps {
  /** Main content */
  children: ReactNode;
  /** Section type (determines color theme) */
  section: FlowDeckSection;
  /** Show home button */
  showHome?: boolean;
  /** Show back button */
  showBack?: boolean;
  /** Back destination */
  backTo?: string;
  /** Show FTC logo */
  showLogo?: boolean;
  /** Logo position */
  logoPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
  /** Logo size */
  logoSize?: 'sm' | 'md' | 'lg';
  /** Show pagination dots (for carousels) */
  showDots?: boolean;
  /** Current slide index */
  currentSlide?: number;
  /** Total slides */
  totalSlides?: number;
  /** Dot click handler */
  onDotClick?: (index: number) => void;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Previous handler */
  onPrevious?: () => void;
  /** Next handler */
  onNext?: () => void;
  /** Disable previous */
  disablePrevious?: boolean;
  /** Disable next */
  disableNext?: boolean;
  /** Background color override */
  backgroundColor?: string;
}

const sectionColors: Record<FlowDeckSection, string> = {
  'intro': 'bg-cyan-400', // Cyan for intro presentation
  'products': 'bg-white', // White for products (categories have their own colors)
  'knowledge-base': 'bg-white', // White for knowledge base
};

/**
 * FlowDeck Page Wrapper
 * Provides complete, consistent page structure for all FlowDeck sections
 * Handles tablet frame, navigation, logo, and section-specific theming
 *
 * Usage:
 * <FlowDeckPage section="intro" showHome showBack>
 *   <YourContent />
 * </FlowDeckPage>
 */
export function FlowDeckPage({
  children,
  section,
  showHome = true,
  showBack = false,
  backTo,
  showLogo = true,
  logoPosition = 'top-center',
  logoSize = 'md',
  showDots = false,
  currentSlide = 0,
  totalSlides = 0,
  onDotClick,
  showPrevNext = false,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
  backgroundColor,
}: FlowDeckPageProps) {
  const bgColor = backgroundColor || sectionColors[section];

  return (
    <FlowDeckTablet backgroundColor={bgColor}>
      {/* FTC Logo */}
      {showLogo && (
        <FTCLogo
          position={logoPosition}
          size={logoSize}
        />
      )}

      {/* Navigation */}
      <FlowDeckNavigation
        showHome={showHome}
        showBack={showBack}
        backTo={backTo}
        showDots={showDots}
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onDotClick={onDotClick}
        showPrevNext={showPrevNext}
        onPrevious={onPrevious}
        onNext={onNext}
        disablePrevious={disablePrevious}
        disableNext={disableNext}
      />

      {/* Main Content */}
      {children}
    </FlowDeckTablet>
  );
}

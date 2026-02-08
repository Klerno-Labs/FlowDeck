# FlowDeck Component System

## Overview

The FlowDeck app uses a standardized component system to ensure 100% consistency across all three main sections:
- **Intro Presentation** (Cyan theme)
- **Products** (Blue theme)
- **Knowledge Base** (Green theme)

## Core Components

### 1. FlowDeckPage

The main wrapper component that provides complete page structure.

```tsx
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

export default function MyPage() {
  return (
    <FlowDeckPage
      section="knowledge-base"  // 'intro' | 'products' | 'knowledge-base'
      showHome={true}
      showBack={false}
      showLogo={true}
      logoPosition="top-center"
    >
      {/* Your content here */}
    </FlowDeckPage>
  );
}
```

**Props:**
- `section`: Determines color theme (`'intro'` | `'products'` | `'knowledge-base'`)
- `showHome`: Show home button (default: `true`)
- `showBack`: Show back button (default: `false`)
- `backTo`: Custom back destination (default: `router.back()`)
- `showLogo`: Show FTC logo (default: `true`)
- `logoPosition`: Logo placement (default: `'top-center'`)
- `logoSize`: Logo size `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `showDots`: Enable carousel pagination dots
- `currentSlide`: Current slide index
- `totalSlides`: Total number of slides
- `onDotClick`: Callback when dot clicked
- `showPrevNext`: Show arrow navigation
- `onPrevious`: Previous button handler
- `onNext`: Next button handler
- `disablePrevious`: Disable previous button
- `disableNext`: Disable next button
- `backgroundColor`: Override default background color

### 2. FlowDeckTablet

Provides just the tablet frame (use when you need more control).

```tsx
import { FlowDeckTablet } from '@/components/layout/FlowDeckTablet';

<FlowDeckTablet backgroundColor="bg-white">
  {/* Your custom content */}
</FlowDeckTablet>
```

### 3. FlowDeckNavigation

Standalone navigation component (use when not using FlowDeckPage).

```tsx
import { FlowDeckNavigation } from '@/components/navigation/FlowDeckNavigation';

<FlowDeckNavigation
  showHome={true}
  showBack={true}
  backTo="/products"
  showDots={true}
  currentSlide={0}
  totalSlides={3}
  onDotClick={(index) => setSlide(index)}
  showPrevNext={true}
  onPrevious={() => prevSlide()}
  onNext={() => nextSlide()}
  disablePrevious={currentSlide === 0}
  disableNext={currentSlide === totalSlides - 1}
/>
```

### 4. FTCLogo

Branded logo component with flexible positioning.

```tsx
import { FTCLogo } from '@/components/branding/FTCLogo';

<FTCLogo
  position="top-center"  // 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | etc.
  size="md"             // 'sm' | 'md' | 'lg'
  opacity={0.8}        // 0-1
/>
```

## Usage Examples

### Example 1: Simple Page with Navigation

```tsx
'use client';

import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

export default function IntroPage() {
  return (
    <FlowDeckPage
      section="intro"
      showHome={true}
      showBack={false}
    >
      <div className="flex items-center justify-center h-full">
        <h1 className="text-4xl font-bold text-white">Welcome to FTC FlowDeck</h1>
      </div>
    </FlowDeckPage>
  );
}
```

### Example 2: Carousel/Slideshow Page

```tsx
'use client';

import { useState } from 'react';
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

export default function KnowledgeBasePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ['Slide 1', 'Slide 2', 'Slide 3'];

  return (
    <FlowDeckPage
      section="knowledge-base"
      showHome={true}
      showDots={true}
      currentSlide={currentSlide}
      totalSlides={slides.length}
      onDotClick={setCurrentSlide}
      showPrevNext={true}
      onPrevious={() => setCurrentSlide(prev => prev - 1)}
      onNext={() => setCurrentSlide(prev => prev + 1)}
      disablePrevious={currentSlide === 0}
      disableNext={currentSlide === slides.length - 1}
    >
      <div className="flex items-center justify-center h-full">
        <h2 className="text-3xl font-bold">{slides[currentSlide]}</h2>
      </div>
    </FlowDeckPage>
  );
}
```

### Example 3: Products Category Page

```tsx
'use client';

import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

export default function CategoryPage() {
  return (
    <FlowDeckPage
      section="products"
      showHome={true}
      showBack={true}
      backTo="/products"
      backgroundColor="bg-[#F17A2C]"  // Custom category color
    >
      <div className="p-12">
        {/* Product grid */}
      </div>
    </FlowDeckPage>
  );
}
```

## Section Themes

Each section has a default theme color:

| Section         | Color Code | Tailwind Class  | Use Case           |
|----------------|------------|-----------------|--------------------|
| Intro          | #00B4D8    | bg-cyan-400     | Presentations      |
| Products       | N/A        | bg-white        | Product pages*     |
| Knowledge Base | N/A        | bg-white        | Articles/slides    |

*Products section uses category-specific colors:
- Liquid/Solid: `bg-[#F17A2C]` (Orange)
- Liquid/Liquid: `bg-[#00B4D8]` (Cyan)
- Gas/Liquid: `bg-[#4169E1]` (Blue)
- Gas/Solid: `bg-[#7AC142]` (Green)

## Navigation Guidelines

### Touch Targets
All buttons meet WCAG AAA standards:
- Minimum 44px × 44px tap target
- Adequate spacing between buttons
- Clear visual feedback on hover/active states

### Button Positions
- **Home**: Bottom-right (consistent across all pages)
- **Back**: Top-left (when enabled)
- **Pagination Dots**: Top-right (for carousels)
- **Previous/Next**: Left/Right sides (for carousels)

### Accessibility
All components include:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader announcements
- Focus management

## Best Practices

1. **Always use FlowDeckPage** for new pages unless you need custom layout
2. **Consistent navigation**: Use same buttons/positions across similar pages
3. **Section theming**: Use correct `section` prop for consistent colors
4. **Touch-friendly**: Ensure all interactive elements are 44px+
5. **Loading states**: Show loading indicators for async content
6. **Error handling**: Provide clear error messages
7. **Responsive**: Test on iPad (primary device)

## Migration Guide

### Before (Old Pattern)
```tsx
export default function OldPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            <div className="bg-white rounded-[2rem] overflow-hidden h-full relative">
              {/* Navigation buttons */}
              <button onClick={() => router.push('/home')}>
                <Home />
              </button>
              {/* Content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### After (New Pattern)
```tsx
import { FlowDeckPage } from '@/components/layout/FlowDeckPage';

export default function NewPage() {
  return (
    <FlowDeckPage section="products" showHome={true}>
      {/* Content only - navigation handled automatically */}
    </FlowDeckPage>
  );
}
```

**Result**: 90% less boilerplate code, 100% consistency.

## Component Hierarchy

```
FlowDeckPage (Main wrapper)
├── FlowDeckTablet (Frame)
│   ├── FTCLogo (Branding)
│   ├── FlowDeckNavigation (Interactive controls)
│   │   ├── Back Button
│   │   ├── Home Button
│   │   ├── Pagination Dots
│   │   └── Previous/Next Arrows
│   └── children (Your content)
└── Color Bars (Bottom-right decoration)
```

## Testing Checklist

When creating a new page:
- [ ] Uses FlowDeckPage wrapper
- [ ] Correct section theme applied
- [ ] Navigation buttons work correctly
- [ ] Logo displays in correct position
- [ ] Touch targets are 44px+ minimum
- [ ] Tested on iPad resolution
- [ ] Keyboard navigation works
- [ ] Screen reader announces properly
- [ ] Loading/error states handled

## Support

For questions or issues with the component system, see:
- Component source: `src/components/`
- Usage examples: `src/app/(protected)/`
- This documentation: `docs/COMPONENTS.md`

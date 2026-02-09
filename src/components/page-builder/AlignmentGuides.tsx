'use client';

import { PageElement } from '@/types/page-builder';

interface AlignmentGuide {
  type: 'vertical' | 'horizontal';
  position: number;
}

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
}

export function AlignmentGuides({ guides, canvasWidth, canvasHeight, zoom }: AlignmentGuidesProps) {
  return (
    <>
      {guides.map((guide, index) => {
        if (guide.type === 'vertical') {
          return (
            <div
              key={`guide-${index}`}
              className="absolute top-0 bottom-0 w-px bg-blue-500 pointer-events-none z-40"
              style={{
                left: guide.position,
                height: canvasHeight || '100%',
              }}
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-blue-500 blur-sm opacity-50" />
            </div>
          );
        } else {
          return (
            <div
              key={`guide-${index}`}
              className="absolute left-0 right-0 h-px bg-blue-500 pointer-events-none z-40"
              style={{
                top: guide.position,
                width: canvasWidth || '100%',
              }}
            >
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-blue-500 blur-sm opacity-50" />
            </div>
          );
        }
      })}
    </>
  );
}

interface AlignmentDetection {
  guides: AlignmentGuide[];
  snappedPosition: { x: number; y: number };
}

const ALIGNMENT_THRESHOLD = 5; // pixels

/**
 * Safely converts width/height value to a number
 * Handles number | string | undefined types
 */
function toNumber(value: number | string | undefined, fallback: number = 0): number {
  if (value === undefined) return fallback;
  if (typeof value === 'number') return value;
  // Parse string values (e.g., '100', '50%')
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

export function detectAlignments(
  draggingElement: PageElement,
  allElements: PageElement[],
  snapToGrid: boolean,
  gridSize: number = 20
): AlignmentDetection {
  const guides: AlignmentGuide[] = [];
  let snappedX = draggingElement.position.x;
  let snappedY = draggingElement.position.y;

  // Snap to grid if enabled
  if (snapToGrid) {
    snappedX = Math.round(draggingElement.position.x / gridSize) * gridSize;
    snappedY = Math.round(draggingElement.position.y / gridSize) * gridSize;

    return {
      guides: [],
      snappedPosition: { x: snappedX, y: snappedY },
    };
  }

  // Calculate key alignment points for dragging element
  const dragWidth = toNumber(draggingElement.position.width, 100);
  const dragHeight = toNumber(draggingElement.position.height, 100);
  const dragLeft = draggingElement.position.x;
  const dragRight = draggingElement.position.x + dragWidth;
  const dragCenterX = draggingElement.position.x + dragWidth / 2;
  const dragTop = draggingElement.position.y;
  const dragBottom = draggingElement.position.y + dragHeight;
  const dragCenterY = draggingElement.position.y + dragHeight / 2;

  // Check alignments with other elements
  const otherElements = allElements.filter((el) => el.id !== draggingElement.id && el.visible !== false);

  for (const element of otherElements) {
    const elWidth = toNumber(element.position.width, 100);
    const elHeight = toNumber(element.position.height, 100);
    const elLeft = element.position.x;
    const elRight = element.position.x + elWidth;
    const elCenterX = element.position.x + elWidth / 2;
    const elTop = element.position.y;
    const elBottom = element.position.y + elHeight;
    const elCenterY = element.position.y + elHeight / 2;

    // Vertical alignments (X axis)
    // Left edge to left edge
    if (Math.abs(dragLeft - elLeft) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'vertical', position: elLeft });
      snappedX = elLeft;
    }
    // Right edge to right edge
    else if (Math.abs(dragRight - elRight) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'vertical', position: elRight });
      snappedX = elRight - dragWidth;
    }
    // Center to center
    else if (Math.abs(dragCenterX - elCenterX) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'vertical', position: elCenterX });
      snappedX = elCenterX - dragWidth / 2;
    }
    // Left edge to right edge
    else if (Math.abs(dragLeft - elRight) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'vertical', position: elRight });
      snappedX = elRight;
    }
    // Right edge to left edge
    else if (Math.abs(dragRight - elLeft) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'vertical', position: elLeft });
      snappedX = elLeft - dragWidth;
    }

    // Horizontal alignments (Y axis)
    // Top edge to top edge
    if (Math.abs(dragTop - elTop) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'horizontal', position: elTop });
      snappedY = elTop;
    }
    // Bottom edge to bottom edge
    else if (Math.abs(dragBottom - elBottom) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'horizontal', position: elBottom });
      snappedY = elBottom - dragHeight;
    }
    // Center to center
    else if (Math.abs(dragCenterY - elCenterY) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'horizontal', position: elCenterY });
      snappedY = elCenterY - dragHeight / 2;
    }
    // Top edge to bottom edge
    else if (Math.abs(dragTop - elBottom) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'horizontal', position: elBottom });
      snappedY = elBottom;
    }
    // Bottom edge to top edge
    else if (Math.abs(dragBottom - elTop) < ALIGNMENT_THRESHOLD) {
      guides.push({ type: 'horizontal', position: elTop });
      snappedY = elTop - dragHeight;
    }
  }

  // Remove duplicate guides
  const uniqueGuides = guides.filter(
    (guide, index, self) =>
      index === self.findIndex((g) => g.type === guide.type && g.position === guide.position)
  );

  return {
    guides: uniqueGuides,
    snappedPosition: { x: snappedX, y: snappedY },
  };
}

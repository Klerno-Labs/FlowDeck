import { useEffect, useRef, RefObject } from 'react';

interface TouchGesturesOptions {
  onPinchZoom?: (scale: number) => void;
  onTwoFingerPan?: (deltaX: number, deltaY: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export function useTouchGestures(
  elementRef: RefObject<HTMLElement>,
  options: TouchGesturesOptions = {}
) {
  const {
    onPinchZoom,
    onTwoFingerPan,
    minZoom = 0.1,
    maxZoom = 5,
  } = options;

  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const currentZoom = useRef<number>(1);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        // Calculate initial distance for pinch zoom
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        lastTouchDistance.current = distance;

        // Calculate center point for panning
        lastTouchCenter.current = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        // Pinch zoom
        if (onPinchZoom) {
          const distance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
          );

          if (lastTouchDistance.current > 0) {
            const scale = distance / lastTouchDistance.current;
            const newZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom.current * scale));
            currentZoom.current = newZoom;
            onPinchZoom(newZoom);
          }

          lastTouchDistance.current = distance;
        }

        // Two-finger pan
        if (onTwoFingerPan && lastTouchCenter.current) {
          const centerX = (touch1.clientX + touch2.clientX) / 2;
          const centerY = (touch1.clientY + touch2.clientY) / 2;

          const deltaX = centerX - lastTouchCenter.current.x;
          const deltaY = centerY - lastTouchCenter.current.y;

          onTwoFingerPan(deltaX, deltaY);

          lastTouchCenter.current = { x: centerX, y: centerY };
        }
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistance.current = 0;
      lastTouchCenter.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onPinchZoom, onTwoFingerPan, minZoom, maxZoom]);

  return { currentZoom: currentZoom.current };
}

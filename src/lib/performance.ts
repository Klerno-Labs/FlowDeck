/**
 * Performance Optimization Utilities
 * Debounce, throttle, memoization, and other performance helpers
 */

import { useEffect, useRef, useMemo, useCallback, useState, lazy } from 'react';

/**
 * Debounce function - delays execution until after wait time has passed
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function - ensures function is called at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * React hook for debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React hook for throttled value
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Memoize expensive computations with custom equality check
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    maxSize?: number;
    equalityFn?: (a: any, b: any) => boolean;
  }
): T {
  const cache = new Map<string, ReturnType<T>>();
  const { maxSize = 100, equalityFn = (a, b) => JSON.stringify(a) === JSON.stringify(b) } = options || {};

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Implement LRU cache
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Lazy import with retry logic
 */
export function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3
) {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        componentImport()
          .then(resolve)
          .catch((error) => {
            if (retriesLeft === 0) {
              reject(error);
            } else {
              // Wait before retrying
              setTimeout(() => {
                attemptImport(retriesLeft - 1);
              }, 1000);
            }
          });
      };

      attemptImport(retries);
    });
  });
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Measure component render time
 */
export function useRenderTime(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });
}

/**
 * Batch state updates to reduce re-renders
 */
export function useBatchedState<T>(
  initialState: T,
  batchDelay: number = 100
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdate = useRef<T | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setBatchedState = useCallback((value: T | ((prev: T) => T)) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(pendingUpdate.current || state) : value;
    pendingUpdate.current = newValue;

    timeout.current = setTimeout(() => {
      setState(pendingUpdate.current!);
      pendingUpdate.current = null;
    }, batchDelay);
  }, [state, batchDelay]);

  return [state, setBatchedState];
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScroll<T>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
  }
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleEnd = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(visibleStart, visibleEnd).map((item, index) => ({
      item,
      index: visibleStart + index,
      top: (visibleStart + index) * itemHeight,
    })),
    [items, visibleStart, visibleEnd, itemHeight]
  );

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    onScroll: useCallback((e: React.UIEvent<HTMLElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, []),
  };
}

/**
 * Detect slow renders
 */
export function useSlowRenderDetection(threshold: number = 16) {
  const lastRender = useRef(performance.now());

  useEffect(() => {
    const now = performance.now();
    const renderTime = now - lastRender.current;

    if (renderTime > threshold && process.env.NODE_ENV === 'development') {
      console.warn(`[Performance Warning] Slow render detected: ${renderTime.toFixed(2)}ms`);
    }

    lastRender.current = now;
  });
}

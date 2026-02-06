/**
 * Real-time polling hook for product updates
 * Checks for database changes every 5 seconds and refreshes the page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRealtimeProducts(interval: number = 5000) {
  const router = useRouter();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const res = await fetch('/api/products/last-updated');
        const { lastUpdated } = await res.json();

        const cached = localStorage.getItem('products_last_updated');

        if (cached && cached !== lastUpdated) {
          // Data has changed, refresh the page to show new data
          console.log('📦 Products updated, refreshing...');
          router.refresh();
        }

        // Update cached timestamp
        localStorage.setItem('products_last_updated', lastUpdated);
      } catch (error) {
        console.error('Error checking for product updates:', error);
      }
    };

    // Check immediately on mount
    checkForUpdates();

    // Then check every interval
    const timer = setInterval(checkForUpdates, interval);

    return () => clearInterval(timer);
  }, [interval, router]);
}

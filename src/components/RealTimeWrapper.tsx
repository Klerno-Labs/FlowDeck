/**
 * Client component wrapper for real-time product updates
 * Wraps server components to enable polling without making them client components
 */

'use client';

import { useRealtimeProducts } from '@/lib/hooks/useRealtimeProducts';

export default function RealTimeWrapper({ children }: { children: React.ReactNode }) {
  // Poll for updates every 5 seconds
  useRealtimeProducts(5000);

  return <>{children}</>;
}

'use client';

import { Check, RefreshCw, AlertCircle } from 'lucide-react';

interface DraftIndicatorProps {
  status: 'saved' | 'saving' | 'error';
  lastSaved?: Date | null;
  errorMessage?: string;
}

/**
 * Draft Auto-Save Indicator
 * Shows save status and last saved time
 */
export function DraftIndicator({ status, lastSaved, errorMessage }: DraftIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'saving' && (
        <>
          <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
          <span className="text-blue-600 font-medium">Saving draft...</span>
        </>
      )}

      {status === 'saved' && lastSaved && (
        <>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-600">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        </>
      )}

      {status === 'error' && (
        <>
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-red-600 font-medium">
            {errorMessage || 'Failed to save'}
          </span>
        </>
      )}
    </div>
  );
}

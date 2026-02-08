'use client';

import { ReactNode } from 'react';

interface FlowDeckTabletProps {
  children: ReactNode;
  backgroundColor?: string;
}

/**
 * FlowDeck Tablet Frame Component
 * Provides the consistent iPad/tablet frame used across all pages
 */
export function FlowDeckTablet({ children, backgroundColor = 'bg-white' }: FlowDeckTabletProps) {
  return (
    <div className="fixed inset-0 bg-ftc-lightBlue overflow-hidden">
      <div className="h-full w-full flex items-center justify-center p-8">
        {/* Main Tablet Container */}
        <div className="w-full max-w-6xl h-[90vh] relative z-20">
          {/* Tablet Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 h-full">
            {/* Screen */}
            <div className={`${backgroundColor} rounded-[2rem] overflow-hidden h-full relative`}>
              {children}
            </div>
          </div>
        </div>

        {/* Bottom Right Color Bars */}
        <div className="absolute bottom-0 right-0 flex h-12 w-[40vw] max-w-[500px]">
          <div className="flex-1 bg-orange-500"></div>
          <div className="flex-1 bg-blue-700"></div>
          <div className="flex-1 bg-green-500"></div>
          <div className="flex-1 bg-cyan-400"></div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect, memo } from 'react';
import { PageElement } from '@/types/page-builder';

interface ResizableElementProps {
  element: PageElement;
  isSelected: boolean;
  onResize: (elementId: string, newPosition: { x: number; y: number; width: number; height: number }) => void;
  children: React.ReactNode;
}

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export const ResizableElement = memo(function ResizableElement({ element, isSelected, onResize, children }: ResizableElementProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      if (element.locked) return;
      e.stopPropagation();

      setIsResizing(true);
      setResizeHandle(handle);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartSize({
        x: element.position.x,
        y: element.position.y,
        width: element.position.width as number,
        height: element.position.height as number,
      });
      setCurrentSize({
        width: element.position.width as number,
        height: element.position.height as number,
      });
    },
    [element]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;

      let newX = startSize.x;
      let newY = startSize.y;
      let newWidth = startSize.width;
      let newHeight = startSize.height;

      // Calculate new dimensions based on handle
      switch (resizeHandle) {
        case 'nw':
          newX = startSize.x + deltaX;
          newY = startSize.y + deltaY;
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case 'n':
          newY = startSize.y + deltaY;
          newHeight = startSize.height - deltaY;
          break;
        case 'ne':
          newY = startSize.y + deltaY;
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height - deltaY;
          break;
        case 'e':
          newWidth = startSize.width + deltaX;
          break;
        case 'se':
          newWidth = startSize.width + deltaX;
          newHeight = startSize.height + deltaY;
          break;
        case 's':
          newHeight = startSize.height + deltaY;
          break;
        case 'sw':
          newX = startSize.x + deltaX;
          newWidth = startSize.width - deltaX;
          newHeight = startSize.height + deltaY;
          break;
        case 'w':
          newX = startSize.x + deltaX;
          newWidth = startSize.width - deltaX;
          break;
      }

      // Enforce minimum size
      const minSize = 20;
      if (newWidth < minSize) {
        newWidth = minSize;
        if (resizeHandle.includes('w')) {
          newX = startSize.x + startSize.width - minSize;
        }
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        if (resizeHandle.includes('n')) {
          newY = startSize.y + startSize.height - minSize;
        }
      }

      // Maintain aspect ratio if Shift is pressed
      if (e.shiftKey && (resizeHandle === 'nw' || resizeHandle === 'ne' || resizeHandle === 'se' || resizeHandle === 'sw')) {
        const aspectRatio = startSize.width / startSize.height;
        newHeight = newWidth / aspectRatio;

        if (resizeHandle === 'nw' || resizeHandle === 'ne') {
          newY = startSize.y + startSize.height - newHeight;
        }
        if (resizeHandle === 'nw' || resizeHandle === 'sw') {
          newX = startSize.x + startSize.width - newWidth;
        }
      }

      setCurrentSize({ width: newWidth, height: newHeight });

      onResize(element.id, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    },
    [isResizing, resizeHandle, startPos, startSize, element.id, onResize]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // Add event listeners for resize
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const handleCursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize',
    n: 'ns-resize',
    ne: 'nesw-resize',
    e: 'ew-resize',
    se: 'nwse-resize',
    s: 'ns-resize',
    sw: 'nesw-resize',
    w: 'ew-resize',
  };

  return (
    <div className="relative">
      {children}

      {/* Resize Handles - Touch Friendly */}
      {isSelected && !element.locked && (
        <>
          {/* Corner handles */}
          <div
            className="absolute -top-1.5 -left-1.5 p-2 cursor-nwse-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            style={{ cursor: handleCursors.nw }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute -top-1.5 -right-1.5 p-2 cursor-nesw-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            style={{ cursor: handleCursors.ne }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute -bottom-1.5 -right-1.5 p-2 cursor-nwse-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            style={{ cursor: handleCursors.se }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute -bottom-1.5 -left-1.5 p-2 cursor-nesw-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            style={{ cursor: handleCursors.sw }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>

          {/* Edge handles */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 p-2 cursor-ns-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            style={{ cursor: handleCursors.n }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-1.5 p-2 cursor-ew-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            style={{ cursor: handleCursors.e }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 p-2 cursor-ns-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 's')}
            style={{ cursor: handleCursors.s }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 -left-1.5 p-2 cursor-ew-resize hover:scale-110 transition-transform touch-manipulation"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            style={{ cursor: handleCursors.w }}
          >
            <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full" />
          </div>

          {/* Dimension display while resizing */}
          {isResizing && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              {Math.round(currentSize.width)} × {Math.round(currentSize.height)}
            </div>
          )}
        </>
      )}
    </div>
  );
});

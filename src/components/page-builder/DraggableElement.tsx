'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PageElement } from '@/types/page-builder';
import { GripVertical } from 'lucide-react';
import Image from 'next/image';

interface DraggableElementProps {
  element: PageElement;
  isSelected: boolean;
  onClick: () => void;
  zoom: number;
}

export function DraggableElement({ element, isSelected, onClick, zoom }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: element.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: element.position.x,
    top: element.position.y,
    width: element.position.width,
    height: element.position.height,
    ...element.styles,
    opacity: isDragging ? 0.5 : element.styles.opacity || 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute group transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 z-50' : 'hover:ring-1 hover:ring-blue-300'
      } ${element.locked ? 'pointer-events-none opacity-50' : ''}`}
    >
      {/* Drag Handle */}
      {isSelected && !element.locked && (
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-8 left-0 right-0 h-6 bg-blue-500 rounded-t-lg flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Element Content */}
      <div className="w-full h-full pointer-events-none">
        {element.type === 'text' && (
          <p style={{ fontSize: element.styles.fontSize, color: element.styles.color }}>
            {element.content}
          </p>
        )}
        {element.type === 'heading' && (
          <h2 style={{ fontSize: element.styles.fontSize, color: element.styles.color, fontWeight: element.styles.fontWeight }}>
            {element.content}
          </h2>
        )}
        {element.type === 'button' && (
          <button
            className="w-full h-full flex items-center justify-center"
            style={{
              backgroundColor: element.styles.backgroundColor,
              color: element.styles.color,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
              fontWeight: element.styles.fontWeight || 'semibold',
            }}
          >
            {element.content}
          </button>
        )}
        {element.type === 'image' && element.content && (
          element.content.startsWith('http') || element.content.startsWith('/') ? (
            <Image
              src={element.content}
              alt="Element image"
              fill
              className="object-cover"
              style={{ borderRadius: element.styles.borderRadius }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )
        )}
      </div>

      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute -top-6 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {element.type}
        </div>
      )}
    </div>
  );
}

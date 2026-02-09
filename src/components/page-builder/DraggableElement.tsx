'use client';

import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PageElement } from '@/types/page-builder';
import { GripVertical, Star, Circle, Square as SquareIcon, Heart, Sparkles, Link2 } from 'lucide-react';
import Image from 'next/image';

interface DraggableElementProps {
  element: PageElement;
  isSelected: boolean;
  onClick: () => void;
  zoom: number;
}

export const DraggableElement = memo(function DraggableElement({ element, isSelected, onClick, zoom }: DraggableElementProps) {
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
    '--animation-duration': element.styles.animationDuration || '1s',
  } as React.CSSProperties;

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
      } ${element.locked ? 'pointer-events-none opacity-50' : ''} ${
        element.styles.animation ? element.styles.animation : ''
      }`}
    >
      {/* Drag Handle - Touch Friendly */}
      {isSelected && !element.locked && (
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-12 left-0 right-0 h-12 bg-blue-500 rounded-t-lg flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
        >
          <GripVertical className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Element Content */}
      <div className="w-full h-full pointer-events-none">
        {element.type === 'text' && (
          <p style={{
            fontSize: element.styles.fontSize,
            color: element.styles.color,
            textAlign: (element.styles.textAlign || 'left') as React.CSSProperties['textAlign'],
            fontWeight: element.styles.fontWeight,
            fontFamily: element.styles.fontFamily,
            lineHeight: element.styles.lineHeight || '1.5',
            letterSpacing: element.styles.letterSpacing,
            textTransform: element.styles.textTransform as React.CSSProperties['textTransform'],
            textDecoration: element.styles.textDecoration,
            textShadow: element.styles.textShadow,
          }}>
            {element.content}
          </p>
        )}
        {element.type === 'heading' && (
          <h2 style={{
            fontSize: element.styles.fontSize,
            color: element.styles.color,
            fontWeight: element.styles.fontWeight,
            textAlign: (element.styles.textAlign || 'left') as React.CSSProperties['textAlign'],
            fontFamily: element.styles.fontFamily,
            lineHeight: element.styles.lineHeight || '1.2',
            letterSpacing: element.styles.letterSpacing,
            textTransform: element.styles.textTransform as React.CSSProperties['textTransform'],
            textDecoration: element.styles.textDecoration,
            textShadow: element.styles.textShadow,
          }}>
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
              fontWeight: (element.styles.fontWeight || 'semibold') as React.CSSProperties['fontWeight'],
              textAlign: (element.styles.textAlign || 'center') as React.CSSProperties['textAlign'],
              fontFamily: element.styles.fontFamily,
              letterSpacing: element.styles.letterSpacing,
              textTransform: element.styles.textTransform,
              textDecoration: element.styles.textDecoration,
              textShadow: element.styles.textShadow,
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
        {element.type === 'divider' && (
          <div
            className="w-full"
            style={{
              height: element.styles.height || '2px',
              backgroundColor: element.styles.backgroundColor || '#E5E7EB',
              borderRadius: element.styles.borderRadius || '0',
            }}
          />
        )}
        {element.type === 'icon' && (
          <div className="w-full h-full flex items-center justify-center">
            {element.content === 'star' && <Star className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />}
            {element.content === 'circle' && <Circle className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />}
            {element.content === 'square' && <SquareIcon className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />}
            {element.content === 'heart' && <Heart className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />}
            {element.content === 'sparkles' && <Sparkles className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />}
            {!['star', 'circle', 'square', 'heart', 'sparkles'].includes(element.content || '') && (
              <Star className="w-full h-full" style={{ color: element.styles.color || '#000000' }} />
            )}
          </div>
        )}
        {element.type === 'video' && (
          <div className="w-full h-full bg-black flex items-center justify-center">
            {element.content && element.content.includes('youtube') ? (
              <iframe
                src={element.content.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : element.content && element.content.includes('vimeo') ? (
              <iframe
                src={element.content.replace('vimeo.com/', 'player.vimeo.com/video/')}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : element.content ? (
              <video src={element.content} controls className="w-full h-full" />
            ) : (
              <div className="text-white text-sm">No video URL</div>
            )}
          </div>
        )}
        {element.type === 'shape' && (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: element.styles.backgroundColor || '#3B82F6',
              borderRadius: element.content === 'circle' ? '50%' : element.styles.borderRadius || '0',
              border: element.styles.border || 'none',
            }}
          />
        )}
        {element.type === 'container' && (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute -top-6 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {element.type}
        </div>
      )}

      {/* Link Indicator */}
      {element.styles.link && (
        <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link2 className="w-3 h-3" />
          <span>Linked</span>
        </div>
      )}
    </div>
  );
});

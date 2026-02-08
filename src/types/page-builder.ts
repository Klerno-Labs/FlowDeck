/**
 * Page Builder Types
 * Type definitions for the visual page builder system
 */

export type ElementType =
  | 'text'
  | 'heading'
  | 'image'
  | 'button'
  | 'container'
  | 'logo'
  | 'icon';

export interface Position {
  x: number; // pixels from left
  y: number; // pixels from top
  width?: number | string; // e.g., 200 or '50%'
  height?: number | string;
}

export interface ElementStyles {
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  zIndex?: number;
  [key: string]: any;
}

export interface PageElement {
  id: string;
  type: ElementType;
  content: string | null; // Text content or image URL
  position: Position;
  styles: ElementStyles;
  locked?: boolean; // Prevent dragging/editing
  visible?: boolean;
  className?: string; // Additional Tailwind classes
  meta?: {
    [key: string]: any; // Custom metadata
  };
}

export interface PageStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  [key: string]: any;
}

export interface PageConfig {
  elements: PageElement[];
  styles: PageStyles;
  meta?: {
    templateVersion?: string;
    lastEditedBy?: string;
    notes?: string;
  };
}

export interface PageConfigRecord {
  id: string;
  page_key: string;
  page_title: string;
  config: PageConfig;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  published_at?: string;
  published_by?: string;
}

export interface PageConfigHistoryRecord {
  id: string;
  page_config_id: string;
  config: PageConfig;
  version: number;
  created_at: string;
  created_by?: string;
  notes?: string;
}

// Editor state types
export interface EditorState {
  selectedElementId: string | null;
  isDragging: boolean;
  isResizing: boolean;
  zoom: number;
  grid: {
    enabled: boolean;
    size: number;
  };
  history: {
    past: PageConfig[];
    present: PageConfig;
    future: PageConfig[];
  };
}

export interface EditorAction {
  type: 'add' | 'update' | 'delete' | 'move' | 'resize' | 'style';
  elementId?: string;
  element?: Partial<PageElement>;
  position?: Position;
  styles?: ElementStyles;
}

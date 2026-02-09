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
  | 'icon'
  | 'divider'
  | 'video'
  | 'shape';

export interface Position {
  x: number; // pixels from left
  y: number; // pixels from top
  width?: number | string; // e.g., 200 or '50%'
  height?: number | string;
}

export interface ElementStyles {
  backgroundColor?: string;
  backgroundImage?: string; // For gradients
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string; // Font family
  lineHeight?: string; // Line height ratio
  padding?: string;
  paddingTop?: string; // Individual padding sides
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  margin?: string;
  marginTop?: string; // Individual margin sides
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  borderRadius?: string;
  border?: string;
  borderWidth?: string; // Border width
  borderStyle?: string; // Border style: solid, dashed, dotted, double
  borderColor?: string; // Border color
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  rotation?: string; // Rotation angle in degrees
  zIndex?: number;
  textAlign?: string; // Text alignment: left, center, right, justify
  letterSpacing?: string; // Letter spacing (tracking)
  textTransform?: string; // Text transform: uppercase, lowercase, capitalize, none
  textDecoration?: string; // Text decoration: underline, line-through, overline, none
  textShadow?: string; // Text shadow
  animation?: string; // CSS animation name
  animationDuration?: string; // e.g., '1s'
  animationDelay?: string; // e.g., '0.5s'
  animationIterationCount?: string; // e.g., 'infinite' or '1'
  link?: string; // URL for clickable elements
  linkTarget?: '_blank' | '_self'; // Open in new tab or same tab
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

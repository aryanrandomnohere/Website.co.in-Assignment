export const ItemTypes = {
  ELEMENT: 'element',
}

export type ElementType = 'text' | 'image' | 'Description' | 'link';

export interface CanvasElement {
  id: string
  type: ElementType
  content?: string // for text and button
  src?: string // for image
  href?: string // for link
  height?: number
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  textAlign?: 'left' | 'center' | 'right'
  color?: string
}

export interface DragItem {
  type: string
  name: ElementType
}

export interface Cell {
  id: string;
  elementId: string | null;
  backgroundColor?: string;
  borderRadius?: number;
}

export interface Row {
  id: string;
  cells: Cell[];
}

export type SectionId = 'header' | 'body' | 'footer';

export interface Section {
  id: SectionId;
  rows: Row[];
  backgroundColor?: string;
}

export interface Sections {
  header: Section;
  body: Section;
  footer: Section;
}
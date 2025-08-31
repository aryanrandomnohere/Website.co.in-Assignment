import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { CanvasElement, Row, Cell, Sections, SectionId, Section } from './types';

interface StoreState {
  canvasBackgroundColor: string;
  sections: Sections;
  elements: { [id: string]: CanvasElement };
  selectedElement: CanvasElement | null;
  selectedCell: { sectionId: SectionId, rowId: string, cellId: string } | null;
  selectedSection: SectionId | null;
  activePanel: 'properties' | 'sections' | null;
  addRow: (sectionId: SectionId, afterRowId?: string) => void;
  addCell: (sectionId: SectionId, rowId: string) => void;
  deleteCell: (sectionId: SectionId, rowId: string, cellId: string) => void;
  addElementToCell: (sectionId: SectionId, cellId: string, element: Omit<CanvasElement, 'id'>) => void;
  selectElement: (element: CanvasElement | null) => void;
  selectCell: (selection: { sectionId: SectionId, rowId: string, cellId: string } | null) => void;
  selectSection: (sectionId: SectionId | null) => void;
  updateElementProperties: (id: string, properties: Partial<CanvasElement>) => void;
  updateCellProperties: (sectionId: SectionId, rowId: string, cellId: string, properties: Partial<Cell>) => void;
  updateSectionProperties: (sectionId: SectionId, properties: Partial<Section>) => void;
  updateCanvasBackgroundColor: (color: string) => void;
  clearCanvas: () => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  setActivePanel: (panel: 'properties' | 'sections' | null) => void;
}

const initialSections: Sections = {
  header: {
    id: 'header',
    rows: [{ id: `row-${Date.now()}`, cells: [{ id: `cell-${Date.now()}`, elementId: null }] }],
    backgroundColor: '#f3f4f6',
  },
  body: {
    id: 'body',
    rows: [{ id: `row-${Date.now()}`, cells: [{ id: `cell-${Date.now()}`, elementId: null }] }],
    backgroundColor: '#ffffff',
  },
  footer: {
    id: 'footer',
    rows: [{ id: `row-${Date.now()}`, cells: [{ id: `cell-${Date.now()}`, elementId: null }] }],
    backgroundColor: '#f3f4f6',
  },
};

export const useStore = create<StoreState>()(
  temporal(
    persist(
      (set) => ({
        canvasBackgroundColor: '#ffffff',
        sections: initialSections,
        elements: {},
        selectedElement: null,
        selectedCell: null,
        selectedSection: null,
        activePanel: null,
        isPreviewMode: false,
        addRow: (sectionId, afterRowId) =>
          set((state) => {
            const newRow: Row = {
              id: `row-${Date.now()}`,
              cells: [{ id: `cell-${Date.now()}`, elementId: null }],
            };
            const section = state.sections[sectionId];
            const newRows = [...section.rows];
            if (afterRowId) {
              const rowIndex = newRows.findIndex(row => row.id === afterRowId);
              newRows.splice(rowIndex + 1, 0, newRow);
            } else {
              newRows.push(newRow);
            }
            return {
              sections: {
                ...state.sections,
                [sectionId]: { ...section, rows: newRows },
              },
            };
          }),
        addCell: (sectionId, rowId) =>
          set((state) => {
            const section = state.sections[sectionId];
            const newRows = section.rows.map((row) => {
              if (row.id === rowId && row.cells.length < 5) {
                return {
                  ...row,
                  cells: [...row.cells, { id: `cell-${Date.now()}`, elementId: null }],
                };
              }
              return row;
            });
            return {
              sections: {
                ...state.sections,
                [sectionId]: { ...section, rows: newRows },
              },
            };
          }),
        deleteCell: (sectionId, rowId, cellId) =>
          set((state) => {
            let elementsToKeep = { ...state.elements };

            const section = state.sections[sectionId];

            let totalCellsInSection = 0;
            section.rows.forEach(r => {
              totalCellsInSection += r.cells.length;
            });

            const newRows = section.rows.map((row) => {
              if (row.id === rowId) {
                const cellBeingProcessed = row.cells.find(c => c.id === cellId);

                if (cellBeingProcessed?.elementId) {
                  delete elementsToKeep[cellBeingProcessed.elementId];
                }

                const isOnlyCellInRow = row.cells.length === 1;
                const isOnlyCellInEntireSection = totalCellsInSection === 1 && isOnlyCellInRow;

                if (isOnlyCellInEntireSection) {
                  return { ...row, cells: row.cells.map((cell) => {
                    if (cell.id === cellId) {
                      return { ...cell, elementId: null, backgroundColor: undefined, borderRadius: undefined };
                    }
                    return cell;
                  })};
                } else if (isOnlyCellInRow) {
                  return null; // Mark row for deletion
                } else {
                  return { ...row, cells: row.cells.filter((cell) => cell.id !== cellId) };
                }
              }
              return row;
            }).filter(Boolean) as Row[];

            return {
              sections: {
                ...state.sections,
                [sectionId]: { ...state.sections[sectionId], rows: newRows },
              },
              elements: elementsToKeep,
            };
          }),
        addElementToCell: (sectionId, cellId, elementData) =>
          set((state) => {
            const elementId = `${elementData.type}-${Date.now()}`;
            const newElement = { ...elementData, id: elementId };
            const section = state.sections[sectionId];
            const newRows = section.rows.map((row) => ({
              ...row,
              cells: row.cells.map((cell) =>
                cell.id === cellId ? { ...cell, elementId } : cell
              ),
            }));
            return {
              elements: {
                ...state.elements,
                [elementId]: newElement,
              },
              sections: {
                ...state.sections,
                [sectionId]: { ...section, rows: newRows },
              },
            };
          }),
        selectElement: (element) =>
          set((state) => {
            if (!element) {
              return { selectedElement: null, selectedCell: null };
            }

            let foundCell: { sectionId: SectionId, rowId: string, cellId: string } | null = null;

            for (const sectionId in state.sections) {
              const section = state.sections[sectionId as SectionId];
              for (const row of section.rows) {
                for (const cell of row.cells) {
                  if (cell.elementId === element.id) {
                    foundCell = { sectionId: section.id, rowId: row.id, cellId: cell.id };
                    break;
                  }
                }
                if (foundCell) break;
              }
              if (foundCell) break;
            }

            return { selectedElement: element, selectedCell: foundCell, activePanel: 'properties' };
          }),
        selectCell: (selection) => set({ selectedCell: selection, selectedElement: null, selectedSection: null, activePanel: 'properties' }),
        selectSection: (sectionId) => set({ selectedSection: sectionId, selectedElement: null, selectedCell: null, activePanel: 'sections' }),
        updateElementProperties: (id, properties) =>
          set((state) => ({
            elements: {
              ...state.elements,
              [id]: { ...state.elements[id], ...properties },
            },
            selectedElement: state.selectedElement?.id === id ? { ...state.selectedElement, ...properties } : state.selectedElement,
          })),
        updateCellProperties: (sectionId, rowId, cellId, properties) =>
          set((state) => {
            const section = state.sections[sectionId];
            const newRows = section.rows.map((row) =>
              row.id === rowId
                ? {
                    ...row,
                    cells: row.cells.map((cell) =>
                      cell.id === cellId ? { ...cell, ...properties } : cell
                    ),
                  }
                : row
            );
            return {
              sections: {
                ...state.sections,
                [sectionId]: { ...section, rows: newRows },
              },
            };
          }),
        updateSectionProperties: (sectionId, properties) =>
          set((state) => ({
            sections: {
              ...state.sections,
              [sectionId]: {
                ...state.sections[sectionId],
                ...properties,
              },
            },
          })),
        updateCanvasBackgroundColor: (color) => set({ canvasBackgroundColor: color }),
        clearCanvas: () => set({ canvasBackgroundColor: '#ffffff', sections: initialSections, elements: {}, selectedElement: null, selectedCell: null, selectedSection: null, activePanel: null }),
        togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
        setActivePanel: (panel) => set({ activePanel: panel }),
      }),
      {
        name: 'dnd-website-builder-storage',
      }
    )
  )
);

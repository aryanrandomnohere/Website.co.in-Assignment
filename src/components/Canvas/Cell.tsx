import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useStore } from '../../store';
import { ItemTypes, ElementType, SectionId } from '../../types';
import Element from './Element';

interface CellProps {
  cellId: string;
  rowId: string;
  sectionId: SectionId;
}

const Cell: React.FC<CellProps> = ({ cellId, rowId, sectionId }) => {
  const { sections, elements, addElementToCell, deleteCell, selectCell, isPreviewMode } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const row = sections[sectionId].rows.find(r => r.id === rowId);
  const cell = row?.cells.find(c => c.id === cellId);
  const element = cell?.elementId ? elements[cell.elementId] : null;

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.ELEMENT,
    drop: (item: { name: ElementType }) => {
      if (!element) {
        let fontSize = 10;
        if (item.name === 'Title') {
          fontSize = 14;
        }

        addElementToCell(sectionId, cellId, {
          type: item.name,
          content: `New ${item.name}`,
          fontSize: fontSize,
          fontWeight: 'normal',
          textAlign: 'left',
          color: '#000000',
          height: 50,
          src: 'https://via.placeholder.com/100x50',
          href: '#',
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const cellWidth = row ? `calc(${100 / row.cells.length}%)` : '100%';
  
  const cellStyle: React.CSSProperties = {
    width: cellWidth,
    border: isPreviewMode ? '1px solid transparent' : '1px dashed #ccc',
    backgroundColor: isOver ? '#f0f0f0' : cell?.backgroundColor || 'transparent',
    borderRadius: cell?.borderRadius ? `${cell.borderRadius}px` : '0px',
    transition: 'border-color 0.2s',
  };

  return (
    <div 
      ref={drop} 
      className='relative group/cell' 
      style={cellStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => { e.stopPropagation(); selectCell({ sectionId, rowId, cellId }); }}
    >
      {!isPreviewMode && (
        <button 
          onClick={() => deleteCell(sectionId, rowId, cellId)} 
          className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10 cursor-pointer opacity-0 group-hover/cell:opacity-100 transition-opacity'
        >
          X
        </button>
      )}
      {element ? (
        <Element element={element} />
      ) : (
        <div className='flex items-center justify-center h-full text-gray-400'>
          ---
        </div>
      )}
    </div>
  );
};

export default Cell;

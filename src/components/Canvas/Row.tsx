
import React from 'react';
import { useStore } from '../../store';
import { Row as RowType, SectionId } from '../../types';
import Cell from './Cell';

interface RowProps {
  row: RowType;
  sectionId: SectionId;
}

const Row: React.FC<RowProps> = ({ row, sectionId }) => {
  const { addRow, addCell, isPreviewMode } = useStore();

  return (
    <div className='relative w-full flex flex-col items-center group/row mb-4'>
      <>
        <div className='flex w-full items-center flex-wrap md:flex-nowrap'>
          {row.cells.map(cell => (
            <Cell key={cell.id} cellId={cell.id} rowId={row.id} sectionId={sectionId} />
          ))}
          {!isPreviewMode && (
            <div className="flex items-center ml-2 md:hidden md:group-hover/row:flex">
              {row.cells.length < 5 && (
                <button onClick={() => addCell(sectionId, row.id)} className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                  +
                </button>
              )}
            </div>
          )}
        </div>
        {!isPreviewMode && (
  <button onClick={() => addRow(sectionId, row.id)} className='mt-2 w-8 h-8 bg-gray-300 rounded-full self-center md:hidden md:group-hover/row:block'>
    +
  </button>
)}
      </>
    </div>
  );
};

export default Row;



import React from 'react';
import { useStore } from '../../store';
import Row from './Row';
import { SectionId } from '../../types';

const Canvas: React.FC = () => {
  const { sections, selectElement, canvasBackgroundColor, selectSection } = useStore();

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  const renderSection = (sectionId: SectionId) => {
    const section = sections[sectionId];
    return (
      <div key={sectionId} style={{ backgroundColor: section.backgroundColor }} onClick={(e) => { e.stopPropagation(); selectSection(sectionId); }}>
        {section.rows.map(row => (
          <Row key={row.id} row={row} sectionId={sectionId} />
        ))}
      </div>
    );
  };

  return (
    <div
      className='flex-1 h-screen relative overflow-auto p-4'
      data-canvas-container
      onClick={handleCanvasClick}
      style={{ backgroundColor: canvasBackgroundColor }}
    >
      <div className='flex flex-col'>
        {Object.keys(sections).map(sectionId => renderSection(sectionId as SectionId))}
      </div>
    </div>
  );
};

export default Canvas;


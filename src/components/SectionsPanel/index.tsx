
import React from 'react';
import { useStore } from '../../store';
import { SectionId } from '../../types';

interface SectionsPanelProps {
  // Removed onClose prop
}

const SectionsPanel: React.FC<SectionsPanelProps> = ({ onClose }) => {
  const { sections, selectedSection, selectSection, updateSectionProperties, canvasBackgroundColor, updateCanvasBackgroundColor } = useStore();

  const handleColorChange = (sectionId: SectionId, color: string) => {
    updateSectionProperties(sectionId, { backgroundColor: color });
  };

  return (
    <div className="w-full md:w-64 bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Sections</h3>
        <button onClick={() => setActivePanel(null)} className="text-gray-500 hover:text-gray-700">
          X
        </button>
      </div>
      <div className="space-y-4">
        <div className="p-2 rounded bg-white">
          <label className="block text-sm font-medium text-gray-700">Canvas Background</label>
          <input
            type="color"
            value={canvasBackgroundColor}
            onChange={(e) => updateCanvasBackgroundColor(e.target.value)}
            className="w-full h-8 mt-1"
          />
        </div>
        {Object.keys(sections).map((sectionId) => (
          <div
            key={sectionId}
            className={`p-2 rounded cursor-pointer ${
              selectedSection === sectionId ? 'bg-blue-200' : 'bg-white'
            }`}
            onClick={() => selectSection(sectionId as SectionId)}
          >
            <div className="flex items-center justify-between">
              <span className="capitalize">{sectionId}</span>
              <input
                type="color"
                value={sections[sectionId as SectionId].backgroundColor}
                onChange={(e) => handleColorChange(sectionId as SectionId, e.target.value)}
                className="w-8 h-8"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionsPanel;

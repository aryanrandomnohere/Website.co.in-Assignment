
import React from 'react';
import { useStore } from '../../store';

const PropertiesPanel: React.FC = () => {
  const {
    selectedCell,
    updateCellProperties,
    selectedElement,
    updateElementProperties,
    sections,
  } = useStore();

  const getSelectedCellData = () => {
    if (!selectedCell) return null;
    const { sectionId, rowId, cellId } = selectedCell;
    const section = sections[sectionId];
    const row = section.rows.find(r => r.id === rowId);
    const cell = row?.cells.find(c => c.id === cellId);
    return cell;
  };

  const selectedCellData = getSelectedCellData();

  return (
    <div className='w-full md:w-64 h-auto md:h-screen bg-gray-200 p-4 overflow-y-auto'>
      <h2 className='text-lg font-bold mb-4'>Properties</h2>

      {selectedCell && selectedCellData && (
        <div className='mb-4 p-2 border border-gray-300 rounded'>
          <h3 className='text-md font-bold mb-2'>Slot Properties</h3>
          <div className='mb-2'>
            <label className='block text-sm font-medium text-gray-700'>Background Color</label>
            <div className='flex items-center'>
              <input
                type='color'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
                value={selectedCellData.backgroundColor || '#ffffff'}
                onChange={(e) => updateCellProperties(selectedCell.sectionId, selectedCell.rowId, selectedCell.cellId, { backgroundColor: e.target.value })}
              />
              <button onClick={() => updateCellProperties(selectedCell.sectionId, selectedCell.rowId, selectedCell.cellId, { backgroundColor: undefined })} className='ml-2 px-2 py-1 border rounded'>Clear</button>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Border Radius</label>
            <input
              type='number'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={selectedCellData.borderRadius || 0}
              onChange={(e) => updateCellProperties(selectedCell.sectionId, selectedCell.rowId, selectedCell.cellId, { borderRadius: parseInt(e.target.value, 10) })}
            />
          </div>
        </div>
      )}

      {selectedElement && (
        <div className='p-2 border border-gray-300 rounded'>
          <h3 className='text-md font-bold mb-2'>Element Properties</h3>
          {selectedElement.type !== 'image' && (
            <>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Alignment</label>
                <div className='flex items-center mt-1'>
                  <button onClick={() => updateElementProperties(selectedElement.id, { textAlign: 'left' })} className={`px-3 py-1 border rounded-l-md ${selectedElement.textAlign === 'left' ? 'bg-blue-500 text-white' : ''}`}>Left</button>
                  <button onClick={() => updateElementProperties(selectedElement.id, { textAlign: 'center' })} className={`px-3 py-1 border-t border-b ${selectedElement.textAlign === 'center' ? 'bg-blue-500 text-white' : ''}`}>Center</button>
                  <button onClick={() => updateElementProperties(selectedElement.id, { textAlign: 'right' })} className={`px-3 py-1 border rounded-r-md ${selectedElement.textAlign === 'right' ? 'bg-blue-500 text-white' : ''}`}>Right</button>
                </div>
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Text Color</label>
                <input
                  type='color'
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => updateElementProperties(selectedElement.id, { color: e.target.value })}
                  className='mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm'
                />
              </div>
            </>
          )}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700'>Content</label>
            <input
              type='text'
              name='content'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={selectedElement.content || ''}
              onChange={(e) => updateElementProperties(selectedElement.id, { content: e.target.value })}
            />
          </div>
          {(selectedElement.type === 'text' || selectedElement.type === 'Description' || selectedElement.type === 'link') && (
            <>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Font Size</label>
                <input
                  type='number'
                  name='fontSize'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => updateElementProperties(selectedElement.id, { fontSize: parseInt(e.target.value, 10) })}
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Font Weight</label>
                <select
                  name='fontWeight'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                  value={selectedElement.fontWeight || 'normal'}
                  onChange={(e) => updateElementProperties(selectedElement.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                >
                  <option value='normal'>Normal</option>
                  <option value='bold'>Bold</option>
                </select>
              </div>
            </>
          )}
          {selectedElement.type === 'image' && (
            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700'>Image URL</label>
              <input
                type='text'
                name='src'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                value={selectedElement.src || ''}
                onChange={(e) => updateElementProperties(selectedElement.id, { src: e.target.value })}
              />
            </div>
          )}
        </div>
      )}

      {!selectedElement && !selectedCell && (
        <p>Select an item to see its properties</p>
      )}
    </div>
  );
};

export default PropertiesPanel;

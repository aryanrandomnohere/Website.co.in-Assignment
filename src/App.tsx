
import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import SectionsPanel from './components/SectionsPanel';
import { useStore } from './store';

const App = () => {
  const [isSectionsPanelOpen, setIsSectionsPanelOpen] = useState(true);
  const { selectedCell, selectedElement } = useStore();
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);

  useEffect(() => {
    if (selectedCell || selectedElement) {
      setIsPropertiesPanelOpen(true);
    } else {
      setIsPropertiesPanelOpen(false);
    }
  }, [selectedCell, selectedElement]);

  const backend = window.matchMedia('(pointer: coarse)').matches ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className='flex flex-col h-screen'>
        <div className='flex flex-col md:flex-row flex-grow'>
          <div className='w-full md:w-64 md:h-full bg-gray-200 p-4 flex-shrink-0'>
            <Toolbar toggleSectionsPanel={() => setIsSectionsPanelOpen(!isSectionsPanelOpen)} />
          </div>
          <div className='flex-grow h-full overflow-auto'>
            <Canvas />
          </div>
          <div className='w-full md:w-64 md:h-full bg-gray-100 p-4 flex-shrink-0'>
            {isPropertiesPanelOpen && <PropertiesPanel />}
            {isSectionsPanelOpen && <SectionsPanel onClose={() => setIsSectionsPanelOpen(false)} />}
          </div>
        </div>
        <button 
          onClick={() => setIsToolbarOpen(!isToolbarOpen)}
          className='fixed bottom-4 left-4 bg-blue-500 text-white p-4 rounded-full shadow-lg md:hidden'
        >
          Elements
        </button>
      </div>
    </DndProvider>
  );
};

export default App;

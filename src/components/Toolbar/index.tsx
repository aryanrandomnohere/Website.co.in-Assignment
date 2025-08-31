import DraggableElement from '../DraggableElement';
import { useStore } from '../../store';
// import { useStore as useZustandStore } from 'zustand';

interface ToolbarProps {
  // Removed toggleSectionsPanel prop
}

const Toolbar: React.FC<ToolbarProps> = () => {
  const { clearCanvas, isPreviewMode, togglePreviewMode, setActivePanel } = useStore();
  // const { undo, redo } = useZustandStore(useStore.temporal, (state) => ({
  //   undo: state.undo,
  //   redo: state.redo,
  // }));

  return (
    <div className='w-full md:w-64 h-auto md:h-screen bg-gray-200 p-4 flex flex-col'>
      <h2 className='text-lg font-bold mb-4'>Elements</h2>
      <div className='flex flex-row flex-wrap gap-2'>
        <DraggableElement name='text' />
        <DraggableElement name='image' />
        <DraggableElement name='Description' />
        <DraggableElement name='link' />
        <DraggableElement name='Title' />
      </div>
      <div className='mt-8 flex flex-row flex-wrap gap-2 md:flex-col'>
        <h2 className='text-lg font-bold mb-4 w-full'>Actions</h2>
        <button
          onClick={togglePreviewMode}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2 w-auto md:w-full'
        >
          {isPreviewMode ? 'Back to Editing' : 'Preview'}
        </button>
        <button
          onClick={() => setActivePanel('sections')}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-auto md:w-full'
        >
          Sections
        </button>
        {/* <button
          onClick={() => undo()}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-auto md:w-full'
        >
          Undo
        </button>
        <button
          onClick={() => redo()}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 w-auto md:w-full'
        >
          Redo
        </button> */}
        <button
          onClick={clearCanvas}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-auto md:w-full'
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

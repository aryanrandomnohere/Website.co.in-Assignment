import React from 'react'
import { useDrag } from 'react-dnd'
import { ItemTypes, ElementType } from '../../types'

interface DraggableElementProps {
  name: ElementType
}

const DraggableElement: React.FC<DraggableElementProps> = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.ELEMENT,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className='p-2 mb-2 bg-gray-300 cursor-move capitalize'
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {name}
    </div>
  )
}

export default DraggableElement
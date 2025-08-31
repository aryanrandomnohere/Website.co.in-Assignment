import React, { useState, useEffect } from 'react';
import { CanvasElement } from '../../types';
import { useStore } from '../../store';

export default function Element({ element }: { element: CanvasElement }) {
  const { selectedElement, selectElement, updateElementProperties } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);

  useEffect(() => {
    if (selectedElement?.id !== element.id) {
      setIsEditing(false);
    }
  }, [selectedElement, element.id]);

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element);
    if (element.type === 'text' || element.type === 'Description' || element.type === 'link') {
      setIsEditing(true);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleContentBlur = () => {
    setIsEditing(false);
    updateElementProperties(element.id, { content });
  };

  const renderElement = () => {
    if (isEditing) {
      if (element.type === 'text' || element.type === 'link') {
        return <input type="text" value={content} onChange={handleContentChange} onBlur={handleContentBlur} autoFocus className='w-full' />;
      } else if (element.type === 'Description') {
        return <textarea value={content} onChange={handleContentChange} onBlur={handleContentBlur} autoFocus className='w-full' />;
      }
    }

    switch (element.type) {
      case 'text':
        return <p style={{ fontSize: element.fontSize, fontWeight: element.fontWeight }}>{element.content}</p>;
      case 'image':
        return <img src={element.src} style={{ width: '100%', height: 'auto' }} alt={element.content} />;
      case 'Description':
        return <button style={{ fontSize: element.fontSize, fontWeight: element.fontWeight }}>{element.content}</button>;
      case 'link':
        return <a href={element.href} style={{ fontSize: element.fontSize, fontWeight: element.fontWeight }}>{element.content}</a>;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        border: selectedElement?.id === element.id ? '2px solid #3b82f6' : '2px solid transparent',
        padding: '4px',
        borderRadius: '4px',
        width: '100%',
        cursor: isEditing ? 'text' : 'pointer',
        textAlign: element.textAlign || 'left',
        color: element.color || '#000000',
      }}
      onClick={handleElementClick}
    >
      {renderElement()}
    </div>
  );
}


import { useRef, useState } from 'react';

interface DragItem {
  id: string;
  index: number;
}

interface UseMobileDragDropOptions {
  onReorder: (fromIndex: number, toIndex: number) => void;
  items: any[];
}

export const useMobileDragDrop = ({ onReorder, items }: UseMobileDragDropOptions) => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const scrollContainer = useRef<HTMLElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent, id: string, index: number) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    setDraggedItem({ id, index });
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedItem || !touchStartY.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    
    // Calculate which item we're hovering over
    const itemHeight = 80; // Approximate item height
    const newIndex = Math.max(0, Math.min(items.length - 1, 
      draggedItem.index + Math.round(deltaY / itemHeight)
    ));
    
    setDragOverIndex(newIndex);
  };

  const handleTouchEnd = () => {
    if (draggedItem && dragOverIndex !== null && dragOverIndex !== draggedItem.index) {
      onReorder(draggedItem.index, dragOverIndex);
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
    touchStartY.current = null;
  };

  const getDragStyles = (index: number) => {
    if (!draggedItem) return {};
    
    if (index === draggedItem.index) {
      return {
        opacity: 0.5,
        transform: 'scale(1.05)',
        zIndex: 1000,
        transition: 'transform 0.1s ease',
      };
    }
    
    if (dragOverIndex !== null && index === dragOverIndex) {
      return {
        transform: 'translateY(4px)',
        transition: 'transform 0.2s ease',
      };
    }
    
    return {};
  };

  return {
    draggedItem,
    dragOverIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getDragStyles,
  };
};

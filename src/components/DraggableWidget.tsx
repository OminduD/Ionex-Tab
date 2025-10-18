// src/components/DraggableWidget.tsx
// Draggable widget container with free positioning

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WidgetSize } from '../types';

interface Props {
  id: string;
  position: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
  size: WidgetSize;
  children: React.ReactNode;
}

const sizeMap: Record<WidgetSize, { width: number; height: number }> = {
  small: { width: 280, height: 200 },
  medium: { width: 350, height: 300 },
  large: { width: 450, height: 400 },
};

export const DraggableWidget: React.FC<Props> = ({ position, onPositionChange, size, children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const { width, height } = sizeMap[size];

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width,
        height,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_e, info) => {
        setIsDragging(false);
        const newX = Math.max(0, Math.min(window.innerWidth - width, position.x + info.offset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - height, position.y + info.offset.y));
        onPositionChange(newX, newY);
      }}
      className={`widget-glass rounded-2xl p-4 border border-white/10 shadow-2xl hover:shadow-accent/20 transition-shadow ${
        isDragging ? 'scale-105' : ''
      }`}
    >
      {/* Drag Handle */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full mb-2" />
      
      {/* Widget Content */}
      <div className="h-full overflow-hidden pt-4">
        {children}
      </div>
    </motion.div>
  );
};

export default DraggableWidget;

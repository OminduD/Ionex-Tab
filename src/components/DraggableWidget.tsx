// src/components/DraggableWidget.tsx
// Draggable widget container with free positioning

import React, { useRef, useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';

import { WidgetSize } from '../types';

interface Props {
  id: string;
  position: { x: number; y: number };
  onPositionChange: (x: number, y: number) => void;
  size: WidgetSize;
  children: React.ReactNode;
  index?: number; // Added for staggered animation
}

const sizeMap: Record<WidgetSize, { width: number; height: number }> = {
  small: { width: 300, height: 220 },
  medium: { width: 380, height: 320 },
  large: { width: 500, height: 450 },
};

const DraggableWidgetComponent: React.FC<Props> = ({ position, onPositionChange, size, children, index = 0 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const { width, height } = sizeMap[size];

  // Memoize drag handlers to prevent re-renders
  const handleDragStart = useCallback(() => setIsDragging(true), []);
  
  const handleDragEnd = useCallback((_e: any, info: any) => {
    setIsDragging(false);
    const newX = Math.max(0, Math.min(window.innerWidth - width, position.x + info.offset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - height, position.y + info.offset.y));
    onPositionChange(newX, newY);
  }, [position.x, position.y, width, height, onPositionChange]);

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      initial={{ opacity: 0, y: 80, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Cinematic easing curve - more dramatic
        delay: index * 0.15 // Increased stagger for sci-fi effect
      }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width,
        height,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 50 : 10,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`widget-glass glassmorphism-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col transition-all duration-300 group relative ${isDragging ? 'scale-105 shadow-cyan-500/20 border-cyan-500/30' : 'hover:shadow-lg hover:shadow-cyan-500/10'
        }`}
    >
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Subtle Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Drag Handle */}
      <div className="w-full h-6 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-1 bg-white/20 rounded-full group-hover:bg-cyan-500/50 transition-colors" />
      </div>

      {/* Widget Content - Removed TiltContainer for reduced CPU usage on hover */}
      <div className="flex-1 overflow-hidden relative w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const DraggableWidget = memo(DraggableWidgetComponent);

export default DraggableWidget;

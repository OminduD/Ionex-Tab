import React, { DragEvent, ReactNode } from 'react';
import { WidgetId } from '../../types';
import { GripVerticalIcon } from '../icons';

interface WidgetContainerProps {
  id: WidgetId;
  children: ReactNode;
  className?: string;
  onDragStart: (e: DragEvent<HTMLDivElement>, id: WidgetId) => void;
  onDragEnter: (id: WidgetId) => void;
  onDragEnd: () => void;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  children,
  className,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnter={() => onDragEnter(id)}
      onDragEnd={onDragEnd}
      className={`bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg hover:bg-white/15 transition-all cursor-move widget-enter ${className}`}
    >
      <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
        <GripVerticalIcon className="w-4 h-4 opacity-50" />
      </div>
      {children}
    </div>
  );
};

export default WidgetContainer;

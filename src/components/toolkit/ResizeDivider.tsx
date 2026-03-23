import React, { useRef, useState, useEffect, useCallback } from 'react';

interface ResizeDividerProps {
  onResize: (delta: number) => void;  // 拖拽时传递宽度变化量
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const ResizeDivider: React.FC<ResizeDividerProps> = ({
  onResize,
  direction = 'horizontal',
  className = '',
}) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
  }, [direction]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
    const delta = currentPos - startPosRef.current;
    if (delta !== 0) {
      onResize(delta);
      startPosRef.current = currentPos; // 更新起始位置，实现连续增量
    }
  }, [isDragging, direction, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={dividerRef}
      className={`cursor-col-resize bg-gray-300 hover:bg-gray-400 active:bg-gray-500 transition-colors ${className}`}
      onMouseDown={handleMouseDown}
      style={{
        width: direction === 'horizontal' ? '4px' : '100%',
        height: direction === 'vertical' ? '4px' : '100%',
      }}
    />
  );
};

export default ResizeDivider;
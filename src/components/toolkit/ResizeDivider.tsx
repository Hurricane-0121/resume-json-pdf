import { useState, useRef, useEffect } from "react";

interface ResizeDividerProps {
  onResize: (deltaX: number) => void;
  direction?: "horizontal" | "vertical";
}

const ResizeDivider: React.FC<ResizeDividerProps> = ({ 
  onResize, 
  direction = "horizontal" 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startXRef.current;
      onResize(deltaX);
      startXRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <div
      className={`
        relative z-30
        ${direction === "horizontal" 
          ? "w-1 cursor-col-resize hover:w-1.5" 
          : "h-1 cursor-row-resize hover:h-1.5"
        }
        bg-gray-300 hover:bg-blue-400 active:bg-blue-500
        transition-all duration-150
      `}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-0 -ml-1 -mr-1" />
    </div>
  );
};

export default ResizeDivider;
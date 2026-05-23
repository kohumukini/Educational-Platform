import React, { useState, useEffect, useRef } from 'react';

function DraggablePiece({
  id,
  points,
  fill,
  initialX,
  initialY,
  targetX,
  targetY,
  onSnap,
  svgRef
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  // Reset to initial position if props change (useful if restarting the lesson)
  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
    setIsSnapped(false);
    setIsDragging(false);
  }, [initialX, initialY]);

  // Convert client cursor coordinates to SVG viewport coordinates
  const getSVGCoords = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    
    const rect = svg.getBoundingClientRect();
    
    // Map client coordinates to the 600x600 SVG viewBox
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 600;
    const y = ((clientY - rect.top) / rect.height) * 600;
    
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (isSnapped) return;
    
    // Capture pointer capture to keep dragging even if pointer leaves element
    e.target.setPointerCapture(e.pointerId);
    
    const coords = getSVGCoords(e);
    dragStartRef.current = coords;
    positionStartRef.current = position;
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isSnapped) return;
    
    const coords = getSVGCoords(e);
    const dx = coords.x - dragStartRef.current.x;
    const dy = coords.y - dragStartRef.current.y;
    
    setPosition({
      x: positionStartRef.current.x + dx,
      y: positionStartRef.current.y + dy
    });
  };

  const handlePointerUp = (e) => {
    if (!isDragging || isSnapped) return;
    setIsDragging(false);
    
    // Check if the current position is close to the target position
    const distance = Math.sqrt(
      Math.pow(position.x - targetX, 2) + Math.pow(position.y - targetY, 2)
    );
    
    // Snapping threshold of 18 pixels
    if (distance < 18) {
      setPosition({ x: targetX, y: targetY });
      setIsSnapped(true);
      onSnap(id);
    }
  };

  return (
    <polygon
      points={points}
      fill={fill}
      transform={`translate(${position.x}, ${position.y})`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`draggable-piece ${isSnapped ? 'snapped' : ''}`}
      style={{
        stroke: isDragging ? 'var(--color-amber-hover)' : (isSnapped ? 'var(--color-success)' : 'rgba(255,255,255,0.2)'),
        strokeWidth: isDragging ? 2.5 : 1,
        fillOpacity: isSnapped ? 0.85 : (isDragging ? 0.75 : 0.6),
        cursor: isSnapped ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), stroke 0.2s'
      }}
    />
  );
}

export default DraggablePiece;

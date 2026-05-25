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
  onDragStart,
  onDragEnd,
  onDragStateChange,
  svgRef
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isNearTarget, setIsNearTarget] = useState(false);
  const [isSnapped, setIsSnapped] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const positionStartRef = useRef({ x: 0, y: 0 });

  // Snap threshold of 25px
  const SNAP_THRESHOLD = 25;

  // Reset to initial position if props change
  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
    setIsSnapped(false);
    setIsDragging(false);
    setIsNearTarget(false);
  }, [initialX, initialY]);

  // Convert client cursor coordinates to SVG viewport coordinates (600x600 grid)
  const getSVGCoords = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 600;
    const y = ((clientY - rect.top) / rect.height) * 600;
    
    return { x, y };
  };

  const handlePointerDown = (e) => {
    if (isSnapped || isDragging) return;
    
    e.preventDefault();
    // Use pointer capture to bind events
    e.target.setPointerCapture(e.pointerId);
    
    const coords = getSVGCoords(e.clientX, e.clientY);
    dragStartRef.current = coords;
    positionStartRef.current = position;
    setIsDragging(true);
    
    if (onDragStart) {
      onDragStart(id);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e) => {
      const coords = getSVGCoords(e.clientX, e.clientY);
      const dx = coords.x - dragStartRef.current.x;
      const dy = coords.y - dragStartRef.current.y;
      
      const newX = positionStartRef.current.x + dx;
      const newY = positionStartRef.current.y + dy;
      
      // Check if current position is close to target
      const distance = Math.sqrt(
        Math.pow(newX - targetX, 2) + Math.pow(newY - targetY, 2)
      );
      
      const near = distance < SNAP_THRESHOLD;
      setIsNearTarget(near);
      
      if (onDragStateChange) {
        onDragStateChange(id, true, near);
      }
      
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e) => {
      setIsDragging(false);
      setIsNearTarget(false);
      
      const distance = Math.sqrt(
        Math.pow(position.x - targetX, 2) + Math.pow(position.y - targetY, 2)
      );
      
      if (onDragStateChange) {
        onDragStateChange(id, false, false);
      }
      
      if (onDragEnd) {
        onDragEnd();
      }

      if (distance < SNAP_THRESHOLD) {
        // Snap to target!
        setPosition({ x: targetX, y: targetY });
        setIsSnapped(true);
        onSnap(id);
      } else {
        // Snap back to origin!
        setPosition({ x: initialX, y: initialY });
      }
    };

    // Bind event listeners to window for 1:1 lag-free dragging
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, position.x, position.y, targetX, targetY, initialX, initialY, id]);

  // Determine styling based on drag state
  const getStrokeColor = () => {
    if (isSnapped) return 'var(--color-success)';
    if (isNearTarget) return 'var(--color-success)';
    if (isDragging) return 'var(--color-amber-hover)';
    return 'rgba(255,255,255,0.15)';
  };

  const getStrokeWidth = () => {
    if (isNearTarget) return 3;
    if (isDragging) return 2;
    return 1;
  };

  return (
    <polygon
      points={points}
      fill={fill}
      transform={`translate(${position.x}, ${position.y})`}
      onPointerDown={handlePointerDown}
      className={`draggable-piece ${isSnapped ? 'snapped' : ''} ${isNearTarget ? 'near-target' : ''}`}
      style={{
        stroke: getStrokeColor(),
        strokeWidth: getStrokeWidth(),
        fillOpacity: isSnapped ? 0.85 : (isNearTarget ? 0.8 : (isDragging ? 0.7 : 0.55)),
        cursor: isSnapped ? 'default' : (isDragging ? 'grabbing' : 'grab'),
        filter: isNearTarget ? 'drop-shadow(0 0 8px var(--color-success))' : (isDragging ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'),
        /* When dragging, disable transitions for 1:1 mouse matching. Enable for smooth slide-backs. */
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1), stroke 0.2s, fill-opacity 0.2s, filter 0.2s'
      }}
    />
  );
}

export default DraggablePiece;

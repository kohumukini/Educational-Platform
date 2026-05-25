import React, { useState } from 'react';
import DraggablePiece from '../DraggablePiece';

function PuzzleStage({
  piecesConfig,
  handlePieceSnap,
  snappedCount,
  svgRef
}) {
  const [activeDraggedPieceId, setActiveDraggedPieceId] = useState(null);
  const [piecesNearTarget, setPiecesNearTarget] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });

  const handleDragStart = (id) => {
    setActiveDraggedPieceId(id);
  };

  const handleDragEnd = () => {
    setActiveDraggedPieceId(null);
  };

  const handleDragStateChange = (id, isDragging, isNear) => {
    setPiecesNearTarget(prev => ({
      ...prev,
      [id]: isNear
    }));
  };

  // Check if any piece is currently near its target position
  const isAnyPieceNear = Object.values(piecesNearTarget).some(Boolean);

  // Sorting order: make sure the active dragged piece is rendered last (on top)
  const pieceIds = [1, 2, 3, 4, 5];
  const sortedPieceIds = [...pieceIds].sort((a, b) => {
    if (a === activeDraggedPieceId) return 1;
    if (b === activeDraggedPieceId) return -1;
    return 0;
  });

  return (
    <>
      {/* Dashed Target Outline for Hypotenuse Square */}
      <polygon
        points="250,180 410,300 530,140 370,20"
        className={`target-outline ${snappedCount === 5 ? 'active' : (isAnyPieceNear ? 'active' : '')}`}
        style={{
          stroke: snappedCount === 5 
            ? 'var(--color-success)' 
            : (isAnyPieceNear ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.25)'),
          strokeWidth: isAnyPieceNear || snappedCount === 5 ? 2.5 : 1.5,
          filter: isAnyPieceNear || snappedCount === 5 
            ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' 
            : 'none',
          transition: 'stroke 0.2s, stroke-width 0.2s, filter 0.2s'
        }}
      />
      
      {/* Visual guide lines inside target (pinwheel boundaries) */}
      {snappedCount < 5 && (
        <>
          {/* Inner 120x120 square outline */}
          <polygon 
            points="306,172 402,244 474,148 378,76" 
            stroke={isAnyPieceNear ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)'} 
            fill="none" 
            strokeWidth={1}
            strokeDasharray="2,2"
          />
        </>
      )}

      {/* Empty dashed placeholder outlines where pieces start */}
      <rect x={130} y={180} width={120} height={120} fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
      <rect x={250} y={300} width={160} height={160} fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />

      {/* Render pieces in sorted order so active piece is on top */}
      {sortedPieceIds.map((id) => {
        const config = piecesConfig[id];
        return (
          <DraggablePiece
            key={id}
            id={id}
            points={config.points}
            fill={config.fill}
            initialX={config.initial.x}
            initialY={config.initial.y}
            targetX={config.target.x}
            targetY={config.target.y}
            initialRotation={config.initialRotation}
            targetRotation={config.targetRotation}
            onSnap={handlePieceSnap}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragStateChange={handleDragStateChange}
            svgRef={svgRef}
          />
        );
      })}
    </>
  );
}

export default PuzzleStage;

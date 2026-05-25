import React, { useState, useEffect, useRef } from 'react';
import HoverStage from './stages/HoverStage';
import PuzzleStage from './stages/PuzzleStage';
import ShearStage from './stages/ShearStage';
import AlgebraStage from './stages/AlgebraStage';

function GeometrySandbox({
  step,
  setStepCompleted,
  activeHoveredSide,
  setActiveHoveredSide,
  shearProgress,
  setShearProgress,
  snappedCount,
  setSnappedCount
}) {
  const svgRef = useRef(null);

  // Step 1 states: track which sides have been hovered
  const [hoveredSides, setHoveredSides] = useState({ a: false, b: false, c: false });

  // Reset states when changing steps
  useEffect(() => {
    if (step === 1) {
      setHoveredSides({ a: false, b: false, c: false });
      setStepCompleted(false);
    } else if (step === 2) {
      setSnappedCount(0);
      setStepCompleted(false);
    } else if (step === 3) {
      setShearProgress(0);
      setStepCompleted(false);
    } else if (step === 4) {
      setStepCompleted(true);
    }
  }, [step]);

  // Handle side hover in Step 1
  const handleSideHover = (side) => {
    setActiveHoveredSide(side);
    if (step === 1 && side) {
      const updated = { ...hoveredSides, [side]: true };
      setHoveredSides(updated);
      
      // If all three squares have been hovered, mark step as completed
      if (updated.a && updated.b && updated.c) {
        setStepCompleted(true);
      }
    }
  };

  // Handle piece snapped in Step 2
  const handlePieceSnap = (id) => {
    const nextSnappedCount = snappedCount + 1;
    setSnappedCount(nextSnappedCount);
    
    if (nextSnappedCount === 4) {
      setStepCompleted(true);
    }
  };

  // Handle slider change in Step 3
  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setShearProgress(val);
    if (val === 100) {
      setStepCompleted(true);
    } else {
      setStepCompleted(false);
    }
  };

  // Geometry coordinates of the central triangle
  const trianglePoints = "250,180 250,300 410,300";

  // Piece Definitions (for Step 2 and Step 3)
  // Upright shapes:
  // Piece 1: Square 120x120
  // Piece 2: Rect 120x80
  // Piece 3: Rect 80x120
  // Piece 4: Square 80x80
  const piecesConfig = {
    1: {
      points: "0,0 120,0 120,120 0,120",
      fill: "#D97706", // Burnt Amber
      initial: { x: 130, y: 180 },
      target: { x: 250, y: 180 }
    },
    2: {
      points: "0,0 120,0 120,80 0,80",
      fill: "#B45309", // Medium Amber
      initial: { x: 250, y: 300 },
      target: { x: 346, y: 252 }
    },
    3: {
      points: "0,0 80,0 80,120 0,120",
      fill: "#E29B52", // Light Gold-Amber
      initial: { x: 330, y: 300 },
      target: { x: 322, y: 84 }
    },
    4: {
      points: "0,0 80,0 80,80 0,80",
      fill: "#F59E0B", // Bright Amber
      initial: { x: 250, y: 380 },
      target: { x: 418, y: 156 }
    }
  };

  return (
    <div className="panel sandbox-pane">
      <div className="sandbox-container">
        
        {/* Main SVG workspace */}
        <svg
          ref={svgRef}
          viewBox="0 0 600 600"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          {/* Subtle Grid Background */}
          {Array.from({ length: 13 }).map((_, i) => (
            <React.Fragment key={i}>
              <line className="svg-grid-line" x1={i * 50} y1={0} x2={i * 50} y2={600} />
              <line className="svg-grid-line" x1={0} y1={i * 50} x2={600} y2={i * 50} />
            </React.Fragment>
          ))}

          {/* Dynamic Sub-Stage Mounting */}
          {step === 1 && (
            <HoverStage
              activeHoveredSide={activeHoveredSide}
              handleSideHover={handleSideHover}
              hoveredSides={hoveredSides}
            />
          )}

          {step === 2 && (
            <PuzzleStage
              piecesConfig={piecesConfig}
              handlePieceSnap={handlePieceSnap}
              snappedCount={snappedCount}
              svgRef={svgRef}
            />
          )}

          {step === 3 && (
            <ShearStage
              piecesConfig={piecesConfig}
              shearProgress={shearProgress}
            />
          )}

          {step === 4 && (
            <AlgebraStage
              activeHoveredSide={activeHoveredSide}
              setActiveHoveredSide={setActiveHoveredSide}
            />
          )}

          {/* Central Right-Angled Triangle (Shared base rendered on top) */}
          <polygon points={trianglePoints} className="svg-triangle" style={{ pointerEvents: 'none' }} />
          
          {/* Side length text labels */}
          <text 
            className={`svg-text ${activeHoveredSide === 'a' ? 'svg-text-accent' : ''}`} 
            x={230} 
            y={240}
            style={{ fontWeight: activeHoveredSide === 'a' ? 'bold' : 'normal' }}
          >
            a
          </text>
          <text 
            className={`svg-text ${activeHoveredSide === 'b' ? 'svg-text-accent' : ''}`} 
            x={330} 
            y={320}
            style={{ fontWeight: activeHoveredSide === 'b' ? 'bold' : 'normal' }}
          >
            b
          </text>
          <text 
            className={`svg-text ${activeHoveredSide === 'c' ? 'svg-text-accent' : ''}`} 
            x={340} 
            y={225}
            style={{ fontWeight: activeHoveredSide === 'c' ? 'bold' : 'normal' }}
          >
            c
          </text>
          
          {/* Right-angle square indicator at B (250, 300) */}
          <polygon points="250,300 262,300 262,288 250,288" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
        </svg>

        {/* Step 3 Overlay Slider (only rendered in Step 3) */}
        {step === 3 && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            zIndex: 5,
            animation: 'fadeIn 0.3s ease'
          }}>
            <div className="slider-container">
              <div className="slider-label">
                <span>Shear & Slide Progress</span>
                <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>{shearProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={shearProgress}
                onChange={handleSliderChange}
                className="slider-input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeometrySandbox;

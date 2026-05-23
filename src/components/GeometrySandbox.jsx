import React, { useState, useEffect, useRef } from 'react';
import DraggablePiece from './DraggablePiece';

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

  // Step 2 states: track snapped status of the 4 pieces
  const [snappedPieces, setSnappedPieces] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Reset states when changing steps
  useEffect(() => {
    if (step === 1) {
      setHoveredSides({ a: false, b: false, c: false });
      setStepCompleted(false);
    } else if (step === 2) {
      setSnappedPieces({ 1: false, 2: false, 3: false, 4: false });
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
    const updated = { ...snappedPieces, [id]: true };
    setSnappedPieces(updated);
    
    const count = Object.values(updated).filter(Boolean).length;
    setSnappedCount(count);
    
    if (count === 4) {
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

  // Geometry coordinates
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
      // Target: translate(250, 180) + local(0, 120) rotated.
      // Under rotate(-53.13): local(0, 120) maps to (+96, +72) in SVG
      target: { x: 346, y: 252 }
    },
    3: {
      points: "0,0 80,0 80,120 0,120",
      fill: "#E29B52", // Light Gold-Amber
      initial: { x: 330, y: 300 },
      // Target: translate(250, 180) + local(120, 0) rotated.
      // Under rotate(-53.13): local(120, 0) maps to (+72, -96) in SVG
      target: { x: 322, y: 84 }
    },
    4: {
      points: "0,0 80,0 80,80 0,80",
      fill: "#F59E0B", // Bright Amber
      initial: { x: 250, y: 380 },
      // Target: translate(250, 180) + local(120, 120) rotated.
      // Under rotate(-53.13): local(120, 120) maps to (+168, -24) in SVG
      target: { x: 418, y: 156 }
    }
  };

  // Step 3 animation values (interpolated between initial and target positions)
  const getInterpolatedTransform = (config, t) => {
    const x = config.initial.x + (config.target.x - config.initial.x) * t;
    const y = config.initial.y + (config.target.y - config.initial.y) * t;
    const angle = 0 + (-53.13 - 0) * t;
    return `translate(${x}, ${y}) rotate(${angle})`;
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

          {/* STEP 1: Area Puzzle (Hover squares) */}
          {step === 1 && (
            <>
              {/* Square on side a (vertical, 120x120) */}
              <polygon
                points="250,180 250,300 130,300 130,180"
                className={`svg-square ${activeHoveredSide === 'a' ? 'hovered' : ''}`}
                onMouseEnter={() => handleSideHover('a')}
                onMouseLeave={() => handleSideHover(null)}
              />
              {/* Square on side b (horizontal, 160x160) */}
              <polygon
                points="250,300 410,300 410,460 250,460"
                className={`svg-square ${activeHoveredSide === 'b' ? 'hovered' : ''}`}
                onMouseEnter={() => handleSideHover('b')}
                onMouseLeave={() => handleSideHover(null)}
              />
              {/* Square on side c (hypotenuse, 200x200) */}
              <polygon
                points="250,180 410,300 530,140 370,20"
                className={`svg-square ${activeHoveredSide === 'c' ? 'hovered' : ''}`}
                onMouseEnter={() => handleSideHover('c')}
                onMouseLeave={() => handleSideHover(null)}
              />

              {/* Text labels for area values inside squares */}
              <text className="svg-text" x={190} y={240}>
                {hoveredSides.a ? "Area = 9" : "Square a"}
              </text>
              <text className="svg-text" x={330} y={380}>
                {hoveredSides.b ? "Area = 16" : "Square b"}
              </text>
              <text className="svg-text" x={390} y={160}>
                {hoveredSides.c ? "Area = 25" : "Square c"}
              </text>
            </>
          )}

          {/* STEP 2: Rearranging Pieces (Draggable Sandbox) */}
          {step === 2 && (
            <>
              {/* Dashed Target Outline for Hypotenuse Square */}
              <polygon
                points="250,180 410,300 530,140 370,20"
                className={`target-outline ${snappedCount === 4 ? 'active' : ''}`}
              />
              
              {/* Visual ghost guidelines inside target */}
              {snappedCount < 4 && (
                <>
                  <line x1={250} y1={180} x2={346} y2={252} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                  <line x1={322} y1={84} x2={418} y2={156} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                </>
              )}

              {/* Empty background placeholders to show where pieces start */}
              <rect x={130} y={180} width={120} height={120} fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />
              <rect x={250} y={300} width={160} height={160} fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,2" />

              {/* Render Draggable Pieces */}
              {Object.keys(piecesConfig).map((idStr) => {
                const id = parseInt(idStr, 10);
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
                    onSnap={handlePieceSnap}
                    svgRef={svgRef}
                  />
                );
              })}
            </>
          )}

          {/* STEP 3: Shearing Animation (Interpolated sliding) */}
          {step === 3 && (
            <>
              {/* Dashed Target Outline */}
              <polygon
                points="250,180 410,300 530,140 370,20"
                className="target-outline"
                style={{ stroke: `rgba(217, 119, 6, ${shearProgress / 100})` }}
              />

              {/* Render morphing pieces using slider linear interpolation */}
              {Object.keys(piecesConfig).map((idStr) => {
                const id = parseInt(idStr, 10);
                const config = piecesConfig[id];
                const t = shearProgress / 100;
                const transform = getInterpolatedTransform(config, t);
                return (
                  <polygon
                    key={id}
                    points={config.points}
                    fill={config.fill}
                    transform={transform}
                    style={{
                      stroke: 'rgba(255, 255, 255, 0.1)',
                      strokeWidth: 1,
                      fillOpacity: 0.7,
                      transition: 'none'
                    }}
                  />
                );
              })}
            </>
          )}

          {/* STEP 4: Bringing in the Algebra */}
          {step === 4 && (
            <>
              {/* Static visual representation of all squares and labels */}
              <polygon
                points="250,180 250,300 130,300 130,180"
                className={`svg-square ${activeHoveredSide === 'a' ? 'hovered' : ''}`}
                style={{ fillOpacity: activeHoveredSide === 'a' ? 0.35 : 0.1 }}
                onMouseEnter={() => setActiveHoveredSide('a')}
                onMouseLeave={() => setActiveHoveredSide(null)}
              />
              <polygon
                points="250,300 410,300 410,460 250,460"
                className={`svg-square ${activeHoveredSide === 'b' ? 'hovered' : ''}`}
                style={{ fillOpacity: activeHoveredSide === 'b' ? 0.35 : 0.1 }}
                onMouseEnter={() => setActiveHoveredSide('b')}
                onMouseLeave={() => setActiveHoveredSide(null)}
              />
              <polygon
                points="250,180 410,300 530,140 370,20"
                className={`svg-square ${activeHoveredSide === 'c' ? 'hovered' : ''}`}
                style={{ fillOpacity: activeHoveredSide === 'c' ? 0.35 : 0.1 }}
                onMouseEnter={() => setActiveHoveredSide('c')}
                onMouseLeave={() => setActiveHoveredSide(null)}
              />

              {/* Labels inside the shapes */}
              <text className={`svg-text ${activeHoveredSide === 'a' ? 'svg-text-accent' : ''}`} x={190} y={240} style={{ fontSize: '18px' }}>a²</text>
              <text className={`svg-text ${activeHoveredSide === 'b' ? 'svg-text-accent' : ''}`} x={330} y={380} style={{ fontSize: '18px' }}>b²</text>
              <text className={`svg-text ${activeHoveredSide === 'c' ? 'svg-text-accent' : ''}`} x={390} y={160} style={{ fontSize: '18px' }}>c²</text>
            </>
          )}

          {/* Central Right-Angled Triangle (Rendered on top for all steps) */}
          <polygon points={trianglePoints} className="svg-triangle" />
          
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

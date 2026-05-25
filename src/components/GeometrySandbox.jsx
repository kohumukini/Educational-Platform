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
  setSnappedCount,
  setStep
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
    
    if (nextSnappedCount === 5) {
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

  // central 5-piece pinwheel config
  const piecesConfig = {
    1: {
      points: "0,0 120,0 120,120 0,120",
      fill: "#D97706", // Burnt Amber
      initial: { x: 130, y: 180 },
      target: { x: 306, y: 172 },
      targetRotation: -53.13,
      initialRotation: 0
    },
    2: {
      points: "0,0 160,0 160,40 0,40",
      fill: "#B45309", // Medium Amber
      initial: { x: 250, y: 300 },
      target: { x: 274, y: 148 },
      targetRotation: -53.13,
      initialRotation: 0
    },
    3: {
      points: "0,0 160,0 160,40 0,40",
      fill: "#E29B52", // Light Gold-Amber
      initial: { x: 250, y: 340 },
      target: { x: 402, y: 44 },
      targetRotation: 36.87,
      initialRotation: 0
    },
    4: {
      points: "0,0 160,0 160,40 0,40",
      fill: "#F59E0B", // Bright Amber
      initial: { x: 250, y: 380 },
      target: { x: 506, y: 172 },
      targetRotation: 126.87,
      initialRotation: 0
    },
    5: {
      points: "0,0 160,0 160,40 0,40",
      fill: "#D97706", // Burnt Amber
      initial: { x: 250, y: 420 },
      target: { x: 378, y: 276 },
      targetRotation: -143.13,
      initialRotation: 0
    }
  };

  // Render review dashboard cards when on step 5
  if (step === 5) {
    const reviewCards = [
      { id: 1, name: "Step 1: Comparing Areas", desc: "Hover over the squares constructed on each side to analyze their sizes." },
      { id: 2, name: "Step 2: Dissection Puzzle", desc: "Rearrange the 5 pieces and fit them inside the hypotenuse square." },
      { id: 3, name: "Step 3: Sliding Shapes", desc: "Shear and slide the areas to show how sliding preserves space." },
      { id: 4, name: "Step 4: Algebraic Shorthand", desc: "Connect the geometry logic back to the simple formula a² + b² = c²." }
    ];

    return (
      <div className="panel sandbox-pane" style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-light)', marginBottom: '24px', letterSpacing: '-0.01em' }}>
          Interactive Review Board
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', width: '100%' }}>
          {reviewCards.map(card => (
            <div 
              key={card.id}
              onClick={() => setStep(card.id)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--inner-radius)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-amber)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', color: 'var(--color-amber)', marginBottom: '8px' }}>
                  {card.name}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {card.desc}
                </p>
              </div>
              
              <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Open Sandbox →
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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

import React from 'react';

function AlgebraStage({
  activeHoveredSide,
  setActiveHoveredSide
}) {
  return (
    <>
      {/* Square on side a (vertical, 120x120) */}
      <polygon
        points="250,180 250,300 130,300 130,180"
        className={`svg-square ${activeHoveredSide === 'a' ? 'hovered' : ''}`}
        style={{ 
          fillOpacity: activeHoveredSide === 'a' ? 0.35 : 0.1,
          cursor: 'pointer'
        }}
        onMouseEnter={() => setActiveHoveredSide('a')}
        onMouseLeave={() => setActiveHoveredSide(null)}
      />
      
      {/* Square on side b (horizontal, 160x160) */}
      <polygon
        points="250,300 410,300 410,460 250,460"
        className={`svg-square ${activeHoveredSide === 'b' ? 'hovered' : ''}`}
        style={{ 
          fillOpacity: activeHoveredSide === 'b' ? 0.35 : 0.1,
          cursor: 'pointer'
        }}
        onMouseEnter={() => setActiveHoveredSide('b')}
        onMouseLeave={() => setActiveHoveredSide(null)}
      />
      
      {/* Square on side c (hypotenuse, 200x200) */}
      <polygon
        points="250,180 410,300 530,140 370,20"
        className={`svg-square ${activeHoveredSide === 'c' ? 'hovered' : ''}`}
        style={{ 
          fillOpacity: activeHoveredSide === 'c' ? 0.35 : 0.1,
          cursor: 'pointer'
        }}
        onMouseEnter={() => setActiveHoveredSide('c')}
        onMouseLeave={() => setActiveHoveredSide(null)}
      />

      {/* Labels inside the shapes */}
      <text 
        className={`svg-text ${activeHoveredSide === 'a' ? 'svg-text-accent' : ''}`} 
        x={190} y={240} 
        style={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        a²
      </text>
      
      <text 
        className={`svg-text ${activeHoveredSide === 'b' ? 'svg-text-accent' : ''}`} 
        x={330} y={380} 
        style={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        b²
      </text>
      
      <text 
        className={`svg-text ${activeHoveredSide === 'c' ? 'svg-text-accent' : ''}`} 
        x={390} y={160} 
        style={{ fontSize: '18px', fontWeight: 'bold' }}
      >
        c²
      </text>
    </>
  );
}

export default AlgebraStage;

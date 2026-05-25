import React from 'react';

function HoverStage({
  activeHoveredSide,
  handleSideHover,
  hoveredSides
}) {
  return (
    <>
      {/* Square on side a (vertical, 120x120) */}
      <polygon
        points="250,180 250,300 130,300 130,180"
        className={`svg-square ${activeHoveredSide === 'a' ? 'hovered' : ''}`}
        onMouseEnter={() => handleSideHover('a')}
        onMouseLeave={() => handleSideHover(null)}
        style={{ cursor: 'pointer' }}
      />
      {/* Square on side b (horizontal, 160x160) */}
      <polygon
        points="250,300 410,300 410,460 250,460"
        className={`svg-square ${activeHoveredSide === 'b' ? 'hovered' : ''}`}
        onMouseEnter={() => handleSideHover('b')}
        onMouseLeave={() => handleSideHover(null)}
        style={{ cursor: 'pointer' }}
      />
      {/* Square on side c (hypotenuse, 200x200) */}
      <polygon
        points="250,180 410,300 530,140 370,20"
        className={`svg-square ${activeHoveredSide === 'c' ? 'hovered' : ''}`}
        onMouseEnter={() => handleSideHover('c')}
        onMouseLeave={() => handleSideHover(null)}
        style={{ cursor: 'pointer' }}
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
  );
}

export default HoverStage;

import React from 'react';

function ShearStage({
  piecesConfig,
  shearProgress
}) {
  // Helper to interpolate position and rotation values
  const getInterpolatedTransform = (config, t) => {
    const x = config.initial.x + (config.target.x - config.initial.x) * t;
    const y = config.initial.y + (config.target.y - config.initial.y) * t;
    const angle = 0 + (config.targetRotation - 0) * t;
    return `translate(${x}, ${y}) rotate(${angle})`;
  };

  return (
    <>
      {/* Dashed Target Outline (grows brighter as it fills) */}
      <polygon
        points="250,180 410,300 530,140 370,20"
        className="target-outline"
        style={{ stroke: `rgba(217, 119, 6, ${0.1 + (shearProgress / 100) * 0.4})` }}
      />

      {/* Render morphing pieces using slider linear interpolation */}
      {[1, 2, 3, 4, 5].map((id) => {
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
              stroke: 'rgba(255, 255, 255, 0.08)',
              strokeWidth: 1,
              fillOpacity: 0.65,
              transition: 'none'
            }}
          />
        );
      })}
    </>
  );
}

export default ShearStage;

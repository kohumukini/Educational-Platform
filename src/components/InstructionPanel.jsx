import React from 'react';

function InstructionPanel({
  step,
  onNext,
  onBack,
  isStepCompleted,
  activeHoveredSide,
  shearProgress,
  snappedCount
}) {

  // Return custom text and elements based on the step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="instruction-title">Comparing Areas</h2>
            <div className="instruction-body">
              <p>
                We begin with a right-angled triangle. On each of its three sides, we have built a square.
              </p>
              <p>
                <strong>Your Task:</strong> Hover your mouse (or tap) on the squares in the sandbox on the right to reveal their areas.
              </p>
              <p>
                Look closely at the numbers. Can you see a relationship between the space covered by the two smaller squares and the space covered by the largest one?
              </p>
              
              {activeHoveredSide && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: 'var(--inner-radius)',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '4px solid var(--color-amber)',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <span style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--color-amber)', fontWeight: 'bold' }}>
                    Active Area
                  </span>
                  <p style={{ margin: '8px 0 0 0', color: 'var(--text-light)', fontSize: '15px' }}>
                    {activeHoveredSide === 'a' && "Small Square: Area = 3 × 3 = 9 units"}
                    {activeHoveredSide === 'b' && "Medium Square: Area = 4 × 4 = 16 units"}
                    {activeHoveredSide === 'c' && "Hypotenuse Square: Area = 5 × 5 = 25 units"}
                  </p>
                </div>
              )}
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h2 className="instruction-title">Fitting the Space</h2>
            <div className="instruction-body">
              <p>
                Let's test our theory. Does the space inside the two smaller squares combine to fit perfectly inside the largest square?
              </p>
              <p>
                <strong>Your Task:</strong> Drag the four colored shapes on the right and rearrange them so they pack inside the largest dashed square.
              </p>
              <p>
                This physical rearrangement shows that no space is lost or gained. The smaller areas sum up exactly to the larger area.
              </p>
              
              <div style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: 'var(--inner-radius)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  Pieces Snapped
                </span>
                <span style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontWeight: 'bold', 
                  fontSize: '18px',
                  color: snappedCount === 4 ? 'var(--color-success)' : 'var(--color-amber)'
                }}>
                  {snappedCount} / 4
                </span>
              </div>
              
              {snappedCount === 4 && (
                <p style={{ marginTop: '16px', color: 'var(--color-success)', fontWeight: '500', fontSize: '14px', animation: 'fadeIn 0.3s ease' }}>
                  ✓ Perfect fit! The pieces occupy the exact same space.
                </p>
              )}
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h2 className="instruction-title">Sliding Without Changing Area</h2>
            <div className="instruction-body">
              <p>
                Why does this work mathematically? Let's look at a beautiful concept: <strong>shearing</strong>.
              </p>
              <p>
                If you slide a shape sideways between two parallel lines, its base and its height do not change. Because Area = Base × Height, the shape's area remains exactly the same even as it leans.
              </p>
              <p>
                <strong>Your Task:</strong> Drag the slider below to watch the squares slide, shear, and merge into the hypotenuse square.
              </p>
              
              {shearProgress === 100 && (
                <p style={{ marginTop: '16px', color: 'var(--color-success)', fontWeight: '500', fontSize: '14px', animation: 'fadeIn 0.3s ease' }}>
                  ✓ Visual proof complete. The areas slide into the main square perfectly!
                </p>
              )}
            </div>
          </>
        );
      
      case 4:
        return (
          <>
            <h2 className="instruction-title">The Shorthand Language</h2>
            <div className="instruction-body">
              <p>
                Now that we have built the physical and visual intuition, let's write it down in shorthand. This is algebra.
              </p>
              <p>
                If we name the sides of our right triangle <strong>a</strong> (short leg), <strong>b</strong> (long leg), and <strong>c</strong> (hypotenuse):
              </p>
              <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-muted)' }}>
                <li style={{ marginBottom: '8px' }}>The area of square <strong>a</strong> is <strong>a²</strong> (a × a).</li>
                <li style={{ marginBottom: '8px' }}>The area of square <strong>b</strong> is <strong>b²</strong> (b × b).</li>
                <li style={{ marginBottom: '8px' }}>The area of square <strong>c</strong> is <strong>c²</strong> (c × c).</li>
              </ul>
              <p>
                Because the two smaller squares add up to the largest square, we write:
              </p>
              
              <div style={{
                margin: '24px 0',
                padding: '20px',
                borderRadius: 'var(--inner-radius)',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-color-active)',
                textAlign: 'center',
                boxShadow: '0 0 15px var(--color-amber-glow)'
              }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '28px', 
                  color: 'var(--color-amber)', 
                  letterSpacing: '0.05em' 
                }}>
                  a² + b² = c²
                </h3>
              </div>
              
              <p>
                You have just constructed the Pythagorean Theorem! You can now use this shorthand rule to find any missing side of a right-angled triangle.
              </p>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="panel instruction-pane">
      {/* Content wrapper */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, height: '100%', overflow: 'hidden' }}>
        <div className="instruction-header">
          <span style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'var(--color-amber)', 
            fontWeight: '600',
            display: 'block',
            marginBottom: '4px'
          }}>
            Step {step}
          </span>
        </div>
        
        {renderStepContent()}
      </div>

      {/* Button Controls & Action Navigation */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div className="instruction-footer">
          <button 
            className="btn btn-secondary" 
            style={{ flex: 1 }}
            onClick={onBack}
            disabled={step === 1}
          >
            Back
          </button>
          
          <button 
            className="btn btn-primary" 
            style={{ flex: 1.5 }}
            onClick={onNext}
            disabled={!isStepCompleted && step < 4}
          >
            {step === 4 ? 'Finished' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstructionPanel;

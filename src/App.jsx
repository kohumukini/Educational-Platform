import React, { useState } from 'react';
import InstructionPanel from './components/InstructionPanel';
import GeometrySandbox from './components/GeometrySandbox';

function App() {
  const [step, setStep] = useState(1);
  
  // Track step completions
  const [step1Completed, setStep1Completed] = useState(false);
  const [step2Completed, setStep2Completed] = useState(false);
  const [step3Completed, setStep3Completed] = useState(false);
  const [step4Completed, setStep4Completed] = useState(false);
  
  // Custom states for the interactive sandbox
  const [activeHoveredSide, setActiveHoveredSide] = useState(null); // 'a', 'b', 'c', or null
  const [shearProgress, setShearProgress] = useState(0); // 0 to 100
  const [snappedCount, setSnappedCount] = useState(0); // number of puzzle pieces in place

  // Handle progression
  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const getStepCompletion = (s) => {
    switch (s) {
      case 1: return step1Completed;
      case 2: return step2Completed;
      case 3: return step3Completed;
      case 4: return step4Completed;
      default: return false;
    }
  };

  const setStepCompletion = (s, val) => {
    switch (s) {
      case 1: setStep1Completed(val); break;
      case 2: setStep2Completed(val); break;
      case 3: setStep3Completed(val); break;
      case 4: setStep4Completed(val); break;
    }
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="brand">
          <div className="brand-logo" />
          <h1 className="brand-name">Bearings</h1>
        </div>
        
        {/* Step tracker: clean, premium educational roadmap */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="step-indicator-bar" style={{ margin: 0, width: '200px' }}>
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`step-dot ${s === step ? 'active' : ''} ${getStepCompletion(s) ? 'completed' : ''}`}
                onClick={() => {
                  // Only allow jumping back, or jumping forward if the current step is completed
                  if (s < step || getStepCompletion(s - 1) || s === 1) {
                    setStep(s);
                  }
                }}
                style={{ cursor: (s < step || getStepCompletion(s - 1) || s === 1) ? 'pointer' : 'not-allowed' }}
              />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', width: '70px', textAlign: 'right' }}>
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main split learning screen */}
      <main className="main-view">
        <InstructionPanel 
          step={step}
          onNext={handleNext}
          onBack={handleBack}
          isStepCompleted={getStepCompletion(step)}
          activeHoveredSide={activeHoveredSide}
          shearProgress={shearProgress}
          snappedCount={snappedCount}
        />
        
        <GeometrySandbox 
          step={step}
          setStepCompleted={(val) => setStepCompletion(step, val)}
          activeHoveredSide={activeHoveredSide}
          setActiveHoveredSide={setActiveHoveredSide}
          shearProgress={shearProgress}
          setShearProgress={setShearProgress}
          snappedCount={snappedCount}
          setSnappedCount={setSnappedCount}
        />
      </main>
    </div>
  );
}

export default App;

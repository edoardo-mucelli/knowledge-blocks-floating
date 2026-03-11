import React from 'react';

interface FloatingStageProps {
  children: React.ReactNode;
}

export const FloatingStage: React.FC<FloatingStageProps> = ({ children }) => {
  return (
    <div className="canvas-container">
      {children}
    </div>
  );
};

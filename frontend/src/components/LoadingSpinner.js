// Loading Spinner Component
import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  return (
    <div className={`loading-spinner-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className={`spinner ${size}`}></div>
    </div>
  );
}

export default LoadingSpinner;

import React, { useState, useCallback } from 'react';
import MobileCameraButton from './MobileCameraButton';
import './App.css';

const App = () => {
  const [capturedImage, setCapturedImage] = useState(null);

  const handlePhotoCapture = useCallback((file) => {
    // Create a URL for the captured image
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    
    // Here you can add additional logic to process the image
    // For example, applying filters, saving to state, etc.
  }, []);

  return (
    <div className="app">
      <main className="app-content">
        {capturedImage && (
          <div className="preview-container">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="preview-image"
            />
          </div>
        )}
        
        <div className="controls-container">
          {/* Mobile camera button positioned above presets */}
          <div className="camera-button-wrapper">
            <MobileCameraButton onPhotoCapture={handlePhotoCapture} />
          </div>
          
          {/* Preset selection would go here */}
          <div className="presets-container">
            {/* Your preset components would go here */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 
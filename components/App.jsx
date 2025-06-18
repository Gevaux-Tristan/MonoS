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
        
        {/* Mobile camera button will only show on mobile devices */}
        <MobileCameraButton onPhotoCapture={handlePhotoCapture} />
      </main>
    </div>
  );
};

export default App; 
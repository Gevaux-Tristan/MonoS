import React, { useRef, useCallback, memo } from 'react';
import './MobileCameraButton.css';

// Memoize the SVG to prevent unnecessary re-renders
const CameraIcon = memo(() => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path 
      d="M12 15.2C13.7673 15.2 15.2 13.7673 15.2 12C15.2 10.2327 13.7673 8.8 12 8.8C10.2327 8.8 8.8 10.2327 8.8 12C8.8 13.7673 10.2327 15.2 12 15.2Z" 
      fill="currentColor"
    />
    <path 
      d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" 
      fill="currentColor"
    />
  </svg>
));

const MobileCameraButton = memo(({ onPhotoCapture }) => {
  const fileInputRef = useRef(null);
  const isProcessing = useRef(false);

  const handleCameraClick = useCallback(() => {
    if (fileInputRef.current && !isProcessing.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file || !onPhotoCapture || isProcessing.current) return;

    try {
      isProcessing.current = true;
      
      // Optimize image before processing
      const optimizedFile = await optimizeImage(file);
      onPhotoCapture(optimizedFile);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      isProcessing.current = false;
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onPhotoCapture]);

  const optimizeImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate optimal dimensions while maintaining aspect ratio
          const maxDimension = 1200; // Maximum dimension for mobile
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image with high quality settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with optimized quality
          canvas.toBlob(
            (blob) => {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }));
            },
            'image/jpeg',
            0.85 // Good balance between quality and size
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="mobile-camera-button-container">
      <button 
        className="mobile-camera-button"
        onClick={handleCameraClick}
        aria-label="Take photo"
        type="button"
      >
        <CameraIcon />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
});

MobileCameraButton.displayName = 'MobileCameraButton';
export default MobileCameraButton; 
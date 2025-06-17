import React, { useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import Webcam from 'react-webcam';

interface CameraProps {
  onCapture: (image: string) => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        setIsCameraActive(false);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'center' }}>
      {!isCameraActive ? (
        <Button
          variant="contained"
          onClick={() => setIsCameraActive(true)}
          fullWidth
          sx={{ py: 2 }}
        >
          Take Photo
        </Button>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: 'user',
            }}
            style={{ width: '100%', maxWidth: 600, borderRadius: 8 }}
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleCapture}
              color="primary"
            >
              Capture
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsCameraActive(false)}
              color="secondary"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Camera; 
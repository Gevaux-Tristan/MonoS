import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Box, Button } from '@mui/material';

interface CameraProps {
  onCapture: () => void;
  onClose: () => void;
}

const Camera: React.FC<CameraProps> = ({ onCapture, onClose }) => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture();
    }
  }, [onCapture]);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user"
        }}
        style={{ width: '100%', maxHeight: 400, borderRadius: 8 }}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={capture}>
          Capture
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Annuler
        </Button>
      </Box>
    </Box>
  );
};

export default Camera; 
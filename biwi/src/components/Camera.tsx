import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

interface CameraProps {
  onCapture: (image: string) => void;
}

const CameraContainer = styled(Box)({
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  position: 'relative',
});

const Camera: React.FC<CameraProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment',
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  };

  return (
    <CameraContainer>
      {isCameraOn ? (
        <>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: '100%', height: 'auto' }}
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              onClick={handleCapture}
              color="primary"
            >
              Capture
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsCameraOn(false)}
              color="secondary"
            >
              Close Camera
            </Button>
          </Stack>
        </>
      ) : (
        <Button
          variant="contained"
          onClick={() => setIsCameraOn(true)}
          fullWidth
          sx={{ py: 2 }}
        >
          Open Camera
        </Button>
      )}
    </CameraContainer>
  );
};

export default Camera; 
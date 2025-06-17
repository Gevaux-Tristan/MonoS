import React, { useEffect, useState } from 'react';
import { Box, Slider, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { applyImageAdjustments, compressImage } from '../../../src/utils/imageUtils';

interface ImageEditorProps {
  image: string;
  onSave: (editedImage: string) => void;
  exposure: number;
  contrast: number;
  grain: number;
  blur: number;
  setExposure: React.Dispatch<React.SetStateAction<number>>;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  setGrain: React.Dispatch<React.SetStateAction<number>>;
  setBlur: React.Dispatch<React.SetStateAction<number>>;
}

const ImagePreview = styled('img')({
  maxWidth: '100%',
  maxHeight: '70vh',
  objectFit: 'contain',
});

const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onSave,
  exposure,
  contrast,
  grain,
  blur,
  setExposure,
  setContrast,
  setGrain,
  setBlur,
}) => {
  const [processedImage, setProcessedImage] = useState(image);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processImage = async () => {
      setIsProcessing(true);
      try {
        const adjustedImage = await applyImageAdjustments(image, {
          exposure,
          contrast,
          grain,
          blur,
        });
        setProcessedImage(adjustedImage);
      } catch (error) {
        console.error('Error processing image:', error);
      }
      setIsProcessing(false);
    };

    const timeoutId = setTimeout(processImage, 300); // Debounce processing
    return () => clearTimeout(timeoutId);
  }, [image, exposure, contrast, grain, blur]);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const compressedImage = await compressImage(processedImage, 5);
      onSave(compressedImage);
    } catch (error) {
      console.error('Error saving image:', error);
    }
    setIsProcessing(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <ImagePreview src={processedImage} alt="Preview" />
      
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Box>
          <Typography gutterBottom>Exposure</Typography>
          <Slider
            value={exposure}
            onChange={(_, value) => setExposure(value as number)}
            min={-100}
            max={100}
            valueLabelDisplay="auto"
            disabled={isProcessing}
          />
        </Box>

        <Box>
          <Typography gutterBottom>Contrast</Typography>
          <Slider
            value={contrast}
            onChange={(_, value) => setContrast(value as number)}
            min={-100}
            max={100}
            valueLabelDisplay="auto"
            disabled={isProcessing}
          />
        </Box>

        <Box>
          <Typography gutterBottom>Grain</Typography>
          <Slider
            value={grain}
            onChange={(_, value) => setGrain(value as number)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            disabled={isProcessing}
          />
        </Box>

        <Box>
          <Typography gutterBottom>Radial Blur</Typography>
          <Slider
            value={blur}
            onChange={(_, value) => setBlur(value as number)}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            disabled={isProcessing}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isProcessing}
          sx={{ mt: 2 }}
        >
          {isProcessing ? 'Processing...' : 'Save'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ImageEditor; 
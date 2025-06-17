import React, { useState, useRef, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, Slider, Typography, Button } from '@mui/material';
import ImageEditor from './components/ImageEditor';
import FilmPresets from './components/FilmPresets';
import { FilmPreset } from './types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f62fe', // Carbon blue 60
      contrastText: '#fff',
    },
    secondary: {
      main: '#e0e0e0', // Carbon gray 20
      contrastText: '#161616',
    },
    background: {
      default: '#fff', // Carbon white
      paper: '#f4f4f4', // Carbon gray 10
    },
    text: {
      primary: '#161616', // Carbon gray 100
      secondary: '#525252', // Carbon gray 70
      disabled: '#a8a8a8', // Carbon gray 40
    },
    divider: '#e0e0e0', // Carbon gray 20
    action: {
      active: '#161616',
      hover: '#e5e5e5',
      selected: '#c6c6c6',
      disabled: '#a8a8a8',
      disabledBackground: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 500 },
    h4: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 500 },
    h5: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400 },
    h6: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400 },
    subtitle1: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400 },
    subtitle2: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400 },
    body1: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400 },
    body2: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 300 },
    button: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
    overline: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 400, letterSpacing: '0.1em' },
    caption: { fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif', fontWeight: 300 },
  },
  shape: {
    borderRadius: 2, // Carbon uses sharp or very subtle radius
  },
  spacing: 8, // Carbon uses multiples of 8px
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
          fontWeight: 600,
          borderRadius: 2,
          boxShadow: 'none',
          textTransform: 'none',
          padding: '0 16px',
          minHeight: 40,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#0f62fe',
          height: 4,
          borderRadius: 2,
          background: 'transparent',
        },
        thumb: {
          width: 16,
          height: 16,
          borderRadius: 2,
          backgroundColor: '#fff',
          border: '2px solid #0f62fe',
        },
        track: {
          borderRadius: 2,
        },
        rail: {
          borderRadius: 2,
        },
        markLabel: {
          fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
        },
        valueLabel: {
          fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #e0e0e0',
          backgroundColor: '#f4f4f4',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
          padding: '0 16px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"IBM Plex Sans", Arial, Helvetica, sans-serif',
        },
      },
    },
  },
});

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<FilmPreset | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grain, setGrain] = useState(0);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Update sliders when preset changes
  useEffect(() => {
    if (selectedPreset) {
      setBrightness(selectedPreset.exposure);
      setContrast(selectedPreset.contrast);
      setGrain(selectedPreset.grain);
    }
  }, [selectedPreset]);

  // Update preview on image, preset, or slider change
  useEffect(() => {
    updatePreview();
    // eslint-disable-next-line
  }, [selectedImage, selectedPreset, brightness, contrast, grain]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          originalImageRef.current = img;
          setSelectedImage(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: FilmPreset) => {
    setSelectedPreset(preset);
  };

  const updatePreview = () => {
    const canvas = previewCanvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Use higher internal resolution for sharpness
    const maxWidth = canvas.parentElement?.clientWidth || 800;
    const maxHeight = canvas.parentElement?.clientHeight || 600;
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    // 2x resolution for sharpness
    const displayWidth = img.width * scale;
    const displayHeight = img.height * scale;
    canvas.width = displayWidth * 2;
    canvas.height = displayHeight * 2;
    ctx.setTransform(2, 0, 0, 2, 0, 0); // scale drawing for sharpness
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    // If no preset, just show grayscale
    if (!selectedPreset) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114;
        imageData.data[i] = gray;
        imageData.data[i + 1] = gray;
        imageData.data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      return;
    }
    // Apply film effect with current sliders
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const processedData = applyFilmEffect(imageData, {
      ...selectedPreset,
      exposure: brightness,
      contrast: contrast,
      grain: grain,
    });
    ctx.putImageData(processedData, 0, 0);
  };

  // Film effect (same as before, blendFactor 0.3)
  const applyFilmEffect = (imageData: ImageData, preset: FilmPreset) => {
    const { data } = imageData;
    const { exposure, contrast, grain, tint, paperTone } = preset;
    // 1. Grayscale
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    // 2. Exposure
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (exposure / 100));
      data[i + 1] = Math.min(255, data[i + 1] * (exposure / 100));
      data[i + 2] = Math.min(255, data[i + 2] * (exposure / 100));
    }
    // 3. Contrast
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }
    // HSL to RGB helper
    const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
      h /= 360;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };
    // 4. Tone and paper
    for (let i = 0; i < data.length; i += 4) {
      let l = data[i] / 255;
      let h = tint.hue;
      let s = Math.min(1, Math.max(0, tint.saturation / 100));
      if (l > 0.7) {
        l = l + (paperTone.highlight / 100);
      } else if (l < 0.3) {
        l = l + (paperTone.shadow / 100);
      } else {
        l = l + (paperTone.base / 100);
      }
      l = Math.min(1, Math.max(0, l));
      const [newR, newG, newB] = hslToRgb(h, s, l);
      let finalR = newR;
      let finalG = newG;
      let finalB = newB;
      if (tint.temperature > 0) {
        finalR = Math.min(255, newR + tint.temperature);
        finalB = Math.max(0, newB - tint.temperature);
        finalG = Math.min(255, newG + tint.temperature * 0.5);
      } else {
        finalR = Math.max(0, newR + tint.temperature);
        finalB = Math.min(255, newB - tint.temperature);
        finalG = Math.max(0, newG + tint.temperature * 0.5);
      }
      const blendFactor = 0.3;
      data[i] = finalR * blendFactor + data[i] * (1 - blendFactor);
      data[i + 1] = finalG * blendFactor + data[i + 1] * (1 - blendFactor);
      data[i + 2] = finalB * blendFactor + data[i + 2] * (1 - blendFactor);
    }
    // 5. Grain
    const noise = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const grainAmount = grain * (1 - Math.pow(luminance, 2)) * 0.5;
      const noiseValue = z0 * grainAmount;
      noise[i] = noise[i + 1] = noise[i + 2] = noiseValue;
      noise[i + 3] = 0;
    }
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + noise[i]));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise[i + 1]));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise[i + 2]));
    }
    return imageData;
  };

  // Export at full resolution, compress if needed
  const handleExport = async () => {
    if (!originalImageRef.current) return;
    setExporting(true);
    // Create an offscreen canvas at full image resolution
    const img = originalImageRef.current;
    const offCanvas = document.createElement('canvas');
    offCanvas.width = img.width;
    offCanvas.height = img.height;
    const ctx = offCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    // Apply effect at full res
    let imageData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    if (selectedPreset) {
      imageData = applyFilmEffect(imageData, {
        ...selectedPreset,
        exposure: brightness,
        contrast: contrast,
        grain: grain,
      });
    } else {
      // Just grayscale
      for (let i = 0; i < imageData.data.length; i += 4) {
        const gray = imageData.data[i] * 0.299 + imageData.data[i + 1] * 0.587 + imageData.data[i + 2] * 0.114;
        imageData.data[i] = gray;
        imageData.data[i + 1] = gray;
        imageData.data[i + 2] = gray;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    // Try PNG first
    let url = offCanvas.toDataURL('image/png');
    let fileSize = Math.ceil((url.length - 'data:image/png;base64,'.length) * 3 / 4);
    // If > 5MB, try JPEG with decreasing quality
    if (fileSize > 5 * 1024 * 1024) {
      let quality = 0.95;
      do {
        url = offCanvas.toDataURL('image/jpeg', quality);
        fileSize = Math.ceil((url.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
        quality -= 0.05;
      } while (fileSize > 5 * 1024 * 1024 && quality > 0.5);
    }
    // Download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'processed-image.png';
    link.click();
    setExporting(false);
  };

  // Camera logic
  const handleTakePicture = async () => {
    setShowCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setSelectedImage(dataUrl);
    setShowCamera(false);
    // Stop the camera
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container disableGutters maxWidth={false} sx={{ height: '100vh', width: '100vw', minWidth: 0, py: 2, px: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            height: '100%',
            width: '100vw',
            minWidth: 0,
          }}
        >
          {/* Preview (non scrollable) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: isMobile ? '40vh' : '100%',
              minHeight: isMobile ? 200 : undefined,
              maxHeight: isMobile ? '40vh' : undefined,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.paper',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
              flex: isMobile ? 'none' : 2,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            {showCamera ? (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <video ref={videoRef} style={{ width: '100%', maxHeight: 400, borderRadius: 8 }} autoPlay />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleCapture}>Capture</Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseCamera}>Cancel</Button>
                </Box>
              </Box>
            ) : selectedImage ? (
              <canvas
                ref={previewCanvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Box
                  component="label"
                  htmlFor="image-upload"
                  sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed', borderColor: 'divider', borderRadius: 1, '&:hover': { borderColor: 'primary.main' } }}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 1 }}>Cliquez ou glissez une image ici</Box>
                    <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Formats supportés : JPG, PNG, WEBP
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Settings panel (scrollable on mobile) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: isMobile ? 'auto' : '100%',
              minHeight: isMobile ? 300 : undefined,
              maxWidth: isMobile ? '100%' : 340,
              width: isMobile ? '100%' : 340,
              flex: isMobile ? 'none' : '0 0 340px',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              ml: isMobile ? 0 : 'auto',
              mr: 0,
              px: 2.625, // 21px
            }}
          >
            {/* Take picture button */}
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 1, width: '100%' }}
              onClick={handleTakePicture}
            >
              Take picture
            </Button>

            {/* Import image button (toujours visible) */}
            <Button
              variant="outlined"
              color="primary"
              sx={{ mb: 2, width: '100%' }}
              component="label"
              htmlFor="image-upload"
            >
              Import image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Button>

            {/* Presets: horizontal swipeable on mobile, vertical on desktop */}
            <Box
              sx={{
                width: '100%',
                overflowX: isMobile ? 'auto' : 'visible',
                overflowY: 'hidden',
                display: isMobile ? 'flex' : 'block',
                flexDirection: isMobile ? 'row' : 'column',
                gap: 2,
                pb: isMobile ? 1 : 0,
                minHeight: isMobile ? '89px' : undefined,
                maxHeight: isMobile ? '89px' : undefined,
                alignItems: isMobile ? 'center' : undefined,
              }}
            >
              <FilmPresets onSelectPreset={handlePresetSelect} mobileCarousel={isMobile} />
            </Box>

            {/* Sliders et export: toujours visibles sous les presets, export désactivé si pas d'image */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                width: '100%',
                flex: 'none',
                minHeight: 0,
                maxHeight: 'none',
              }}
            >
              <Typography gutterBottom>Luminosité</Typography>
              <Slider
                value={brightness}
                min={50}
                max={150}
                step={1}
                onChange={(_, v) => setBrightness(Number(v))}
                disabled={!selectedImage}
              />
              <Typography gutterBottom>Contraste</Typography>
              <Slider
                value={contrast}
                min={50}
                max={200}
                step={1}
                onChange={(_, v) => setContrast(Number(v))}
                disabled={!selectedImage}
              />
              <Typography gutterBottom>Grain</Typography>
              <Slider
                value={grain}
                min={0}
                max={100}
                step={1}
                onChange={(_, v) => setGrain(Number(v))}
                disabled={!selectedImage}
              />
              <Button
                variant="contained"
                sx={{ mt: 2, width: '100%' }}
                onClick={handleExport}
                disabled={exporting || !selectedImage}
              >
                {exporting ? 'EXPORT EN COURS...' : "SAUVEGARDER L'IMAGE"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Box, Button, Typography, Stack, Paper, Grid, Slider, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Preset {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  speed: number;
  settings: {
    contrast: number;
    brightness: number;
    grain: number;
    tint?: {
      color: string;
      intensity: number;
    };
  };
}

const PRESETS: Preset[] = [
  {
    id: 'tri-x-400',
    name: 'Kodak Tri-X 400',
    description: 'Classic high-contrast film with rich blacks',
    manufacturer: 'Kodak',
    speed: 400,
    settings: { 
      contrast: 40, 
      brightness: -15, 
      grain: 30,
      tint: { color: '#FFE8CC', intensity: 15 } // Warm tone
    }
  },
  {
    id: 'hp5-plus',
    name: 'Ilford HP5+',
    description: 'Versatile film with excellent tonal range',
    manufacturer: 'Ilford',
    speed: 400,
    settings: { 
      contrast: 30, 
      brightness: -10, 
      grain: 25,
      tint: { color: '#E6E6E6', intensity: 10 } // Neutral tone
    }
  },
  {
    id: 'tmax-100',
    name: 'Kodak T-MAX 100',
    description: 'Ultra-fine grain with exceptional detail',
    manufacturer: 'Kodak',
    speed: 100,
    settings: { 
      contrast: 35, 
      brightness: -5, 
      grain: 15,
      tint: { color: '#E6F3FF', intensity: 12 } // Cool tone
    }
  },
  {
    id: 'delta-3200',
    name: 'Ilford Delta 3200',
    description: 'High-speed film for low light with dramatic grain',
    manufacturer: 'Ilford',
    speed: 3200,
    settings: { 
      contrast: 45, 
      brightness: -20, 
      grain: 45,
      tint: { color: '#D9D9D9', intensity: 8 } // Neutral-cool tone
    }
  },
  {
    id: 'fp4-plus',
    name: 'Ilford FP4+',
    description: 'Medium-speed film with smooth gradations',
    manufacturer: 'Ilford',
    speed: 125,
    settings: { 
      contrast: 25, 
      brightness: -8, 
      grain: 15,
      tint: { color: '#F2F2F2', intensity: 10 } // Neutral tone
    }
  },
  {
    id: 'acros-100',
    name: 'Fuji Acros 100',
    description: 'Sharp with deep blacks and fine grain',
    manufacturer: 'Fujifilm',
    speed: 100,
    settings: { 
      contrast: 30, 
      brightness: -5, 
      grain: 10,
      tint: { color: '#E6E6FF', intensity: 15 } // Cool blue tone
    }
  },
  {
    id: 'pan-f-50',
    name: 'Ilford Pan F+ 50',
    description: 'Ultra-fine grain with extreme sharpness',
    manufacturer: 'Ilford',
    speed: 50,
    settings: { 
      contrast: 35, 
      brightness: -3, 
      grain: 5,
      tint: { color: '#F0F0F0', intensity: 12 } // Neutral-bright tone
    }
  },
  {
    id: 'delta-100',
    name: 'Ilford Delta 100',
    description: 'Modern emulsion with exceptional detail',
    manufacturer: 'Ilford',
    speed: 100,
    settings: { 
      contrast: 28, 
      brightness: -7, 
      grain: 12,
      tint: { color: '#E6E6E6', intensity: 10 } // Neutral tone
    }
  },
  {
    id: 'rpx-25',
    name: 'Rollei RPX 25',
    description: 'Ultra-fine grain with high resolution',
    manufacturer: 'Rollei',
    speed: 25,
    settings: { 
      contrast: 32, 
      brightness: -5, 
      grain: 8,
      tint: { color: '#F5F5F5', intensity: 8 } // Bright neutral tone
    }
  },
  {
    id: 'neopan-100',
    name: 'Fuji Neopan 100 Acros II',
    description: 'Modern Japanese film with exceptional sharpness',
    manufacturer: 'Fujifilm',
    speed: 100,
    settings: { 
      contrast: 32, 
      brightness: -8, 
      grain: 12,
      tint: { color: '#E6FFFF', intensity: 15 } // Cool cyan tone
    }
  },
  {
    id: 'kentmere-100',
    name: 'Kentmere 100',
    description: 'Budget-friendly film with classic tonality',
    manufacturer: 'Kentmere',
    speed: 100,
    settings: { 
      contrast: 25, 
      brightness: -5, 
      grain: 18,
      tint: { color: '#F2E6D9', intensity: 12 } // Warm neutral tone
    }
  },
  {
    id: 'apx-100',
    name: 'Agfa APX 100',
    description: 'Fine grain with balanced contrast and rich midtones',
    manufacturer: 'Agfa',
    speed: 100,
    settings: { 
      contrast: 28, 
      brightness: -7, 
      grain: 15,
      tint: { color: '#FFE6CC', intensity: 18 } // Warm golden tone
    }
  },
  {
    id: 'delta-400',
    name: 'Ilford Delta 400',
    description: 'Modern T-grain emulsion with excellent detail',
    manufacturer: 'Ilford',
    speed: 400,
    settings: { 
      contrast: 35, 
      brightness: -12, 
      grain: 25,
      tint: { color: '#E6E6E6', intensity: 10 } // Neutral tone
    }
  },
  {
    id: 'fomapan-100',
    name: 'Fomapan 100 Classic',
    description: 'Traditional Czech film with vintage character',
    manufacturer: 'Foma',
    speed: 100,
    settings: { 
      contrast: 30, 
      brightness: -8, 
      grain: 20,
      tint: { color: '#FFE6B3', intensity: 20 } // Warm vintage tone
    }
  },
  {
    id: 'fomapan-400',
    name: 'Fomapan 400 Action',
    description: 'High-speed film with pronounced grain structure',
    manufacturer: 'Foma',
    speed: 400,
    settings: { 
      contrast: 35, 
      brightness: -15, 
      grain: 30,
      tint: { color: '#FFD9B3', intensity: 15 } // Warm sepia tone
    }
  }
];

const PresetCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: '#fafbfc',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

const Editor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Preset['settings']>({
    contrast: 0,
    brightness: 0,
    grain: 0,
    tint: undefined
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processImage = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = imageRef.current.naturalWidth;
    canvas.height = imageRef.current.naturalHeight;

    // Draw original image
    ctx.drawImage(imageRef.current, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale and apply effects
    for (let i = 0; i < data.length; i += 4) {
      // Convert to grayscale
      const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
      
      // Apply brightness
      let value = gray * (1 + settings.brightness / 100);
      
      // Apply contrast
      value = ((value - 128) * (1 + settings.contrast / 100)) + 128;
      
      // Apply grain
      if (settings.grain > 0) {
        const noise = (Math.random() - 0.5) * settings.grain;
        value += noise;
      }
      
      // Clamp values
      value = Math.min(255, Math.max(0, value));

      // Apply tint if present in settings
      if (settings.tint) {
        const tintColor = settings.tint.color;
        const intensity = settings.tint.intensity / 100;
        
        // Parse tint color
        const r = parseInt(tintColor.slice(1, 3), 16);
        const g = parseInt(tintColor.slice(3, 5), 16);
        const b = parseInt(tintColor.slice(5, 7), 16);
        
        // Mix the grayscale value with the tint color
        data[i] = Math.min(255, Math.max(0, value * (1 - intensity) + r * intensity));
        data[i + 1] = Math.min(255, Math.max(0, value * (1 - intensity) + g * intensity));
        data[i + 2] = Math.min(255, Math.max(0, value * (1 - intensity) + b * intensity));
      } else {
        // Set RGB channels to the same value for B&W
        data[i] = data[i + 1] = data[i + 2] = value;
      }
    }

    // Put processed image data back
    ctx.putImageData(imageData, 0, 0);
    setProcessedImage(canvas.toDataURL('image/jpeg', 0.9));
  }, [settings]);

  // Use requestAnimationFrame to batch rapid updates for instant preview
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!image) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const img = new window.Image();
      img.onload = () => {
        imageRef.current = img;
        processImage();
      };
      img.src = image;
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [image, processImage]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetClick = (preset: Preset) => {
    setSettings(preset.settings);
  };

  const handleSave = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = 'monos-edited-photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Grid 
        container 
        spacing={2} 
        justifyContent="center"
        sx={{ width: '100%', m: 0 }}
      >
        <Grid 
          item 
          xs={12} 
          md={12}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Preview */}
          {processedImage ? (
            <Box
              component="img"
              src={processedImage}
              sx={{
                maxWidth: '90vw',
                maxHeight: '40vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                mt: 2,
              }}
            />
          ) : (
            <Paper 
              elevation={0}
              component="label"
              sx={{ 
                width: '90vw',
                maxWidth: 700,
                height: '40vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                bgcolor: 'transparent',
                border: '2px dashed',
                borderColor: '#d3d3d3',
                borderStyle: 'dashed',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                '&:hover': {
                  borderColor: '#bdbdbd',
                },
                mt: 2,
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.7,
                    textAlign: 'center',
                    px: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  Drag and drop an image here, or tap to upload
                </Typography>
              </Box>
            </Paper>
          )}
          {/* Camera Button */}
          <Paper sx={{ 
            p: { xs: 1, sm: 2 }, 
            width: { xs: '100%', md: '80%' }, 
            maxWidth: '100%', 
            overflowX: 'hidden', 
            bgcolor: '#f5f5f5', 
            mt: 2, 
            mx: { xs: 0, md: 'auto' } 
          }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ fontWeight: 600 }}
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              Take a Picture
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </Paper>
          {/* Presets */}
          <Paper sx={{ 
            p: { xs: 1, sm: 3 }, 
            width: { xs: '100%', md: '80%' }, 
            maxWidth: '100%', 
            overflowX: 'hidden', 
            mt: 3, 
            mx: { xs: 0, md: 'auto' } 
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
              textAlign: 'left',
              mb: { xs: 1, sm: 2 }
            }}>
              Film Presets
            </Typography>
            <Stack 
              spacing={2} 
              direction="row"
              sx={{ 
                maxHeight: 'none',
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 2,
                px: 1,
                width: '100%',
                justifyContent: { xs: 'flex-start', md: 'flex-start' },
                '&::-webkit-scrollbar': {
                  height: '6px',
                  width: '0',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}
            >
              {PRESETS.map((preset) => (
                <PresetCard
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  sx={{
                    minWidth: { xs: 180, sm: 220 },
                    flex: '0 0 auto',
                    bgcolor: settings === preset.settings ? 'action.selected' : undefined,
                    p: { xs: 1, sm: 2 },
                  }}
                >
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="space-between"
                    spacing={1}
                  >
                    <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
                      <Typography 
                        variant="subtitle2" 
                        noWrap 
                        sx={{ 
                          fontWeight: settings === preset.settings ? 600 : 400,
                          fontSize: '0.95rem',
                          textAlign: 'left'
                        }}
                      >
                        {preset.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.2,
                          fontSize: '0.8rem',
                          textAlign: 'left'
                        }}
                      >
                        {preset.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.8rem',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontWeight: 500 }}>{preset.manufacturer}</span>
                        •
                        <span>ISO {preset.speed}</span>
                      </Typography>
                    </Stack>
                    <Box 
                      sx={{ 
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: preset.settings.tint?.color || '#ffffff',
                        border: '2px solid #e0e0e0',
                        flexShrink: 0,
                        cursor: 'inherit',
                      }}
                    />
                  </Stack>
                </PresetCard>
              ))}
            </Stack>
          </Paper>
          {/* Adjustments */}
          <Paper sx={{ 
            p: { xs: 1, sm: 3 }, 
            width: { xs: '100%', md: '80%' }, 
            maxWidth: '100%', 
            overflowX: 'hidden', 
            mt: 3, 
            mb: 3, 
            mx: { xs: 0, md: 'auto' } 
          }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' }, 
                textAlign: 'left', 
                mb: { xs: 2, sm: 3 }
              }}
            >
              Adjustments
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1 }}>
                <Typography gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, textAlign: 'left' }}>Contrast</Typography>
                <Slider
                  value={settings.contrast}
                  onChange={(_, value) => setSettings(prev => ({ ...prev, contrast: value as number }))}
                  min={-50}
                  max={100}
                  step={1}
                  size="medium"
                  sx={{
                    width: '100%',
                    '& .MuiSlider-thumb': {
                      width: 22,
                      height: 22,
                    },
                  }}
                />
              </Box>
              <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1 }}>
                <Typography gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, textAlign: 'left' }}>Brightness</Typography>
                <Slider
                  value={settings.brightness}
                  onChange={(_, value) => setSettings(prev => ({ ...prev, brightness: value as number }))}
                  min={-50}
                  max={50}
                  step={1}
                  size="medium"
                  sx={{
                    width: '100%',
                    '& .MuiSlider-thumb': {
                      width: 22,
                      height: 22,
                    },
                  }}
                />
              </Box>
              <Box sx={{ px: { xs: 2, sm: 3 }, pb: 1 }}>
                <Typography gutterBottom sx={{ fontSize: { xs: '0.95rem', sm: '1rem' }, textAlign: 'left' }}>Grain</Typography>
                <Slider
                  value={settings.grain}
                  onChange={(_, value) => setSettings(prev => ({ ...prev, grain: value as number }))}
                  min={0}
                  max={50}
                  step={1}
                  size="medium"
                  sx={{
                    width: '100%',
                    '& .MuiSlider-thumb': {
                      width: 22,
                      height: 22,
                    },
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default Editor; 
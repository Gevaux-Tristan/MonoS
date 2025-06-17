import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Button, Stack, Snackbar, Alert } from '@mui/material';
import ImageEditor from './components/ImageEditor';
import FilmPresets from './components/FilmPresets';
import Camera from './components/Camera';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#666666',
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
  },
});

interface FilmPreset {
  name: string;
  exposure: number;
  contrast: number;
  grain: number;
  blur: number;
  description: string;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Store adjustment values in state
  const [exposure, setExposure] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [grain, setGrain] = useState(0);
  const [blur, setBlur] = useState(0);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowEditor(true);
        // Reset adjustments
        setExposure(0);
        setContrast(0);
        setGrain(0);
        setBlur(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (image: string) => {
    setSelectedImage(image);
    setShowEditor(true);
    // Reset adjustments
    setExposure(0);
    setContrast(0);
    setGrain(0);
    setBlur(0);
  };

  const handleSave = (editedImage: string) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `biwi-${new Date().toISOString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnackbar({
      open: true,
      message: 'Image saved successfully!',
      severity: 'success',
    });
  };

  // When a preset is selected, update the adjustment values
  const handlePresetSelect = (preset: FilmPreset) => {
    setExposure(preset.exposure);
    setContrast(preset.contrast);
    setGrain(preset.grain);
    setBlur(preset.blur);
    setSnackbar({
      open: true,
      message: `Applied ${preset.name} preset`,
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <header className="app-header">
          <h1>Biwi</h1>
        </header>
        <main className="app-main">
          {!showEditor ? (
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 600 }}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ py: 2 }}
              >
                Import Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              <Camera onCapture={handleCameraCapture} />
            </Stack>
          ) : (
            <>
              {selectedImage && (
                <ImageEditor
                  image={selectedImage}
                  onSave={handleSave}
                  exposure={exposure}
                  contrast={contrast}
                  grain={grain}
                  blur={blur}
                  setExposure={setExposure}
                  setContrast={setContrast}
                  setGrain={setGrain}
                  setBlur={setBlur}
                />
              )}
              <FilmPresets onSelectPreset={handlePresetSelect} />
              <Button
                variant="outlined"
                onClick={() => setShowEditor(false)}
                sx={{ mt: 2 }}
              >
                Back to Import
              </Button>
            </>
          )}
        </main>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}

export default App;

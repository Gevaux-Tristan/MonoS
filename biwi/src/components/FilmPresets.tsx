import React from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FilmPreset {
  name: string;
  exposure: number;
  contrast: number;
  grain: number;
  blur: number;
  description: string;
}

interface FilmPresetsProps {
  onSelectPreset: (preset: FilmPreset) => void;
}

const PresetButton = styled(Button)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
  whiteSpace: 'normal',
  '& .description': {
    fontSize: '0.75rem',
    opacity: 0.7,
    marginTop: theme.spacing(1),
  },
}));

const filmPresets: FilmPreset[] = [
  {
    name: 'Kodak Tri-X 400',
    exposure: 10,
    contrast: 20,
    grain: 30,
    blur: 0,
    description: 'Classic high-contrast black and white film with pronounced grain',
  },
  {
    name: 'Ilford HP5 Plus',
    exposure: 5,
    contrast: 15,
    grain: 25,
    blur: 0,
    description: 'Versatile film with good shadow detail and moderate grain',
  },
  {
    name: 'Kodak T-Max 100',
    exposure: 0,
    contrast: 25,
    grain: 10,
    blur: 0,
    description: 'Fine-grain film with excellent sharpness and contrast',
  },
  {
    name: 'Ilford Delta 3200',
    exposure: 15,
    contrast: 30,
    grain: 40,
    blur: 0,
    description: 'High-speed film with dramatic contrast and heavy grain',
  },
  {
    name: 'Fuji Neopan 400',
    exposure: 8,
    contrast: 18,
    grain: 22,
    blur: 0,
    description: 'Balanced film with smooth tones and moderate grain',
  },
  {
    name: 'Kodak Plus-X 125',
    exposure: -5,
    contrast: 15,
    grain: 15,
    blur: 0,
    description: 'Fine-grain film with excellent tonal range',
  },
];

const FilmPresets: React.FC<FilmPresetsProps> = ({ onSelectPreset }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Film Presets
      </Typography>
      <Grid container spacing={2}>
        {filmPresets.map((preset) => (
          <Grid item xs={12} sm={6} key={preset.name}>
            <Paper
              elevation={2}
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <PresetButton
                variant="outlined"
                fullWidth
                onClick={() => onSelectPreset(preset)}
              >
                <Typography variant="subtitle1">{preset.name}</Typography>
                <Typography className="description" variant="body2">
                  {preset.description}
                </Typography>
              </PresetButton>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FilmPresets; 
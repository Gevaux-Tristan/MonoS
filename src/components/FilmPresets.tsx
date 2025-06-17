import React, { useRef, useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSwipeable } from 'react-swipeable';

interface FilmPreset {
  name: string;
  exposure: number;
  contrast: number;
  grain: number;
  blur: number;
  description: string;
  tint: {
    hue: number;
    saturation: number;
    temperature: number;
  };
  paperTone: {
    base: number;
    highlight: number;
    shadow: number;
  };
}

interface FilmPresetsProps {
  onSelectPreset: (preset: FilmPreset) => void;
  mobileCarousel?: boolean;
}

const presets: FilmPreset[] = [
  {
    name: 'Ilford HP5 Plus',
    exposure: 100,
    contrast: 120,
    grain: 40,
    blur: 0,
    description: 'Contraste riche et grain caractéristique, parfait pour le portrait',
    tint: {
      hue: 0,
      saturation: 0,
      temperature: 0
    },
    paperTone: {
      base: 0,
      highlight: 2,
      shadow: -2
    }
  },
  {
    name: 'Kodak Tri-X 400',
    exposure: 110,
    contrast: 115,
    grain: 35,
    blur: 0,
    description: 'Grain fin et tons moyens détaillés, idéal pour la photo de rue',
    tint: {
      hue: 10,
      saturation: 8,
      temperature: 8
    },
    paperTone: {
      base: 2,
      highlight: 5,
      shadow: -4
    }
  },
  {
    name: 'Fuji Neopan 400',
    exposure: 105,
    contrast: 125,
    grain: 25,
    blur: 0,
    description: 'Grain ultra-fin et contraste élevé, excellent pour l\'architecture',
    tint: {
      hue: 210,
      saturation: 10,
      temperature: -10
    },
    paperTone: {
      base: -3,
      highlight: -1,
      shadow: -6
    }
  },
  {
    name: 'Kodak T-Max 400',
    exposure: 100,
    contrast: 130,
    grain: 20,
    blur: 0,
    description: 'Grain minimal et contraste puissant, parfait pour les paysages',
    tint: {
      hue: 0,
      saturation: 0,
      temperature: -6
    },
    paperTone: {
      base: -2,
      highlight: 0,
      shadow: -5
    }
  },
  {
    name: 'Ilford FP4 Plus',
    exposure: 95,
    contrast: 110,
    grain: 30,
    blur: 0,
    description: 'Tons doux et grain modéré, idéal pour le portrait classique',
    tint: {
      hue: 18,
      saturation: 12,
      temperature: 12
    },
    paperTone: {
      base: 4,
      highlight: 8,
      shadow: 2
    }
  },
  {
    name: 'Kodak Plus-X',
    exposure: 90,
    contrast: 105,
    grain: 25,
    blur: 0,
    description: 'Tons riches et grain fin, excellent pour la photo documentaire',
    tint: {
      hue: 12,
      saturation: 15,
      temperature: 15
    },
    paperTone: {
      base: 6,
      highlight: 10,
      shadow: 3
    }
  }
];

const CARD_WIDTH = 110;
const CARD_GAP = 16;
const CARD_HEIGHT = 55;

const FilmPresets: React.FC<FilmPresetsProps> = ({ onSelectPreset, mobileCarousel }) => {
  const theme = useTheme();
  const isMobile = mobileCarousel ?? useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Centrage automatique de la tuile sélectionnée
  useEffect(() => {
    if (isMobile && carouselRef.current) {
      const scrollTo = selectedIndex * (CARD_WIDTH + CARD_GAP) - carouselRef.current.offsetWidth / 2 + CARD_WIDTH / 2;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [selectedIndex, isMobile]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedIndex < presets.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        onSelectPreset(presets[selectedIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        onSelectPreset(presets[selectedIndex - 1]);
      }
    },
    trackMouse: true,
  });

  // Sélectionner le preset au clic
  const handleSelect = (preset: FilmPreset, idx: number) => {
    setSelectedIndex(idx);
    onSelectPreset(preset);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        mx: 'auto',
        p: 0,
        overflowX: isMobile ? 'auto' : 'visible',
        display: isMobile ? 'flex' : 'block',
        gap: isMobile ? 2 : 0,
        py: isMobile ? 1 : 0,
        minHeight: isMobile ? `${CARD_HEIGHT + 16}px` : undefined,
        alignItems: isMobile ? 'center' : undefined,
        overflowY: isMobile ? 'visible' : undefined,
      }}
      ref={isMobile ? carouselRef : undefined}
      {...(isMobile ? swipeHandlers : {})}
    >
      {isMobile ? (
        <Box
          ref={carouselRef}
          {...swipeHandlers}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            overflowY: 'hidden',
            gap: 1,
            minHeight: `${CARD_HEIGHT + 8}px`,
            maxHeight: `${CARD_HEIGHT + 8}px`,
            alignItems: 'center',
            px: 1,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {presets.map((preset, idx) => (
            <Card
              key={preset.name}
              sx={{
                minWidth: 110,
                maxWidth: 160,
                height: CARD_HEIGHT,
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: idx === selectedIndex ? '#e0e0e0' : '#f4f4f4',
                border: idx === selectedIndex ? '2px solid #fff' : '2px solid transparent',
                boxShadow: idx === selectedIndex ? 4 : 1,
                transition: 'background-color 0.3s, border 0.3s, box-shadow 0.3s',
                px: 2,
              }}
              onClick={() => handleSelect(preset, idx)}
            >
              <CardContent sx={{
                p: '0 !important',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="subtitle1" noWrap sx={{ color: '#161616', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', width: '100%' }}>
                    {preset.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          {presets.map((preset, idx) => (
            <Card
              key={preset.name}
              sx={{
                width: '100%',
                minHeight: CARD_HEIGHT,
                maxHeight: CARD_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: idx === selectedIndex ? '#e0e0e0' : '#f4f4f4',
                border: idx === selectedIndex ? '2px solid #fff' : '2px solid transparent',
                boxShadow: idx === selectedIndex ? 4 : 1,
                transition: 'background-color 0.3s, border 0.3s, box-shadow 0.3s',
                mb: 1,
                px: 2,
              }}
              onClick={() => handleSelect(preset, idx)}
            >
              <CardContent sx={{
                p: '0 !important',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Box sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Typography variant="subtitle1" noWrap sx={{ color: '#161616', fontWeight: 700, fontSize: '0.95rem', textAlign: 'center', width: '100%' }}>
                    {preset.name}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FilmPresets; 
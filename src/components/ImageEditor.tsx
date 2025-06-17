import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Slider, Typography, Stack } from '@mui/material';
import { FilmPreset } from '../types';

interface ImageEditorProps {
  image: string;
  onSave: (processedImage: string) => void;
  selectedPreset: FilmPreset | null;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, selectedPreset }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grain, setGrain] = useState(0);

  // Mettre à jour les ajustements quand un preset est sélectionné
  useEffect(() => {
    if (selectedPreset) {
      setBrightness(selectedPreset.exposure);
      setContrast(selectedPreset.contrast);
      setGrain(selectedPreset.grain);
    }
  }, [selectedPreset]);

  // Fonction pour générer du bruit gaussien
  const gaussianNoise = (mean: number, std: number) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  const applyFilmEffect = (imageData: ImageData, preset: FilmPreset) => {
    const { data } = imageData;
    const { exposure, contrast, grain, blur, tint, paperTone } = preset;

    // Appliquer l'exposition
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * (exposure / 100));
      data[i + 1] = Math.min(255, data[i + 1] * (exposure / 100));
      data[i + 2] = Math.min(255, data[i + 2] * (exposure / 100));
    }

    // Appliquer le contraste
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i] = factor * (data[i] - 128) + 128;
      data[i + 1] = factor * (data[i + 1] - 128) + 128;
      data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }

    // Fonction pour convertir HSL en RGB
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

    // Appliquer la teinte et le ton de papier
    for (let i = 0; i < data.length; i += 4) {
      // Convertir RGB en HSL
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h = (h * 60) % 360;
      }

      // Appliquer les ajustements de teinte
      h = (h + tint.hue) % 360;
      s = Math.min(1, Math.max(0, s + tint.saturation / 100));
      
      // Appliquer le ton de papier
      let paperL = l;
      if (l > 0.7) { // Highlights
        paperL = l + (paperTone.highlight / 100);
      } else if (l < 0.3) { // Shadows
        paperL = l + (paperTone.shadow / 100);
      } else { // Midtones
        paperL = l + (paperTone.base / 100);
      }
      paperL = Math.min(1, Math.max(0, paperL));
      
      // Convertir HSL modifié en RGB
      const [newR, newG, newB] = hslToRgb(h, s, paperL);
      
      // Appliquer la température
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

      // Appliquer un mélange de la teinte avec l'image originale
      const blendFactor = 0.7; // Ajuster ce facteur pour contrôler l'intensité de la teinte
      data[i] = finalR * blendFactor + data[i] * (1 - blendFactor);
      data[i + 1] = finalG * blendFactor + data[i + 1] * (1 - blendFactor);
      data[i + 2] = finalB * blendFactor + data[i + 2] * (1 - blendFactor);
    }

    // Appliquer le grain
    const noise = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      // Calculer la luminance
      const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      
      // Générer du bruit gaussien
      const u1 = Math.random();
      const u2 = Math.random();
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      // Appliquer le grain de manière non-linéaire basée sur la luminance
      const grainAmount = grain * (1 - Math.pow(luminance, 2)) * 0.5;
      const noiseValue = z0 * grainAmount;
      
      noise[i] = noise[i + 1] = noise[i + 2] = noiseValue;
      noise[i + 3] = 0;
    }

    // Appliquer le flou si nécessaire
    if (blur > 0) {
      const tempData = new Uint8ClampedArray(data);
      const kernelSize = Math.floor(blur * 2) + 1;
      const kernel = new Array(kernelSize * kernelSize).fill(1 / (kernelSize * kernelSize));
      
      for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
          let r = 0, g = 0, b = 0;
          
          for (let ky = 0; ky < kernelSize; ky++) {
            for (let kx = 0; kx < kernelSize; kx++) {
              const posX = Math.min(Math.max(x + kx - Math.floor(kernelSize / 2), 0), imageData.width - 1);
              const posY = Math.min(Math.max(y + ky - Math.floor(kernelSize / 2), 0), imageData.height - 1);
              const idx = (posY * imageData.width + posX) * 4;
              
              r += tempData[idx] * kernel[ky * kernelSize + kx];
              g += tempData[idx + 1] * kernel[ky * kernelSize + kx];
              b += tempData[idx + 2] * kernel[ky * kernelSize + kx];
            }
          }
          
          const idx = (y * imageData.width + x) * 4;
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
        }
      }
    }

    // Combiner le grain avec l'image
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + noise[i]));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise[i + 1]));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise[i + 2]));
    }

    return imageData;
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = image;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Appliquer les filtres noir et blanc
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(100%)`;
      
      // Dessiner l'image
      ctx.drawImage(img, 0, 0);

      // Appliquer le grain de manière plus réaliste
      if (grain > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const updatedImageData = applyFilmEffect(imageData, selectedPreset!);
        ctx.putImageData(updatedImageData, 0, 0);
      }

      const editedImage = canvas.toDataURL('image/jpeg', 0.95);
      onSave(editedImage);
    };
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <Stack spacing={3}>
        <Box>
          <Typography gutterBottom>Luminosité</Typography>
          <Slider
            value={brightness}
            onChange={(_, value) => setBrightness(value as number)}
            min={0}
            max={200}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
          />
        </Box>

        <Box>
          <Typography gutterBottom>Contraste</Typography>
          <Slider
            value={contrast}
            onChange={(_, value) => setContrast(value as number)}
            min={0}
            max={200}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
          />
        </Box>

        <Box>
          <Typography gutterBottom>Grain</Typography>
          <Slider
            value={grain}
            onChange={(_, value) => setGrain(value as number)}
            min={0}
            max={50}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Sauvegarder l'image
        </Button>
      </Stack>
    </Box>
  );
};

export default ImageEditor; 
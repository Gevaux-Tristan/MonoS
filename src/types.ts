export interface FilmPreset {
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
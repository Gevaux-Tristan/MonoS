/// <reference lib="webworker" />

interface ImageProcessingSettings {
  contrast: number;
  brightness: number;
  grain: number;
  tint?: {
    color: string;
    intensity: number;
  };
}

const processImageData = (data: Uint8ClampedArray, settings: ImageProcessingSettings) => {
  // Process chunks of pixels for better performance
  const chunkSize = 4096; // Process 1024 pixels at a time
  
  for (let i = 0; i < data.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, data.length);
    
    for (let j = i; j < end; j += 4) {
      // Optimized grayscale conversion using integer math
      const gray = ((data[j] * 76) + (data[j + 1] * 150) + (data[j + 2] * 29)) >> 8;
      
      // Apply brightness and contrast with optimized calculations
      let value = gray + ((settings.brightness * gray) >> 7);
      value = 128 + (((value - 128) * (settings.contrast + 100)) >> 7);
      
      // Apply grain with reduced random calls
      if (settings.grain > 0) {
        // Generate noise less frequently and reuse it for nearby pixels
        if ((j & 15) === 0) { // Only generate new noise every 4 pixels
          value += ((Math.random() * 2 - 1) * settings.grain);
        }
      }
      
      // Clamp values using Math.min/max
      value = value < 0 ? 0 : value > 255 ? 255 : value;

      // Apply tint if present
      if (settings.tint) {
        const intensity = settings.tint.intensity / 100;
        
        // Parse tint color once and cache the values
        const r = parseInt(settings.tint.color.slice(1, 3), 16);
        const g = parseInt(settings.tint.color.slice(3, 5), 16);
        const b = parseInt(settings.tint.color.slice(5, 7), 16);
        
        // Optimized tint mixing
        const invIntensity = 1 - intensity;
        data[j] = value * invIntensity + r * intensity;
        data[j + 1] = value * invIntensity + g * intensity;
        data[j + 2] = value * invIntensity + b * intensity;
      } else {
        // Set all channels to the same value for B&W
        data[j] = data[j + 1] = data[j + 2] = value;
      }
      
      // Alpha channel should always be 255
      data[j + 3] = 255;
    }
  }
  
  return data;
};

// Web Worker context type declaration
declare const self: DedicatedWorkerGlobalScope;

// Web Worker message handler
self.onmessage = (e: MessageEvent) => {
  const { imageData, settings, width, height } = e.data;
  
  // Create a new Uint8ClampedArray from the received data
  const inputArray = new Uint8ClampedArray(imageData.data);
  
  // Process the image data
  const processedData = processImageData(inputArray, settings);
  
  // Send back the processed data with dimensions
  self.postMessage({ 
    processedData: Array.from(processedData), // Convert to regular array for transfer
    width,
    height
  });
};

export {}; 
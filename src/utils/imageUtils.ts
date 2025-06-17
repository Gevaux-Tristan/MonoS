interface ImageAdjustments {
  exposure: number;
  contrast: number;
  grain: number;
  blur: number;
}

export const applyImageAdjustments = async (
  imageUrl: string,
  adjustments: ImageAdjustments
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply adjustments
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Apply exposure
        let adjustedValue = avg + adjustments.exposure;

        // Apply contrast
        const factor = (259 * (adjustments.contrast + 255)) / (255 * (259 - adjustments.contrast));
        adjustedValue = factor * (adjustedValue - 128) + 128;

        // Clamp values
        adjustedValue = Math.max(0, Math.min(255, adjustedValue));

        // Set grayscale values
        data[i] = adjustedValue;     // R
        data[i + 1] = adjustedValue; // G
        data[i + 2] = adjustedValue; // B
      }

      // Apply grain
      if (adjustments.grain > 0) {
        for (let i = 0; i < data.length; i += 4) {
          const grain = (Math.random() - 0.5) * adjustments.grain;
          data[i] = Math.max(0, Math.min(255, data[i] + grain));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        }
      }

      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Apply lens-like radial blur if needed
      if (adjustments.blur > 0) {
        // Create a blurred version of the image
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = canvas.width;
        blurCanvas.height = canvas.height;
        const blurCtx = blurCanvas.getContext('2d');
        if (!blurCtx) return;
        blurCtx.filter = `blur(${adjustments.blur}px)`;
        blurCtx.drawImage(canvas, 0, 0);

        // Draw the original (sharp) image first
        ctx.drawImage(canvas, 0, 0);

        // Create a radial alpha mask for the blur
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxRadius = Math.sqrt(cx * cx + cy * cy);
        const gradient = maskCtx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
        gradient.addColorStop(0, 'rgba(0,0,0,0)'); // center: transparent
        gradient.addColorStop(0.6, 'rgba(0,0,0,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)'); // edge: opaque
        maskCtx.fillStyle = gradient;
        maskCtx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the mask as globalAlpha for the blurred image
        ctx.save();
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.drawImage(blurCanvas, 0, 0);
      }

      // Convert to base64 with quality control
      const quality = 0.8; // Adjust quality to meet 5MB limit
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = imageUrl;
  });
};

export const compressImage = async (imageUrl: string, maxSizeMB: number = 5): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Calculate dimensions to maintain aspect ratio
      let width = img.width;
      let height = img.height;
      const maxDimension = 2048; // Maximum dimension to prevent excessive memory usage

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Start with high quality and reduce until size is acceptable
      let quality = 0.9;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      while (dataUrl.length > maxSizeMB * 1024 * 1024 && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };
    img.src = imageUrl;
  });
}; 
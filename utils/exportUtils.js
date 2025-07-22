import { generateExportFilename, generateUniqueExportFilename } from './fileNaming.js';

/**
 * Exports an image with the monoS naming convention
 * @param {HTMLCanvasElement} canvas - The canvas to export
 * @param {string} format - The export format ('jpeg', 'png', 'webp')
 * @param {number} quality - The export quality (0-1)
 * @returns {Promise<void>}
 */
export const exportImage = async (canvas, format = 'jpeg', quality = 0.9) => {
  try {
    // Generate filename based on format
    const extension = format === 'jpeg' ? 'jpg' : format;
    const filename = generateExportFilename(extension);
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, `image/${format}`, quality);
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Exported: ${filename}`);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

/**
 * Exports an image with unique naming (includes seconds)
 * @param {HTMLCanvasElement} canvas - The canvas to export
 * @param {string} format - The export format
 * @param {number} quality - The export quality
 * @returns {Promise<void>}
 */
export const exportImageUnique = async (canvas, format = 'jpeg', quality = 0.9) => {
  try {
    const extension = format === 'jpeg' ? 'jpg' : format;
    const filename = generateUniqueExportFilename(extension);
    
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, `image/${format}`, quality);
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Exported: ${filename}`);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

/**
 * Exports multiple formats of the same image
 * @param {HTMLCanvasElement} canvas - The canvas to export
 * @param {Array<string>} formats - Array of formats to export
 * @param {number} quality - The export quality
 * @returns {Promise<void>}
 */
export const exportMultipleFormats = async (canvas, formats = ['jpeg', 'png'], quality = 0.9) => {
  try {
    for (const format of formats) {
      await exportImage(canvas, format, quality);
    }
  } catch (error) {
    console.error('Multiple format export failed:', error);
    throw error;
  }
}; 
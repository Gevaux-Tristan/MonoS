/**
 * Generates a filename with the format "monoS-date-hour"
 * @param {string} extension - The file extension (e.g., 'jpg', 'png', 'pdf')
 * @returns {string} - The generated filename
 */
export const generateExportFilename = (extension = 'jpg') => {
  const now = new Date();
  
  // Format date as YYYY-MM-DD
  const date = now.toISOString().split('T')[0];
  
  // Format hour as HH (24-hour format)
  const hour = now.getHours().toString().padStart(2, '0');
  
  // Format minutes as MM
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  // Create filename: monoS-YYYY-MM-DD-HH-MM
  const filename = `monoS-${date}-${hour}-${minutes}.${extension}`;
  
  return filename;
};

/**
 * Generates a filename with custom date and time
 * @param {Date} date - Custom date object
 * @param {string} extension - The file extension
 * @returns {string} - The generated filename
 */
export const generateExportFilenameWithDate = (date, extension = 'jpg') => {
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().split('T')[0];
  
  // Format hour as HH (24-hour format)
  const hour = date.getHours().toString().padStart(2, '0');
  
  // Format minutes as MM
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  // Create filename: monoS-YYYY-MM-DD-HH-MM
  const filename = `monoS-${dateStr}-${hour}-${minutes}.${extension}`;
  
  return filename;
};

/**
 * Generates a filename with timestamp for unique naming
 * @param {string} extension - The file extension
 * @returns {string} - The generated filename with timestamp
 */
export const generateUniqueExportFilename = (extension = 'jpg') => {
  const now = new Date();
  
  // Format date as YYYY-MM-DD
  const date = now.toISOString().split('T')[0];
  
  // Format hour as HH (24-hour format)
  const hour = now.getHours().toString().padStart(2, '0');
  
  // Format minutes as MM
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  // Add seconds for uniqueness
  const seconds = now.getSeconds().toString().padStart(2, '0');
  
  // Create filename: monoS-YYYY-MM-DD-HH-MM-SS
  const filename = `monoS-${date}-${hour}-${minutes}-${seconds}.${extension}`;
  
  return filename;
}; 
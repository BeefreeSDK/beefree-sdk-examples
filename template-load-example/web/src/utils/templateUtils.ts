/**
 * Utility functions for template management
 */

/**
 * Generates a unique copy name for a template using timestamp
 * Simple, reliable, and always unique approach
 * @param baseName - The base name to create a copy from
 * @returns A unique copy name with timestamp (e.g., "Template (Copy 1703123456789)")
 */
export const generateCopyName = (baseName: string): string => {
  const timestamp = Date.now();
  return `${baseName} (Copy ${timestamp})`;
};

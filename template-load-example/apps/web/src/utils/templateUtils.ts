import { Template } from '../types';

/**
 * Utility functions for template management
 */

/**
 * Generates a unique copy name for a template by checking existing template names
 * @param baseName - The base name to create a copy from
 * @param allTemplates - Array of all existing templates to check against
 * @returns A unique copy name (e.g., "Template (Copy)", "Template (Copy 2)", etc.)
 */
export const generateCopyName = (
  baseName: string,
  allTemplates: Template[]
): string => {
  const existingNames = allTemplates.map((t) => t.name);

  // Check if base name + " (Copy)" is available
  let copyName = baseName + ' (Copy)';
  if (!existingNames.includes(copyName)) {
    return copyName;
  }

  // Find the next available number
  let copyNumber = 2;
  while (true) {
    copyName = baseName + ` (Copy ${copyNumber})`;
    if (!existingNames.includes(copyName)) {
      return copyName;
    }
    copyNumber++;
  }
};

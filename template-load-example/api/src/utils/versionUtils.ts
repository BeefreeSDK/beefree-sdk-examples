/**
 * Utility functions for version management
 */

/**
 * Increments the patch version of a semantic version string
 * @param version - The version string to increment (e.g., "1.0.0")
 * @returns The incremented version string (e.g., "1.0.1")
 */
export const incrementVersion = (version: string): string => {
  const parts = version.split('.');
  const major = parseInt(parts[0]) || 0;
  const minor = parseInt(parts[1]) || 0;
  const patch = parseInt(parts[2]) || 0;

  // Increment patch version
  return `${major}.${minor}.${patch + 1}`;
};

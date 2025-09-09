import { z } from 'zod';

// Response schemas for API validation
export const HealthResponse = z.object({
  status: z.literal('ok'),
});

export const VersionResponse = z.object({
  version: z.string(),
});

// Type exports for use in handlers
export type HealthResponseType = z.infer<typeof HealthResponse>;
export type VersionResponseType = z.infer<typeof VersionResponse>;

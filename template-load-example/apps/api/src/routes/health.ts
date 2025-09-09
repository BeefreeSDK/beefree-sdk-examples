import { Router, Request, Response } from 'express';
import { HealthResponse } from '../validation/schemas';

const router: Router = Router();

/**
 * GET /health
 * Returns server health status
 */
router.get('/', (req, res) => {
  const response = { status: 'ok' as const };

  // Validate response with Zod schema
  const validatedResponse = HealthResponse.parse(response);

  res.json(validatedResponse);
});

export default router;

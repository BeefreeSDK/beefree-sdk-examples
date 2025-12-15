import { Router } from 'express';
import { VersionResponse } from '../validation/schemas';
import packageJson from '../../package.json';

const router: Router = Router();

/**
 * GET /version
 * Returns API version from package.json
 */
router.get('/', (_req, res) => {
  const response = { version: packageJson.version };

  // Validate response with Zod schema
  const validatedResponse = VersionResponse.parse(response);

  res.json(validatedResponse);
});

export default router;

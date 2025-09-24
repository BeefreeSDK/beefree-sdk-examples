import express from 'express';
// Import the shared auth module
// @ts-expect-error - Shared module is JavaScript without type declarations
import { authenticateBeefree } from '../../../../../shared/auth.js';

const router = express.Router();

/**
 * POST /auth
 * Authenticate with Beefree SDK and return token using shared auth module
 * This matches the shared auth module's expected endpoint structure
 */
router.post('', async (req, res) => {
  try {
    // Get Beefree credentials from environment
    const clientId = process.env.BEEFREE_CLIENT_ID;
    const clientSecret = process.env.BEEFREE_CLIENT_SECRET;
    const defaultUid = process.env.BEEFREE_UID || 'demo-user';

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Missing Beefree credentials in server configuration',
      });
    }

    // Use default UID from environment (frontend doesn't send UID)
    const userId = defaultUid;

    // Use shared authentication module
    const token = await authenticateBeefree(clientId, clientSecret, userId);

    res.json(token);
  } catch (error: any) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      details: error.message,
    });
  }
});

export default router;

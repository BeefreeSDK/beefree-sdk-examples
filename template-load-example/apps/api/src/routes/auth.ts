import express from 'express';

const router = express.Router();

/**
 * Authenticate with Beefree SDK and get access token
 */
async function authenticateBeefree(
  clientId: string,
  clientSecret: string,
  uid: string
) {
  const authUrl = 'https://auth.getbee.io/loginV2';

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      uid: uid,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * POST /auth
 * Authenticate with Beefree SDK and return token
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

    // Use local authentication function
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

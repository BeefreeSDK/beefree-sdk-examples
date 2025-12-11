import { Request, Response, NextFunction } from 'express';

/**
 * API Key middleware
 * - If API_KEY is set in env, require x-api-key header to match
 * - If API_KEY is empty, allow all requests (demo mode)
 */
export const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = process.env.API_KEY;

  // If no API key is configured, allow all requests (demo mode)
  if (!apiKey || apiKey.trim() === '') {
    return next();
  }

  // Check for x-api-key header
  const providedKey = req.headers['x-api-key'];

  if (!providedKey || providedKey !== apiKey) {
    return res.status(401).json({ message: 'Invalid or missing API key' });
  }

  next();
};

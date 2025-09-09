import { Router, Request, Response } from 'express';
import { templateService } from '../services/templateService';
import { TemplateListResponse } from '../validation/schemas';

const router: Router = Router();

/**
 * GET /templates
 * Returns list of all templates
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await templateService.listTemplates();

    // Validate response with Zod schema
    const validatedResponse = TemplateListResponse.parse(result);

    res.json(validatedResponse);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
});

export default router;

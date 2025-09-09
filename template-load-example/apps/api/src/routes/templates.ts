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

/**
 * DELETE /templates/:id
 * Delete a template by ID
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Template ID is required' });
    }

    await templateService.deleteTemplate(id);
    res.status(204).send(); // No content response for successful deletion
  } catch (error) {
    console.error('Error deleting template:', error);

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(500).json({ message: 'Failed to delete template' });
  }
});

export default router;

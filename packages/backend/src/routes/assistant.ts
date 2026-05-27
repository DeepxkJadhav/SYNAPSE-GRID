import { Router, Request, Response } from 'express';
import { codeAssistantBot } from '../services/codeAssistant';

const router = Router();

/**
 * Review code for issues and suggestions
 * POST /api/assistant/review
 * Body: { code: string, language: string }
 */
router.post('/review', async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const review = await codeAssistantBot.reviewCode(code, language);
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get code completion suggestions
 * POST /api/assistant/complete
 * Body: { code: string, language: string, context?: string }
 */
router.post('/complete', async (req: Request, res: Response) => {
  try {
    const { code, language, context } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const completion = await codeAssistantBot.suggestCompletion(code, language, context);
    res.json(completion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Analyze and fix bugs
 * POST /api/assistant/debug
 * Body: { errorMessage: string, code: string, language: string }
 */
router.post('/debug', async (req: Request, res: Response) => {
  try {
    const { errorMessage, code, language } = req.body;

    if (!errorMessage || !code || !language) {
      return res.status(400).json({ error: 'Error message, code, and language are required' });
    }

    const bugFix = await codeAssistantBot.analyzeBug(errorMessage, code, language);
    res.json(bugFix);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate code from description
 * POST /api/assistant/generate
 * Body: { description: string, language: string }
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { description, language } = req.body;

    if (!description || !language) {
      return res.status(400).json({ error: 'Description and language are required' });
    }

    const generated = await codeAssistantBot.generateCode(description, language);
    res.json(generated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Explain code
 * POST /api/assistant/explain
 * Body: { code: string, language: string }
 */
router.post('/explain', async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const explanation = await codeAssistantBot.explainCode(code, language);
    res.json({ explanation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

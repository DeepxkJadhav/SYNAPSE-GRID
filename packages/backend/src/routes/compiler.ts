import { Router, Request, Response } from 'express';
import { compilerService, SupportedLanguage } from '../services/compiler';

const router = Router();

/**
 * Compile code in specified language
 * POST /api/compiler/compile
 * Body: { code: string, language: SupportedLanguage }
 */
router.post('/compile', async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const supportedLanguages: SupportedLanguage[] = [
      'python',
      'javascript',
      'typescript',
      'java',
      'cpp',
      'go',
      'rust',
      'csharp',
    ];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    const result = await compilerService.compile(code, language);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Execute code in specified language
 * POST /api/compiler/execute
 * Body: { code: string, language: SupportedLanguage, input?: string }
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const supportedLanguages: SupportedLanguage[] = [
      'python',
      'javascript',
      'typescript',
      'java',
      'cpp',
      'go',
      'rust',
      'csharp',
    ];

    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    const result = await compilerService.execute(code, language, input);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get supported languages
 * GET /api/compiler/languages
 */
router.get('/languages', (req: Request, res: Response) => {
  const languages = [
    { name: 'Python', value: 'python', ext: '.py' },
    { name: 'JavaScript', value: 'javascript', ext: '.js' },
    { name: 'TypeScript', value: 'typescript', ext: '.ts' },
    { name: 'Java', value: 'java', ext: '.java' },
    { name: 'C++', value: 'cpp', ext: '.cpp' },
    { name: 'Go', value: 'go', ext: '.go' },
    { name: 'Rust', value: 'rust', ext: '.rs' },
    { name: 'C#', value: 'csharp', ext: '.cs' },
  ];
  res.json(languages);
});

export default router;

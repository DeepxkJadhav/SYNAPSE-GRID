import { Router, Request, Response } from 'express';
import { primeAgentService } from '../services/primeAgentService';
import {
  PrimeAgentExecuteRequest,
  PrimeReplRequest,
  PrimeSelfHealingRequest,
} from '@synapse/shared';

const router = Router();

/**
 * GET /api/prime/status
 * Get Prime Agent runtime and daemon availability
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await primeAgentService.getStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/prime/agents
 * List active Prime Agent sessions and subagents
 */
router.get('/agents', async (req: Request, res: Response) => {
  try {
    const sessions = await primeAgentService.listSessions();
    res.json({ sessions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/prime/execute
 * Execute autonomous prompt or RLM task
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const request: PrimeAgentExecuteRequest = req.body;
    if (!request.prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await primeAgentService.executeTask(request);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/prime/repl
 * Interactive REPL scratchpad execution
 */
router.post('/repl', async (req: Request, res: Response) => {
  try {
    const request: PrimeReplRequest = req.body;
    if (typeof request.command !== 'string') {
      return res.status(400).json({ error: 'Command is required' });
    }
    const result = await primeAgentService.executeRepl(request);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/prime/heal
 * Autonomous self-healing for compilation/runtime bugs
 */
router.post('/heal', async (req: Request, res: Response) => {
  try {
    const request: PrimeSelfHealingRequest = req.body;
    if (!request.code || !request.errorTrace) {
      return res.status(400).json({ error: 'Code and errorTrace are required' });
    }
    const result = await primeAgentService.selfHeal(request);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/prime/refine
 * Append and refine learned lessons in Continual Harness memory
 */
router.post('/refine', async (req: Request, res: Response) => {
  try {
    const { lesson } = req.body;
    if (!lesson) {
      return res.status(400).json({ error: 'Lesson is required' });
    }
    const lessons = await primeAgentService.refineLessons(lesson);
    res.json({ lessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

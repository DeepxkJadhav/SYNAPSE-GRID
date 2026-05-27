import { Router, Request, Response } from 'express';
import { hostControlService } from '../services/hostControl';

const router = Router();

/**
 * Get system information
 * GET /api/host/system-info
 */
router.get('/system-info', async (req: Request, res: Response) => {
  try {
    const systemInfo = await hostControlService.getSystemInfo();
    res.json(systemInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get current processes
 * GET /api/host/processes
 */
router.get('/processes', async (req: Request, res: Response) => {
  try {
    const processes = await hostControlService.getProcesses();
    res.json(processes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Kill a process
 * POST /api/host/processes/:pid/kill
 */
router.post('/processes/:pid/kill', async (req: Request, res: Response) => {
  try {
    const pid = parseInt(req.params.pid);

    if (isNaN(pid)) {
      return res.status(400).json({ error: 'Invalid process ID' });
    }

    const result = await hostControlService.killProcess(pid);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get CPU usage
 * GET /api/host/cpu-usage
 */
router.get('/cpu-usage', async (req: Request, res: Response) => {
  try {
    const cpuUsage = await hostControlService.getCpuUsage();
    res.json({ cpuUsage });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get memory usage
 * GET /api/host/memory-usage
 */
router.get('/memory-usage', async (req: Request, res: Response) => {
  try {
    const memoryUsage = await hostControlService.getMemoryUsage();
    res.json(memoryUsage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Record resource usage snapshot
 * POST /api/host/record-usage
 */
router.post('/record-usage', async (req: Request, res: Response) => {
  try {
    const usage = await hostControlService.recordResourceUsage();
    res.json(usage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get resource usage history
 * GET /api/host/usage-history
 */
router.get('/usage-history', (req: Request, res: Response) => {
  try {
    const history = hostControlService.getResourceHistory();
    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get available ports
 * GET /api/host/available-ports?start=3000&end=3100
 */
router.get('/available-ports', async (req: Request, res: Response) => {
  try {
    const start = parseInt(req.query.start as string) || 3000;
    const end = parseInt(req.query.end as string) || 3100;

    const ports = await hostControlService.getAvailablePorts(start, end);
    res.json({ availablePorts: ports });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get network information
 * GET /api/host/network-info
 */
router.get('/network-info', async (req: Request, res: Response) => {
  try {
    const networkInfo = await hostControlService.getNetworkInfo();
    res.json(networkInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get disk health
 * GET /api/host/disk-health
 */
router.get('/disk-health', async (req: Request, res: Response) => {
  try {
    const diskHealth = await hostControlService.getDiskHealth();
    res.json(diskHealth);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get system load
 * GET /api/host/system-load
 */
router.get('/system-load', async (req: Request, res: Response) => {
  try {
    const load = await hostControlService.getSystemLoad();
    res.json(load);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

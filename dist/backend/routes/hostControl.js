"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hostControl_1 = require("../services/hostControl");
const router = (0, express_1.Router)();
/**
 * Get system information
 * GET /api/host/system-info
 */
router.get('/system-info', async (req, res) => {
    try {
        const systemInfo = await hostControl_1.hostControlService.getSystemInfo();
        res.json(systemInfo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get current processes
 * GET /api/host/processes
 */
router.get('/processes', async (req, res) => {
    try {
        const processes = await hostControl_1.hostControlService.getProcesses();
        res.json(processes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Kill a process
 * POST /api/host/processes/:pid/kill
 */
router.post('/processes/:pid/kill', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: 'Invalid process ID' });
        }
        const result = await hostControl_1.hostControlService.killProcess(pid);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get CPU usage
 * GET /api/host/cpu-usage
 */
router.get('/cpu-usage', async (req, res) => {
    try {
        const cpuUsage = await hostControl_1.hostControlService.getCpuUsage();
        res.json({ cpuUsage });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get memory usage
 * GET /api/host/memory-usage
 */
router.get('/memory-usage', async (req, res) => {
    try {
        const memoryUsage = await hostControl_1.hostControlService.getMemoryUsage();
        res.json(memoryUsage);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Record resource usage snapshot
 * POST /api/host/record-usage
 */
router.post('/record-usage', async (req, res) => {
    try {
        const usage = await hostControl_1.hostControlService.recordResourceUsage();
        res.json(usage);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get resource usage history
 * GET /api/host/usage-history
 */
router.get('/usage-history', (req, res) => {
    try {
        const history = hostControl_1.hostControlService.getResourceHistory();
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get available ports
 * GET /api/host/available-ports?start=3000&end=3100
 */
router.get('/available-ports', async (req, res) => {
    try {
        const start = parseInt(req.query.start) || 3000;
        const end = parseInt(req.query.end) || 3100;
        const ports = await hostControl_1.hostControlService.getAvailablePorts(start, end);
        res.json({ availablePorts: ports });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get network information
 * GET /api/host/network-info
 */
router.get('/network-info', async (req, res) => {
    try {
        const networkInfo = await hostControl_1.hostControlService.getNetworkInfo();
        res.json(networkInfo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get disk health
 * GET /api/host/disk-health
 */
router.get('/disk-health', async (req, res) => {
    try {
        const diskHealth = await hostControl_1.hostControlService.getDiskHealth();
        res.json(diskHealth);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
/**
 * Get system load
 * GET /api/host/system-load
 */
router.get('/system-load', async (req, res) => {
    try {
        const load = await hostControl_1.hostControlService.getSystemLoad();
        res.json(load);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=hostControl.js.map
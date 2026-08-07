"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hostControlService = exports.HostControlService = void 0;
const systeminformation_1 = __importDefault(require("systeminformation"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class HostControlService {
    constructor() {
        this.resourceHistory = [];
        this.maxHistorySize = 1440; // 24 hours at 1-minute intervals
    }
    async getSystemInfo() {
        try {
            const osInfo = await systeminformation_1.default.osInfo();
            const cpu = await systeminformation_1.default.cpu();
            const cpuSpeed = await systeminformation_1.default.cpuSpeed();
            const mem = await systeminformation_1.default.mem();
            const fsSize = await systeminformation_1.default.fsSize();
            return {
                hostname: osInfo.hostname,
                uptime: systeminformation_1.default.time().uptime,
                cpu: {
                    model: cpu.model,
                    cores: cpu.cores,
                    speed: cpuSpeed.avg,
                },
                memory: {
                    total: mem.total,
                    used: mem.used,
                    available: mem.available,
                    percent: (mem.used / mem.total) * 100,
                },
                disk: {
                    total: fsSize[0]?.size || 0,
                    used: fsSize[0]?.used || 0,
                    available: fsSize[0]?.available || 0,
                    percent: fsSize[0] ? (fsSize[0].used / fsSize[0].size) * 100 : 0,
                },
            };
        }
        catch (error) {
            throw new Error(`Failed to get system info: ${error.message}`);
        }
    }
    async getProcesses() {
        try {
            const processes = await systeminformation_1.default.processes();
            return processes.list
                .filter((p) => p.memory > 0)
                .slice(0, 20)
                .map((p) => ({
                pid: p.pid,
                name: p.name,
                cmd: p.command,
                memory: p.memory,
                cpu: p.cpu || 0,
            }));
        }
        catch (error) {
            throw new Error(`Failed to get processes: ${error.message}`);
        }
    }
    async killProcess(pid) {
        try {
            process.kill(pid);
            return { success: true, message: `Process ${pid} killed successfully` };
        }
        catch (error) {
            return { success: false, message: `Failed to kill process: ${error.message}` };
        }
    }
    async getCpuUsage() {
        try {
            const cpuLoad = await systeminformation_1.default.currentLoad();
            return cpuLoad.currentLoad;
        }
        catch (error) {
            throw new Error(`Failed to get CPU usage: ${error.message}`);
        }
    }
    async getMemoryUsage() {
        try {
            const mem = await systeminformation_1.default.mem();
            return {
                used: mem.used,
                total: mem.total,
                percent: (mem.used / mem.total) * 100,
            };
        }
        catch (error) {
            throw new Error(`Failed to get memory usage: ${error.message}`);
        }
    }
    async recordResourceUsage() {
        const cpuUsage = await this.getCpuUsage();
        const memUsage = await this.getMemoryUsage();
        const disk = await systeminformation_1.default.fsSize();
        const usage = {
            cpu: cpuUsage,
            memory: memUsage.percent,
            disk: disk[0] ? (disk[0].used / disk[0].size) * 100 : 0,
            timestamp: new Date(),
        };
        this.resourceHistory.push(usage);
        if (this.resourceHistory.length > this.maxHistorySize) {
            this.resourceHistory.shift();
        }
        return usage;
    }
    getResourceHistory() {
        return this.resourceHistory;
    }
    async getAvailablePorts(startPort = 3000, endPort = 3100) {
        const availablePorts = [];
        for (let port = startPort; port <= endPort; port++) {
            const status = await this.checkPort(port);
            if (status.status === 'closed') {
                availablePorts.push(port);
            }
        }
        return availablePorts;
    }
    async checkPort(port) {
        try {
            if (process.platform === 'win32') {
                const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
                return { port, status: stdout ? 'open' : 'closed' };
            }
            else {
                const { stdout } = await execAsync(`lsof -i :${port}`);
                return { port, status: stdout ? 'open' : 'closed' };
            }
        }
        catch {
            return { port, status: 'closed' };
        }
    }
    async getNetworkInfo() {
        try {
            const networkInterfaces = await systeminformation_1.default.networkInterfaces();
            return networkInterfaces;
        }
        catch (error) {
            throw new Error(`Failed to get network info: ${error.message}`);
        }
    }
    async getDiskHealth() {
        try {
            const diskLayout = await systeminformation_1.default.diskLayout();
            return diskLayout;
        }
        catch (error) {
            throw new Error(`Failed to get disk health: ${error.message}`);
        }
    }
    async getSystemLoad() {
        try {
            const load = await systeminformation_1.default.currentLoad();
            return {
                load1: load.avgLoad,
                load5: 0, // Not directly available in systeminformation
                load15: 0,
            };
        }
        catch (error) {
            throw new Error(`Failed to get system load: ${error.message}`);
        }
    }
}
exports.HostControlService = HostControlService;
exports.hostControlService = new HostControlService();
//# sourceMappingURL=hostControl.js.map
import si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SystemInfo {
  hostname: string;
  uptime: number;
  cpu: {
    model: string;
    cores: number;
    speed: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
    percent: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
    percent: number;
  };
}

export interface ProcessInfo {
  pid: number;
  name: string;
  cmd: string;
  memory: number;
  cpu: number;
}

export interface ResourceUsage {
  cpu: number;
  memory: number;
  disk: number;
  timestamp: Date;
}

export interface PortStatus {
  port: number;
  status: 'open' | 'closed';
  process?: string;
}

export class HostControlService {
  private resourceHistory: ResourceUsage[] = [];
  private readonly maxHistorySize = 1440; // 24 hours at 1-minute intervals

  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const osInfo = await si.osInfo();
      const cpu = await si.cpu();
      const speed = cpu.speed || 2.4;
      const mem = await si.mem();
      const fsSize = await si.fsSize();

      return {
        hostname: osInfo.hostname || 'localhost',
        uptime: si.time().uptime,
        cpu: {
          model: cpu.model || 'Standard CPU',
          cores: cpu.cores || 4,
          speed: speed,
        },
        memory: {
          total: mem.total,
          used: mem.used,
          available: mem.available,
          percent: (mem.used / mem.total) * 100,
        },
        disk: {
          total: (fsSize[0] as any)?.size || 0,
          used: (fsSize[0] as any)?.used || 0,
          available: (fsSize[0] as any)?.available || 0,
          percent: fsSize[0] ? ((fsSize[0] as any).used / (fsSize[0] as any).size) * 100 : 0,
        },
      };
    } catch (error: any) {
      throw new Error(`Failed to get system info: ${error.message}`);
    }
  }

  async getProcesses(): Promise<ProcessInfo[]> {
    try {
      const processes = await si.processes();
      return processes.list
        .filter((p: any) => p.memory > 0)
        .slice(0, 20)
        .map((p: any) => ({
          pid: p.pid,
          name: p.name,
          cmd: p.command,
          memory: p.memory,
          cpu: p.cpu || 0,
        }));
    } catch (error: any) {
      throw new Error(`Failed to get processes: ${error.message}`);
    }
  }

  async killProcess(pid: number): Promise<{ success: boolean; message: string }> {
    try {
      process.kill(pid);
      return { success: true, message: `Process ${pid} killed successfully` };
    } catch (error: any) {
      return { success: false, message: `Failed to kill process: ${error.message}` };
    }
  }

  async getCpuUsage(): Promise<number> {
    try {
      const cpuLoad = await si.currentLoad();
      return cpuLoad.currentLoad;
    } catch (error: any) {
      throw new Error(`Failed to get CPU usage: ${error.message}`);
    }
  }

  async getMemoryUsage(): Promise<{ used: number; total: number; percent: number }> {
    try {
      const mem = await si.mem();
      return {
        used: mem.used,
        total: mem.total,
        percent: (mem.used / mem.total) * 100,
      };
    } catch (error: any) {
      throw new Error(`Failed to get memory usage: ${error.message}`);
    }
  }

  async recordResourceUsage(): Promise<ResourceUsage> {
    const cpuUsage = await this.getCpuUsage();
    const memUsage = await this.getMemoryUsage();
    const disk = await si.fsSize();

    const usage: ResourceUsage = {
      cpu: cpuUsage,
      memory: memUsage.percent,
      disk: disk[0] ? ((disk[0] as any).used / (disk[0] as any).size) * 100 : 0,
      timestamp: new Date(),
    };

    this.resourceHistory.push(usage);
    if (this.resourceHistory.length > this.maxHistorySize) {
      this.resourceHistory.shift();
    }

    return usage;
  }

  getResourceHistory(): ResourceUsage[] {
    return this.resourceHistory;
  }

  async getAvailablePorts(startPort: number = 3000, endPort: number = 3100): Promise<number[]> {
    const availablePorts: number[] = [];

    for (let port = startPort; port <= endPort; port++) {
      const status = await this.checkPort(port);
      if (status.status === 'closed') {
        availablePorts.push(port);
      }
    }

    return availablePorts;
  }

  private async checkPort(port: number): Promise<PortStatus> {
    try {
      if (process.platform === 'win32') {
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        return { port, status: stdout ? 'open' : 'closed' };
      } else {
        const { stdout } = await execAsync(`lsof -i :${port}`);
        return { port, status: stdout ? 'open' : 'closed' };
      }
    } catch {
      return { port, status: 'closed' };
    }
  }

  async getNetworkInfo(): Promise<any> {
    try {
      const networkInterfaces = await si.networkInterfaces();
      return networkInterfaces;
    } catch (error: any) {
      throw new Error(`Failed to get network info: ${error.message}`);
    }
  }

  async getDiskHealth(): Promise<any> {
    try {
      const diskLayout = await si.diskLayout();
      return diskLayout;
    } catch (error: any) {
      throw new Error(`Failed to get disk health: ${error.message}`);
    }
  }

  async getSystemLoad(): Promise<{
    load1: number;
    load5: number;
    load15: number;
  }> {
    try {
      const load = await si.currentLoad();
      return {
        load1: load.avgLoad,
        load5: 0, // Not directly available in systeminformation
        load15: 0,
      };
    } catch (error: any) {
      throw new Error(`Failed to get system load: ${error.message}`);
    }
  }
}

export const hostControlService = new HostControlService();

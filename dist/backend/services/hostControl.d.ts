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
export declare class HostControlService {
    private resourceHistory;
    private readonly maxHistorySize;
    getSystemInfo(): Promise<SystemInfo>;
    getProcesses(): Promise<ProcessInfo[]>;
    killProcess(pid: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getCpuUsage(): Promise<number>;
    getMemoryUsage(): Promise<{
        used: number;
        total: number;
        percent: number;
    }>;
    recordResourceUsage(): Promise<ResourceUsage>;
    getResourceHistory(): ResourceUsage[];
    getAvailablePorts(startPort?: number, endPort?: number): Promise<number[]>;
    private checkPort;
    getNetworkInfo(): Promise<any>;
    getDiskHealth(): Promise<any>;
    getSystemLoad(): Promise<{
        load1: number;
        load5: number;
        load15: number;
    }>;
}
export declare const hostControlService: HostControlService;
//# sourceMappingURL=hostControl.d.ts.map
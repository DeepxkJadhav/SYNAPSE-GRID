import { HostControlService } from './hostControl';

describe('HostControlService', () => {
  let hostService: HostControlService;

  beforeEach(() => {
    hostService = new HostControlService();
  });

  it('retrieves system hardware and memory telemetry info', async () => {
    const info = await hostService.getSystemInfo();
    expect(info).toBeDefined();
    expect(info.hostname).toBeDefined();
    expect(info.memory).toBeDefined();
    expect(info.memory.total).toBeGreaterThan(0);
    expect(info.cpu).toBeDefined();
  });

  it('retrieves top running system processes', async () => {
    const processes = await hostService.getProcesses();
    expect(Array.isArray(processes)).toBe(true);
    if (processes.length > 0) {
      expect(processes[0]).toHaveProperty('pid');
      expect(processes[0]).toHaveProperty('name');
    }
  });
});

import { compilerService } from './compiler';

describe('CompilerService', () => {
  it('successfully executes JavaScript code in sandbox', async () => {
    const code = 'console.log("SYNAPSE_GRID_SANDBOX_OK");';
    const result = await compilerService.execute(code, 'javascript');

    expect(result.success).toBe(true);
    expect(result.stdout).toContain('SYNAPSE_GRID_SANDBOX_OK');
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
    expect(result.language).toBe('javascript');
  });

  it('captures syntax errors and runtime exceptions gracefully', async () => {
    const brokenCode = 'function broken() { throw new Error("FAULT_INDUCED"); } broken();';
    const result = await compilerService.execute(brokenCode, 'javascript');

    expect(result.success).toBe(false);
    expect(result.stderr).toContain('FAULT_INDUCED');
  });

  it('handles languages that do not require explicit pre-compilation', async () => {
    const result = await compilerService.compile('print("hello")', 'python');
    expect(result.success).toBe(true);
    expect(result.output).toContain('does not require a pre-compilation step');
  });

  it('cleans up temp directory files without throwing', async () => {
    await expect(compilerService.cleanup()).resolves.not.toThrow();
  });
});

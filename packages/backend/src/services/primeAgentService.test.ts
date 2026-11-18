import { primeAgentService } from './primeAgentService';

describe('PrimeAgentService', () => {
  it('detects prime agent availability or initializes embedded RLM runtime', async () => {
    const status = await primeAgentService.getStatus();
    expect(status).toBeDefined();
    expect(status.available).toBe(true);
    expect(status.version).toBeDefined();
    expect(['cli', 'embedded']).toContain(status.mode);
  });

  it('lists active agent sessions and background workers', async () => {
    const sessions = await primeAgentService.listSessions();
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions[0]).toHaveProperty('id');
    expect(sessions[0]).toHaveProperty('name');
  });

  it('executes autonomous RLM tasks with context code and returns structured patch', async () => {
    const result = await primeAgentService.executeTask({
      prompt: 'Optimize performance and reduce memory overhead',
      contextCode: 'function processStream(data: any[]) { return data.map(x => x * 2); }',
      activeLanguage: 'typescript',
      autonomous: true,
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.output).toContain('Prime Agent RLM');
    expect(result.suggestedPatch).toBeDefined();
    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });

  it('evaluates interactive REPL commands with persistent variable assignment', async () => {
    // 1. Assign variable
    const assignRes = await primeAgentService.executeRepl({ command: 'alpha = 100' });
    expect(assignRes.variables).toHaveProperty('alpha');
    expect(assignRes.variables.alpha).toBe('100');

    // 2. Evaluate expression using persistent variable
    const evalRes = await primeAgentService.executeRepl({ command: 'alpha * 2' });
    expect(evalRes.output).toBe('200');
  });

  it('autonomously self-heals missing identifier compilation errors', async () => {
    const brokenCode = 'function calculate() { return factor * 10; }';
    const errorTrace = "ReferenceError: factor is not defined at calculate";

    const healed = await primeAgentService.selfHeal({
      code: brokenCode,
      language: 'typescript',
      errorTrace,
    });

    expect(healed.success).toBe(true);
    expect(healed.diagnostics).toContain('factor');
    expect(healed.fixedCode).toContain('factor');
    expect(healed.diffSummary).toBeDefined();
  });

  it('autonomously self-heals syntax irregularities and unclosed delimiters', async () => {
    const brokenCode = 'const grid = { status: "active"';
    const errorTrace = "SyntaxError: Unexpected token";

    const healed = await primeAgentService.selfHeal({
      code: brokenCode,
      language: 'javascript',
      errorTrace,
    });

    expect(healed.success).toBe(true);
    expect(healed.diagnostics).toContain('syntax');
  });

  it('refines and stores verified lessons in continual harness memory', async () => {
    const newLesson = 'Always sandbox process environments with strict wall-clock timeouts';
    const lessons = await primeAgentService.refineLessons(newLesson);

    expect(lessons).toContain(newLesson);
  });
});

import http from 'http';
import { app } from './server';

describe('SynapseGrid API & Prime Agent Endpoints', () => {
  let server: http.Server;
  let baseURL: string;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as any;
      baseURL = `http://127.0.0.1:${addr.port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('GET /health returns 200 and operational status', async () => {
    const res = await fetch(`${baseURL}/health`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  it('GET /api/prime/status returns Prime Agent runtime status', async () => {
    const res = await fetch(`${baseURL}/api/prime/status`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.available).toBe(true);
    expect(data.version).toBeDefined();
    expect(['cli', 'embedded']).toContain(data.mode);
  });

  it('GET /api/prime/agents returns active swarm sessions', async () => {
    const res = await fetch(`${baseURL}/api/prime/agents`);
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(Array.isArray(data.sessions)).toBe(true);
    expect(data.sessions.length).toBeGreaterThan(0);
  });

  it('POST /api/prime/execute runs autonomous task', async () => {
    const res = await fetch(`${baseURL}/api/prime/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Optimize memory footprint',
        contextCode: 'const x = [1, 2, 3];',
        activeLanguage: 'javascript',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.output).toBeDefined();
  });

  it('POST /api/prime/repl runs interactive expression evaluation', async () => {
    const res = await fetch(`${baseURL}/api/prime/repl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        command: 'val = 50',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.variables.val).toBe('50');
  });

  it('POST /api/prime/heal diagnoses and repairs compiler faults', async () => {
    const res = await fetch(`${baseURL}/api/prime/heal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'console.log(missingVar);',
        language: 'javascript',
        errorTrace: 'ReferenceError: missingVar is not defined',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.fixedCode).toContain('missingVar');
  });

  it('POST /api/compiler/execute executes code in sandbox', async () => {
    const res = await fetch(`${baseURL}/api/compiler/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'console.log("TEST_EXECUTE_OK");',
        language: 'javascript',
      }),
    });

    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.success).toBe(true);
    expect(data.stdout).toContain('TEST_EXECUTE_OK');
  });
});

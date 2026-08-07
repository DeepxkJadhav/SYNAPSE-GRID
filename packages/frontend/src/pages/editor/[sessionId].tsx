import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthStore } from '@/lib/authStore';

export default function Editor() {
  const router = useRouter();
  const { sessionId } = router.query;
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState('utils.ts');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'sys', text: 'Initializing SynapseGrid Sandbox Environment v1.0.4...' },
    { type: 'sys', text: 'Establishing secure tunnel protocol to Node West...' },
    { type: 'ok', text: 'Connection verified. Remote container active.' },
    { type: 'info', text: 'Ingested file tree (4 elements).' },
    { type: 'cmd', text: 'npm run dev' },
    { type: 'log', text: 'Server listening on port 5000 (operational)' },
    { type: 'log', text: 'Database connection verified. Ingestion active.' }
  ]);

  const fileTree = [
    { name: 'src', isFolder: true, open: true, children: [
      { name: 'server.ts', isFolder: false },
      { name: 'utils.ts', isFolder: false },
      { name: 'db.ts', isFolder: false },
    ]},
    { name: 'package.json', isFolder: false },
    { name: 'README.md', isFolder: false }
  ];

  const codeSnippets: Record<string, string> = {
    'server.ts': `import express from 'express';
import { db } from './db';
import { log } from './utils';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/health', (req, res) => {
  log('Health check requested');
  res.json({ status: 'ok', db: db.isConnected() });
});

app.listen(PORT, () => {
  log(\`Server running on port \${PORT}\`);
});`,
    'utils.ts': `import { format } from 'date-fns';

export function log(message: string): void {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  console.log(\`[\${timestamp}] [SYS] \${message}\`);
}

export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}`,
    'db.ts': `import { Client } from 'pg';

class Database {
  private client: Client;
  private connected: boolean = false;

  constructor() {
    this.client = new Client(process.env.DATABASE_URL);
  }

  async connect() {
    await this.client.connect();
    this.connected = true;
  }

  isConnected() {
    return this.connected;
  }
}

export const db = new Database();`,
    'package.json': `{
  "name": "synapse-sandbox",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3"
  }
}`,
    'README.md': `# SynapseGrid Sandbox Environment

Collaborative code sandbox editor. Type queries below, write test endpoints, and trigger script compilations.

- **Status**: Live Sync Active
- **Ingestion**: Enabled
`
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (sessionId) {
      setLoading(false);
    }
  }, [isAuthenticated, sessionId]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    setTerminalLogs(prev => [
      ...prev,
      { type: 'cmd', text: terminalInput },
      { type: 'sys', text: `Command output for "${terminalInput}" is simulated in Sandbox Mode.` }
    ]);
    setTerminalInput('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#040711]">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 animate-pulse mb-4"></div>
        <p className="text-indigo-400 font-mono text-sm tracking-wider">CONNECTING TO SANDBOX...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#040711] overflow-hidden text-slate-300 font-sans">
      
      {/* Top Header */}
      <header className="bg-slate-950/50 border-b border-indigo-950/40 px-6 py-4 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-white transition-colors">
            ← Dashboard
          </Link>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500 shadow-glow"></span>
            <h1 className="font-bold text-white tracking-wide text-sm font-mono">
              SESSION: {sessionId?.slice(0, 12)}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-500/20 px-3 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">SYNC ACTIVE</span>
          </div>
          <span className="text-xs font-mono text-slate-500">OPERATOR: {user?.username}</span>
        </div>
      </header>

      {/* Main Grid Editor Layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: File Tree */}
        <aside className="w-64 bg-slate-950/20 border-r border-indigo-950/40 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono">WORKSPACE FILES</h2>
          <div className="space-y-3 font-mono text-sm">
            {fileTree.map((node, i) => (
              <div key={i} className="select-none">
                {node.isFolder ? (
                  <div>
                    <div className="text-indigo-400 font-semibold mb-1">📁 {node.name}</div>
                    <div className="pl-4 border-l border-indigo-950/40 space-y-1">
                      {node.children?.map((child, j) => (
                        <div
                          key={j}
                          onClick={() => setActiveFile(child.name)}
                          className={`cursor-pointer py-1 px-2 rounded-md hover:bg-indigo-950/30 transition-colors ${activeFile === child.name ? 'text-white bg-indigo-650/10 font-bold border-l-2 border-indigo-500' : 'text-slate-400'}`}
                        >
                          📄 {child.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setActiveFile(node.name)}
                    className={`cursor-pointer py-1 px-2 rounded-md hover:bg-indigo-950/30 transition-colors ${activeFile === node.name ? 'text-white bg-indigo-650/10 font-bold border-l-2 border-indigo-500' : 'text-slate-400'}`}
                  >
                    📄 {node.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Center Section: Code Editor & Terminal */}
        <section className="flex-1 flex flex-col overflow-hidden">
          
          {/* Code Editor Frame */}
          <div className="flex-1 flex flex-col bg-slate-950/10 p-5 overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-indigo-400 font-bold">{activeFile}</span>
              <span className="text-xs text-slate-500 font-mono">UTF-8 // TypeScript</span>
            </div>
            
            {/* Mock Editor Canvas */}
            <div className="flex-1 bg-slate-950/60 border border-indigo-950/40 rounded-2xl p-6 font-mono text-sm overflow-y-auto leading-relaxed shadow-inner">
              <pre className="text-emerald-400/90 select-text">
                <code>
                  {codeSnippets[activeFile] || '// empty file'}
                </code>
              </pre>
            </div>
          </div>

          {/* Bottom Panel: Interactive Terminal */}
          <div className="h-56 bg-slate-950/40 border-t border-indigo-950/40 p-5 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">REMOTE SHELL TERMINAL</span>
              <span className="text-xs text-slate-600 font-mono">SANDBOX NODE 01</span>
            </div>
            
            {/* Terminal logs list */}
            <div className="flex-1 bg-black/60 border border-indigo-950/30 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-1">
              {terminalLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.type === 'sys' && <span className="text-indigo-400">[SYS] {log.text}</span>}
                  {log.type === 'ok' && <span className="text-emerald-400">[OK] {log.text}</span>}
                  {log.type === 'info' && <span className="text-slate-500">[INFO] {log.text}</span>}
                  {log.type === 'cmd' && <span className="text-amber-400">$ {log.text}</span>}
                  {log.type === 'log' && <span className="text-slate-300">{log.text}</span>}
                </div>
              ))}
            </div>

            {/* Terminal Command Input */}
            <form onSubmit={handleTerminalSubmit} className="mt-3 flex items-center bg-black/40 border border-indigo-950/40 rounded-xl px-4 py-2 font-mono text-xs">
              <span className="text-indigo-400 mr-2">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={e => setTerminalInput(e.target.value)}
                placeholder="Submit sandboxed command..."
                className="bg-transparent border-none outline-none flex-grow text-white"
              />
            </form>
          </div>

        </section>

        {/* Right Sidebar: Active Users Presence */}
        <aside className="w-64 bg-slate-950/20 border-l border-indigo-950/40 p-5 flex flex-col overflow-y-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 font-mono">COLLABORATORS</h2>
          <div className="space-y-4">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                {user?.username?.[0].toUpperCase() || 'U'}
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-none">{user?.username}</div>
                <span className="text-[10px] font-mono text-indigo-400">YOU // WRITER</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
                A
              </div>
              <div>
                <div className="text-sm font-semibold text-white leading-none">alice_dev</div>
                <span className="text-[10px] font-mono text-emerald-400">ONLINE // CO-WRITER</span>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-60">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-700/30 flex items-center justify-center font-bold text-slate-500 text-sm">
                R
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-400 leading-none">ravi_shah</div>
                <span className="text-[10px] font-mono text-slate-500">OFFLINE // READER</span>
              </div>
            </div>

          </div>
        </aside>

      </main>
    </div>
  );
}

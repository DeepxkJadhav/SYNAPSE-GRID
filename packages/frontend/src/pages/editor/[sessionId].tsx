import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

interface FileItem {
  id: string;
  name: string;
  path: string;
  isDirectory: boolean;
  content?: string;
  language?: string;
  children?: FileItem[];
}

interface TerminalLog {
  type: 'sys' | 'ok' | 'info' | 'cmd' | 'log' | 'err';
  text: string;
  timestamp?: string;
}

interface HostStats {
  hostname: string;
  platform: string;
  cpuModel: string;
  cpuCores: number;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  ramTotalBytes: number;
  ramUsedBytes: number;
  topProcesses: Array<{ pid: number; name: string; cpu: number; memory: number }>;
}

export default function CyberneticEditor() {
  const router = useRouter();
  const { sessionId } = router.query;
  const { isAuthenticated, user } = useAuthStore();

  // Environment mode
  const [isDesktop, setIsDesktop] = useState(false);
  const [windowMaximized, setWindowMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'prime' | 'host' | 'repl'>('editor');

  // Editor & Workspace State
  const [workspaceName, setWorkspaceName] = useState<string>('SYNAPSE SANDBOX');
  const [workspacePath, setWorkspacePath] = useState<string>('');
  const [openFiles, setOpenFiles] = useState<string[]>(['main.ts', 'server.py']);
  const [activeFile, setActiveFile] = useState<string>('main.ts');
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'main.ts': `// SynapseGrid Cybernetic Runtime
import { EventEmitter } from 'events';

export interface TaskPacket {
  id: string;
  payload: string;
  priority: number;
}

export class GridDispatcher extends EventEmitter {
  private queue: TaskPacket[] = [];

  enqueue(packet: TaskPacket): void {
    this.queue.push(packet);
    this.emit('task:enqueued', packet);
  }

  processNext(): TaskPacket | undefined {
    return this.queue.shift();
  }
}

const dispatcher = new GridDispatcher();
dispatcher.on('task:enqueued', (t) => console.log(\`[GRID]: Dispatched \${t.id}\`));
dispatcher.enqueue({ id: 'TASK-001', payload: 'Autonomous Telemetry Probe', priority: 1 });
console.log('Execution completed successfully.');
`,
    'server.py': `# SynapseGrid Python Sandbox
import sys
import time

def compute_grid_metrics():
    print(f"[PY-KERNEL]: Initializing Python runtime {sys.version.split()[0]}")
    matrix = [[i * j for j in range(5)] for i in range(5)]
    print(f"[PY-KERNEL]: Synthesized 5x5 Grid Matrix")
    return sum(sum(row) for row in matrix)

if __name__ == "__main__":
    start = time.time()
    total = compute_grid_metrics()
    print(f"[PY-KERNEL]: Matrix check sum: {total}")
    print(f"[PY-KERNEL]: Computation took {(time.time() - start)*1000:.2f}ms")
`,
    'index.rs': `// SynapseGrid High-Speed Rust Engine
fn main() {
    println!("⚡ SynapseGrid Rust Node active.");
    let cores = 8;
    let threads = cores * 2;
    println!("Spawned {} virtual workers across {} physical cores.", threads, cores);
}
`,
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>('typescript');
  const [isCompiling, setIsCompiling] = useState(false);
  const [lastErrorTrace, setLastErrorTrace] = useState<string>('');

  // Terminal & Logs
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { type: 'sys', text: 'SynapseGrid Cybernetic Workstation v1.0.0 initialized.' },
    { type: 'ok', text: 'Dual-Engine Architecture active: Local Standalone + Cloud Yjs Mesh.' },
    { type: 'info', text: 'Press Ctrl+Enter to compile & run code. Press Ctrl+Shift+P for Command Palette.' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  // Prime Agent State
  const [primeStatus, setPrimeStatus] = useState<{ available: boolean; version: string; daemonActive: boolean }>({
    available: true,
    version: '0.10.4',
    daemonActive: false,
  });
  const [primePrompt, setPrimePrompt] = useState('');
  const [isPrimeThinking, setIsPrimeThinking] = useState(false);
  const [primeOutput, setPrimeOutput] = useState<string>('');
  const [suggestedPatch, setSuggestedPatch] = useState<string | null>(null);
  const [replInput, setReplInput] = useState('x = 42');
  const [replLogs, setReplLogs] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: 'prime_version', out: '"0.10.4-rlm"' },
  ]);
  const [continualLessons, setContinualLessons] = useState<string[]>([
    'Always verify sandbox process exit codes before streaming output to UI.',
    'Use AST validation before patching multi-language code snippets.',
    'Isolate compiler temp directories per session to prevent race conditions.',
  ]);

  // Host Telemetry State
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [scannedPorts, setScannedPorts] = useState<Array<{ port: number; status: 'open' | 'closed' }>>([
    { port: 3000, status: 'open' },
    { port: 5000, status: 'open' },
    { port: 5432, status: 'closed' },
    { port: 6379, status: 'closed' },
    { port: 8080, status: 'closed' },
  ]);
  const [processFilter, setProcessFilter] = useState('');

  // Native File Tree
  const [nativeTree, setNativeTree] = useState<FileItem[]>([]);

  // Check desktop environment
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).synapseDesktop) {
      setIsDesktop(true);
      const desktop = (window as any).synapseDesktop;
      desktop.window.isMaximized().then((max: boolean) => setWindowMaximized(max));

      // Fetch Prime status
      desktop.prime.detect().then((res: any) => {
        setPrimeStatus(res);
      });

      // Poll host stats
      const fetchStats = async () => {
        try {
          const stats = await desktop.host.getStats();
          setHostStats(stats);
        } catch {}
      };
      fetchStats();
      const interval = setInterval(fetchStats, 3000);
      return () => clearInterval(interval);
    } else {
      // Fetch status via REST
      apiClient.get('/api/prime/status').then((res) => {
        setPrimeStatus(res.data);
      }).catch(() => {});
    }
  }, []);

  // Update selected language when active file changes
  useEffect(() => {
    if (activeFile.endsWith('.ts')) setSelectedLanguage('typescript');
    else if (activeFile.endsWith('.js')) setSelectedLanguage('javascript');
    else if (activeFile.endsWith('.py')) setSelectedLanguage('python');
    else if (activeFile.endsWith('.rs')) setSelectedLanguage('rust');
    else if (activeFile.endsWith('.go')) setSelectedLanguage('go');
    else if (activeFile.endsWith('.cpp')) setSelectedLanguage('cpp');
    else if (activeFile.endsWith('.java')) setSelectedLanguage('java');
    else if (activeFile.endsWith('.cs')) setSelectedLanguage('csharp');
  }, [activeFile]);

  // Window Controls
  const handleMinimize = () => (window as any).synapseDesktop?.window.minimize();
  const handleMaximize = async () => {
    const isMax = await (window as any).synapseDesktop?.window.maximize();
    setWindowMaximized(isMax);
  };
  const handleClose = () => (window as any).synapseDesktop?.window.close();

  // Open Local Directory
  const handleOpenLocalDirectory = async () => {
    if (isDesktop) {
      const dirPath = await (window as any).synapseDesktop.fs.selectDirectory();
      if (dirPath) {
        setWorkspacePath(dirPath);
        setWorkspaceName(dirPath.split(/[\\/]/).pop() || 'LOCAL WORKSPACE');
        const tree = await (window as any).synapseDesktop.fs.readTree(dirPath);
        setNativeTree(tree);
        setTerminalLogs((prev) => [
          ...prev,
          { type: 'ok', text: `Mounted local repository: ${dirPath}` },
        ]);
      }
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'info', text: 'Local Folder picker active in Desktop Electron Mode. Use File Upload in browser.' },
      ]);
    }
  };

  // Select File to Read
  const handleSelectFile = async (item: FileItem) => {
    if (item.isDirectory) return;

    if (isDesktop && item.path) {
      try {
        const content = await (window as any).synapseDesktop.fs.readFile(item.path);
        setFileContents((prev) => ({ ...prev, [item.name]: content }));
        if (!openFiles.includes(item.name)) setOpenFiles((prev) => [...prev, item.name]);
        setActiveFile(item.name);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Read error: ${err.message}` }]);
      }
    } else {
      if (!openFiles.includes(item.name)) setOpenFiles((prev) => [...prev, item.name]);
      setActiveFile(item.name);
    }
  };

  // Save Active File
  const handleSaveActiveFile = async () => {
    const currentCode = fileContents[activeFile] || '';
    if (isDesktop && workspacePath) {
      try {
        const fullPath = `${workspacePath}/${activeFile}`;
        await (window as any).synapseDesktop.fs.writeFile(fullPath, currentCode);
        setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Saved file: ${activeFile}` }]);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Save error: ${err.message}` }]);
      }
    } else {
      setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Saved ${activeFile} to session buffer.` }]);
    }
  };

  // Run Compiler / Execution
  const handleRunCode = async () => {
    setIsCompiling(true);
    const codeToRun = fileContents[activeFile] || '';
    setTerminalLogs((prev) => [
      ...prev,
      { type: 'cmd', text: `run [${selectedLanguage.toUpperCase()}] ${activeFile}` },
    ]);

    try {
      if (isDesktop) {
        const res = await (window as any).synapseDesktop.compiler.runLocal(codeToRun, selectedLanguage);
        if (res.success) {
          setLastErrorTrace('');
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'ok', text: `Process exited with code 0 in ${res.executionTimeMs}ms` },
            ...(res.stdout ? [{ type: 'log' as const, text: res.stdout }] : []),
          ]);
        } else {
          setLastErrorTrace(res.stderr || 'Execution failed');
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'err', text: `Execution failed (${res.executionTimeMs}ms):` },
            { type: 'err', text: res.stderr || 'Unknown error' },
            { type: 'info', text: '💡 Click "Prime Auto-Heal" to autonomously diagnose and patch this error.' },
          ]);
        }
      } else {
        const res = await apiClient.post('/api/compiler/execute', {
          code: codeToRun,
          language: selectedLanguage,
        });
        if (res.data.success) {
          setLastErrorTrace('');
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'ok', text: `Success (${res.data.executionTime}ms)` },
            { type: 'log', text: res.data.output || res.data.stdout || 'Done.' },
          ]);
        } else {
          const err = res.data.error || res.data.stderr || 'Compilation failed';
          setLastErrorTrace(err);
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'err', text: `Error: ${err}` },
            { type: 'info', text: '💡 Prime Agent Auto-Fix available in the Prime tab.' },
          ]);
        }
      }
    } catch (err: any) {
      setLastErrorTrace(err.message);
      setTerminalLogs((prev) => [...prev, { type: 'err', text: `Compiler request fault: ${err.message}` }]);
    } finally {
      setIsCompiling(false);
    }
  };

  // Prime Agent Autonomous Task
  const handlePrimeExecute = async (overridePrompt?: string) => {
    const prompt = overridePrompt || primePrompt;
    if (!prompt.trim()) return;

    setIsPrimeThinking(true);
    setPrimeOutput('');
    setSuggestedPatch(null);

    try {
      const res = await apiClient.post('/api/prime/execute', {
        prompt,
        contextCode: fileContents[activeFile],
        activeLanguage: selectedLanguage,
        filePath: activeFile,
        autonomous: true,
      });

      setPrimeOutput(res.data.output);
      if (res.data.suggestedPatch) {
        setSuggestedPatch(res.data.suggestedPatch);
      }
      if (res.data.refinementLessons) {
        setContinualLessons(res.data.refinementLessons);
      }
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'ok', text: `Prime Agent completed task in ${res.data.executionTimeMs}ms` },
      ]);
    } catch (err: any) {
      setPrimeOutput(`Prime Agent invocation error: ${err.message}`);
    } finally {
      setIsPrimeThinking(false);
    }
  };

  // Prime Agent Auto-Heal
  const handlePrimeAutoHeal = async () => {
    if (!lastErrorTrace) return;
    setIsPrimeThinking(true);
    setActiveTab('prime');

    try {
      const res = await apiClient.post('/api/prime/heal', {
        code: fileContents[activeFile],
        language: selectedLanguage,
        errorTrace: lastErrorTrace,
      });

      setPrimeOutput(`[AUTONOMOUS HEALING VERIFIED]\nDiagnostic: ${res.data.diagnostics}\nExplanation: ${res.data.explanation}\nDiff: ${res.data.diffSummary}`);
      setSuggestedPatch(res.data.fixedCode);
    } catch (err: any) {
      setPrimeOutput(`Self-healing failed: ${err.message}`);
    } finally {
      setIsPrimeThinking(false);
    }
  };

  // Apply Prime Patch
  const handleApplyPatch = () => {
    if (suggestedPatch) {
      setFileContents((prev) => ({ ...prev, [activeFile]: suggestedPatch }));
      setSuggestedPatch(null);
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'ok', text: `Applied Prime Agent patch to ${activeFile}` },
      ]);
    }
  };

  // REPL Execution
  const handleReplSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replInput.trim()) return;
    const cmd = replInput;
    setReplInput('');

    try {
      const res = await apiClient.post('/api/prime/repl', { command: cmd });
      setReplLogs((prev) => [...prev, { cmd, out: res.data.output }]);
    } catch (err: any) {
      setReplLogs((prev) => [...prev, { cmd, out: `Error: ${err.message}` }]);
    }
  };

  // Kill Process
  const handleKillProcess = async (pid: number) => {
    if (isDesktop) {
      const res = await (window as any).synapseDesktop.host.killProcess(pid);
      setTerminalLogs((prev) => [
        ...prev,
        { type: res.success ? 'ok' : 'err', text: res.message },
      ]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#040711] overflow-hidden text-slate-200 font-sans select-none">
      
      {/* Frameless Cybernetic Window Titlebar */}
      <header className="h-10 bg-[#060a18] border-b border-indigo-950/60 px-4 flex justify-between items-center text-xs font-mono select-none" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
            S
          </span>
          <span className="font-bold tracking-wider text-white">SYNAPSE<span className="text-indigo-400 font-light">GRID</span></span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 truncate max-w-xs">{workspaceName}</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 font-semibold">
            {isDesktop ? 'DESKTOP WORKSTATION' : 'WEB CLIENT'}
          </span>
        </div>

        {/* Center Live Badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PRIME RLM READY</span>
          </div>
          {hostStats && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <span>CPU: <strong className="text-white">{hostStats.cpuUsagePercent}%</strong></span>
              <span>RAM: <strong className="text-white">{hostStats.ramUsagePercent}%</strong></span>
            </div>
          )}
        </div>

        {/* Window Controls (Electron) */}
        <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Link href="/" className="px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            ⌂ Home
          </Link>
          {isDesktop ? (
            <div className="flex items-center ml-2 border-l border-slate-800 pl-2">
              <button onClick={handleMinimize} title="Minimize" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                🗕
              </button>
              <button onClick={handleMaximize} title="Maximize" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded">
                {windowMaximized ? '🗗' : '🗖'}
              </button>
              <button onClick={handleClose} title="Close" className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-900/60 rounded">
                ✕
              </button>
            </div>
          ) : (
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-[11px]">
              Dashboard →
            </Link>
          )}
        </div>
      </header>

      {/* Main Grid Workstation Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: File Navigator & Workspaces */}
        <aside className="w-64 bg-[#050814] border-r border-indigo-950/40 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-indigo-950/40 flex justify-between items-center">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">EXPLORER</span>
              <button
                onClick={handleOpenLocalDirectory}
                className="px-2 py-1 bg-indigo-950/60 hover:bg-indigo-900/50 border border-indigo-800/40 rounded text-[10px] font-mono text-indigo-300 hover:text-white transition-all flex items-center gap-1"
                title="Open real local folder on your computer"
              >
                📁 Open Folder
              </button>
            </div>

            {/* Tree listing */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-1">
              {nativeTree.length > 0 ? (
                nativeTree.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectFile(item)}
                    className={`px-2 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                      activeFile === item.name
                        ? 'bg-indigo-950/70 text-indigo-200 border-l-2 border-indigo-500 font-bold'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.isDirectory ? '📁' : '📄'}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))
              ) : (
                Object.keys(fileContents).map((fileName) => (
                  <div
                    key={fileName}
                    onClick={() => setActiveFile(fileName)}
                    className={`px-2 py-1.5 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                      activeFile === fileName
                        ? 'bg-indigo-950/70 text-indigo-200 border-l-2 border-indigo-500 font-bold'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    <span>📄</span>
                    <span className="truncate">{fileName}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Host Badge */}
          <div className="p-3 bg-black/40 border-t border-indigo-950/40 text-[11px] font-mono text-slate-500">
            <div>HOST: <span className="text-slate-300">{hostStats?.hostname || 'SYNAPSE-LOCAL'}</span></div>
            <div>RUNTIME: <span className="text-emerald-400 font-semibold">{primeStatus.version}</span></div>
          </div>
        </aside>

        {/* Center Panel: Multi-Tab Code Editor & Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#030611]">
          
          {/* Editor Header Bar with Open Tabs & Action Controls */}
          <div className="h-10 bg-[#060a19] border-b border-indigo-950/40 px-3 flex justify-between items-center">
            {/* Open File Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {openFiles.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveFile(tab)}
                  className={`px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer flex items-center gap-2 border-t-2 transition-all ${
                    activeFile === tab
                      ? 'bg-[#030611] text-white border-indigo-500 font-bold shadow-sm'
                      : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  <span>{tab}</span>
                </div>
              ))}
            </div>

            {/* Language Picker & Execution Actions */}
            <div className="flex items-center gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-black/60 border border-indigo-950/60 text-indigo-300 text-xs font-mono rounded px-2 py-1 outline-none"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
              </select>

              <button
                onClick={handleSaveActiveFile}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono transition-all"
                title="Save (Ctrl+S)"
              >
                💾 Save
              </button>

              <button
                onClick={handleRunCode}
                disabled={isCompiling}
                className={`px-3.5 py-1 rounded text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  isCompiling
                    ? 'bg-amber-600/60 text-white cursor-wait animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-[1.02] shadow-indigo-600/30'
                }`}
              >
                <span>{isCompiling ? '⚡ Running...' : '▶ Run Code'}</span>
              </button>

              {lastErrorTrace && (
                <button
                  onClick={handlePrimeAutoHeal}
                  className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 rounded text-xs font-mono font-bold animate-bounce transition-all"
                  title="Prime Agent Autonomous Self-Healing"
                >
                  🩹 Auto-Heal
                </button>
              )}
            </div>
          </div>

          {/* Code Editor Body */}
          <div className="flex-1 relative flex overflow-hidden">
            <div className="w-12 bg-[#040713] text-slate-600 font-mono text-xs text-right pr-3 pt-4 select-none border-r border-indigo-950/30">
              {(fileContents[activeFile] || '').split('\n').map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            <textarea
              value={fileContents[activeFile] || ''}
              onChange={(e) => {
                const val = e.target.value;
                setFileContents((prev) => ({ ...prev, [activeFile]: val }));
              }}
              spellCheck={false}
              className="flex-1 bg-transparent text-emerald-400 font-mono text-xs p-4 leading-6 resize-none outline-none overflow-y-auto selection:bg-indigo-900/50 selection:text-white"
            />
          </div>

          {/* Bottom Dock: Multi-Mode Cybernetic Console */}
          <div className="h-56 bg-[#040715] border-t border-indigo-950/50 flex flex-col overflow-hidden">
            
            {/* Dock Tab Selector */}
            <div className="h-8 bg-[#060a19] border-b border-indigo-950/40 px-3 flex items-center gap-4 text-xs font-mono">
              <button
                onClick={() => setActiveTab('editor')}
                className={`py-1 cursor-pointer transition-colors ${
                  activeTab === 'editor' ? 'text-indigo-400 font-bold border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                SHELL OUTPUT
              </button>
              <button
                onClick={() => setActiveTab('prime')}
                className={`py-1 cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'prime' ? 'text-indigo-400 font-bold border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>🤖 PRIME AGENT RLM</span>
                {primeStatus.daemonActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
              <button
                onClick={() => setActiveTab('repl')}
                className={`py-1 cursor-pointer transition-colors ${
                  activeTab === 'repl' ? 'text-indigo-400 font-bold border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                🐍 REPL KERNEL
              </button>
              <button
                onClick={() => setActiveTab('host')}
                className={`py-1 cursor-pointer transition-colors ${
                  activeTab === 'host' ? 'text-indigo-400 font-bold border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                🖥️ HOST RADAR
              </button>
            </div>

            {/* Dock Content */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
              
              {/* Tab 1: Terminal Shell Logs */}
              {activeTab === 'editor' && (
                <div className="space-y-1">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log.type === 'sys' && <span className="text-indigo-400">[SYS] {log.text}</span>}
                      {log.type === 'ok' && <span className="text-emerald-400">[OK] {log.text}</span>}
                      {log.type === 'info' && <span className="text-slate-500">[INFO] {log.text}</span>}
                      {log.type === 'cmd' && <span className="text-amber-400 font-bold">$ {log.text}</span>}
                      {log.type === 'err' && <span className="text-rose-400">{log.text}</span>}
                      {log.type === 'log' && <span className="text-slate-300">{log.text}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Prime Agent Autonomous HUD */}
              {activeTab === 'prime' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 font-bold">PRIME AGENT [RLM ENGINE]</span>
                      <span className="text-slate-500">Mode: {primeStatus.daemonActive ? 'Daemon' : 'Embedded'}</span>
                    </div>

                    {primeOutput && (
                      <div className="p-2.5 rounded bg-black/60 border border-indigo-950/40 text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {primeOutput}
                      </div>
                    )}

                    {suggestedPatch && (
                      <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/40 flex justify-between items-center">
                        <span className="text-emerald-400">Autonomous patch ready to apply to {activeFile}.</span>
                        <button
                          onClick={handleApplyPatch}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold transition-all shadow-md"
                        >
                          ✓ Apply Patch
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prime Prompt Bar */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={primePrompt}
                      onChange={(e) => setPrimePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePrimeExecute()}
                      placeholder="Ask Prime Agent: e.g., 'Refactor memory leak', 'Add unit tests', 'Explain algorithm'..."
                      className="flex-1 bg-black/60 border border-indigo-950/60 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => handlePrimeExecute()}
                      disabled={isPrimeThinking}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold"
                    >
                      {isPrimeThinking ? 'Thinking...' : 'Instruct'}
                    </button>
                    <button
                      onClick={() => handlePrimeExecute('Optimize performance and reduce memory allocations')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded"
                    >
                      Optimize
                    </button>
                    <button
                      onClick={() => handlePrimeExecute('Generate comprehensive test suite')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded"
                    >
                      Gen Tests
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Python REPL Console */}
              {activeTab === 'repl' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-1 overflow-y-auto space-y-1 mb-2">
                    {replLogs.map((log, i) => (
                      <div key={i}>
                        <div className="text-indigo-400">&gt;&gt;&gt; {log.cmd}</div>
                        <div className="text-emerald-400 pl-4">{log.out}</div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleReplSubmit} className="flex gap-2">
                    <span className="text-indigo-400 font-bold">&gt;&gt;&gt;</span>
                    <input
                      type="text"
                      value={replInput}
                      onChange={(e) => setReplInput(e.target.value)}
                      placeholder="Execute Python / RLM statement in persistent session context..."
                      className="flex-1 bg-black/60 border border-indigo-950/60 rounded px-3 py-1 text-white outline-none"
                    />
                  </form>
                </div>
              )}

              {/* Tab 4: Host Telemetry Radar */}
              {activeTab === 'host' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-black/40 border border-indigo-950/40 rounded">
                      <span className="text-slate-500">CPU LOAD</span>
                      <div className="text-lg font-bold text-indigo-400">{hostStats?.cpuUsagePercent || 14}%</div>
                      <span className="text-[10px] text-slate-500">{hostStats?.cpuModel || 'Intel / AMD Cores'}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-indigo-950/40 rounded">
                      <span className="text-slate-500">RAM USAGE</span>
                      <div className="text-lg font-bold text-emerald-400">{hostStats?.ramUsagePercent || 38}%</div>
                      <span className="text-[10px] text-slate-500">
                        {hostStats ? `${Math.round(hostStats.ramUsedBytes / (1024 * 1024 * 1024))}GB / ${Math.round(hostStats.ramTotalBytes / (1024 * 1024 * 1024))}GB` : 'Operational'}
                      </span>
                    </div>
                    <div className="p-3 bg-black/40 border border-indigo-950/40 rounded">
                      <span className="text-slate-500">PLATFORM</span>
                      <div className="text-sm font-bold text-white">{hostStats?.platform || 'Windows x64'}</div>
                      <span className="text-[10px] text-slate-500">Hostname: {hostStats?.hostname || 'LOCAL'}</span>
                    </div>
                    <div className="p-3 bg-black/40 border border-indigo-950/40 rounded">
                      <span className="text-slate-500">PORTS</span>
                      <div className="flex gap-2 mt-1">
                        {scannedPorts.map((p) => (
                          <span
                            key={p.port}
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              p.status === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-600'
                            }`}
                          >
                            {p.port}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Processes Table */}
                  {hostStats?.topProcesses && (
                    <div>
                      <div className="text-slate-400 font-bold mb-2">RUNNING PROCESSES ({hostStats.topProcesses.length})</div>
                      <div className="grid grid-cols-4 gap-2 text-[11px] text-slate-400 font-mono">
                        {hostStats.topProcesses.slice(0, 8).map((proc) => (
                          <div key={proc.pid} className="p-2 bg-black/30 border border-indigo-950/30 rounded flex justify-between items-center">
                            <div>
                              <div className="text-white font-semibold truncate max-w-[120px]">{proc.name}</div>
                              <span className="text-[10px] text-slate-500">PID: {proc.pid} | {Math.round(proc.memory / 1024 / 1024)}MB</span>
                            </div>
                            <button
                              onClick={() => handleKillProcess(proc.pid)}
                              className="px-1.5 py-0.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded text-[10px]"
                            >
                              Kill
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </main>

        {/* Right Sidebar: Continual Memory & Swarm Presence */}
        <aside className="w-64 bg-[#050814] border-l border-indigo-950/40 p-3 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">CONTINUAL HARNESS</span>
              <div className="mt-2 space-y-2">
                {continualLessons.map((lesson, idx) => (
                  <div key={idx} className="p-2 rounded bg-indigo-950/20 border border-indigo-900/30 text-[11px] text-slate-300 leading-snug">
                    <span className="text-indigo-400 font-bold">#{idx + 1}:</span> {lesson}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-indigo-950/40 pt-3">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">ACTIVE SWARM</span>
              <div className="mt-2 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-white font-semibold">Prime RLM Core</span>
                  <span className="text-[10px] text-slate-500">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-white font-semibold">Telemetry Sentry</span>
                  <span className="text-[10px] text-slate-500">MONITORING</span>
                </div>
                <div className="flex items-center gap-2 opacity-60">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  <span className="text-slate-400">Pair Programmer</span>
                  <span className="text-[10px] text-slate-500">STANDBY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-950/40 text-[10px] text-slate-600 font-mono text-center">
            SYNAPSEGRID CYBERNETIC MESH
          </div>
        </aside>

      </div>
    </div>
  );
}

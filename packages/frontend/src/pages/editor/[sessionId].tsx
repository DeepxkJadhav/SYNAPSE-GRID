import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import {
  Code2,
  Terminal,
  Bot,
  Cpu,
  Play,
  Save,
  FolderOpen,
  Folder,
  FileCode,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Minimize2,
  Maximize2,
  X,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Sliders,
  ShieldAlert,
  Trash2,
  Copy,
  ChevronRight,
  Brain,
  HelpCircle,
  Hash,
} from 'lucide-react';

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
  const [activeSidebarView, setActiveSidebarView] = useState<'explorer' | 'search' | 'prime' | 'telemetry' | 'memory'>('explorer');

  // Editor & Workspace State
  const [workspaceName, setWorkspaceName] = useState<string>('SYNAPSE SANDBOX');
  const [workspacePath, setWorkspacePath] = useState<string>('');
  const [openFiles, setOpenFiles] = useState<string[]>(['main.ts', 'server.py', 'index.rs']);
  const [activeFile, setActiveFile] = useState<string>('main.ts');
  const [fileSearchQuery, setFileSearchQuery] = useState<string>('');
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
  const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);

  // Terminal & Logs
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { type: 'sys', text: 'SynapseGrid Cybernetic Workstation v1.2 RLM initialized.' },
    { type: 'ok', text: 'Dual-Engine active: Standalone Local IPC + Yjs Collaboration Mesh.' },
    { type: 'info', text: 'Press Ctrl+Enter to compile & run code. Press Ctrl+S to save buffer.' },
  ]);

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
    'Maintain continuous telemetry heartbeat for early deadlock detection.',
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
          { type: 'ok', text: `Loaded native workspace tree: ${dirPath}` },
        ]);
      }
    } else {
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'info', text: 'Local Directory Picker is optimized for Desktop Electron. Switch to Desktop app for native OS access.' },
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
      setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Saved ${activeFile} to active memory buffer.` }]);
    }
  };

  // Run Compiler / Execution
  const handleRunCode = async () => {
    setIsCompiling(true);
    const codeToRun = fileContents[activeFile] || '';
    const startTime = Date.now();
    setTerminalLogs((prev) => [
      ...prev,
      { type: 'cmd', text: `run [${selectedLanguage.toUpperCase()}] ${activeFile}` },
    ]);

    try {
      if (isDesktop) {
        const res = await (window as any).synapseDesktop.compiler.runLocal(codeToRun, selectedLanguage);
        const elapsed = res.executionTimeMs || Date.now() - startTime;
        setLastExecutionTime(elapsed);

        if (res.success) {
          setLastErrorTrace('');
          if (res.stdout) {
            setTerminalLogs((prev) => [...prev, { type: 'ok', text: res.stdout.trim() }]);
          }
          setTerminalLogs((prev) => [...prev, { type: 'sys', text: `Process exited with code 0 (${elapsed}ms)` }]);
        } else {
          setLastErrorTrace(res.stderr || res.stdout);
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'err', text: `Execution fault: ${res.stderr || res.stdout}` },
          ]);
        }
      } else {
        const response = await apiClient.post('/api/compiler/execute', {
          language: selectedLanguage,
          code: codeToRun,
        });
        const elapsed = Date.now() - startTime;
        setLastExecutionTime(elapsed);

        if (response.data.success) {
          setLastErrorTrace('');
          if (response.data.stdout) {
            setTerminalLogs((prev) => [...prev, { type: 'ok', text: response.data.stdout.trim() }]);
          }
          setTerminalLogs((prev) => [...prev, { type: 'sys', text: `Remote sandbox execution completed (${elapsed}ms)` }]);
        } else {
          setLastErrorTrace(response.data.stderr || response.data.stdout);
          setTerminalLogs((prev) => [
            ...prev,
            { type: 'err', text: `Execution failed: ${response.data.stderr || response.data.stdout}` },
          ]);
        }
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message;
      setLastErrorTrace(errMsg);
      setTerminalLogs((prev) => [...prev, { type: 'err', text: `System fault: ${errMsg}` }]);
    } finally {
      setIsCompiling(false);
    }
  };

  // Prime Agent Task Execution
  const handlePrimeExecute = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || primePrompt;
    if (!promptToSend.trim()) return;

    setIsPrimeThinking(true);
    setActiveTab('prime');
    setPrimeOutput('Engaging Prime Agent RLM harness...\nDiagnosing session context & symbol tree...');

    try {
      const res = await apiClient.post('/api/prime/task', {
        prompt: promptToSend,
        fileContext: {
          filename: activeFile,
          content: fileContents[activeFile],
          language: selectedLanguage,
        },
      });

      setPrimeOutput(`[PRIME RLM RESPONSE - SUCCESS]\n${res.data.output}`);
      setPrimePrompt('');
    } catch (err: any) {
      setPrimeOutput(`Prime Agent execution error: ${err.message}`);
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

  // Helper for file type icon
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.ts') || filename.endsWith('.js')) return <FileCode className="w-3.5 h-3.5 text-cyan-400" />;
    if (filename.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
    if (filename.endsWith('.rs')) return <FileCode className="w-3.5 h-3.5 text-rose-400" />;
    if (filename.endsWith('.go')) return <FileCode className="w-3.5 h-3.5 text-cyan-300" />;
    if (filename.endsWith('.json')) return <FileText className="w-3.5 h-3.5 text-emerald-400" />;
    return <FileText className="w-3.5 h-3.5 text-slate-400" />;
  };

  // Filtered files in tree
  const filteredTree = nativeTree.filter((item) =>
    item.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#040711] overflow-hidden text-slate-200 font-sans select-none">
      
      {/* Frameless Cybernetic Window Titlebar */}
      <header
        className="h-10 bg-[#050814] border-b border-indigo-950/60 px-3 flex justify-between items-center text-xs font-mono select-none"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
            <Code2 className="w-3 h-3 text-white" />
          </div>
          <span className="font-bold tracking-wider text-white flex items-center gap-1">
            SYNAPSE<span className="text-cyan-400 font-light">GRID</span>
          </span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400 truncate max-w-xs">{workspaceName}</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950/80 text-cyan-300 border border-indigo-800/50 font-semibold">
            {isDesktop ? 'DESKTOP WORKSTATION' : 'CLOUD MESH'}
          </span>
        </div>

        {/* Center Live Telemetry Status Pill */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-slate-800 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-medium font-mono">PRIME RLM READY</span>
          </div>
          {hostStats && (
            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
              <span>CPU: <strong className="text-white">{hostStats.cpuUsagePercent}%</strong></span>
              <span>RAM: <strong className="text-white">{hostStats.ramUsagePercent}%</strong></span>
            </div>
          )}
        </div>

        {/* Window Controls (Electron) */}
        <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Link
            href="/"
            className="px-2.5 py-1 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1"
          >
            <span>Home</span>
          </Link>
          {isDesktop ? (
            <div className="flex items-center ml-2 border-l border-slate-800 pl-2 gap-0.5">
              <button
                onClick={handleMinimize}
                title="Minimize"
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleMaximize}
                title="Maximize"
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 rounded"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClose}
                title="Close"
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-900/80 rounded"
              >
                <X className="w-3.5 h-3.5" />
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
        
        {/* Far-Left Activity Bar (VS Code / Linear style) */}
        <nav className="w-12 bg-[#03050c] border-r border-indigo-950/60 flex flex-col justify-between items-center py-3 select-none flex-shrink-0">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveSidebarView('explorer')}
              title="File Explorer"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeSidebarView === 'explorer'
                  ? 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <Folder className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSidebarView('prime');
                setActiveTab('prime');
              }}
              title="Prime Agent RLM Studio"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeSidebarView === 'prime'
                  ? 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSidebarView('telemetry');
                setActiveTab('host');
              }}
              title="Host Telemetry &amp; Radar"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeSidebarView === 'telemetry'
                  ? 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveSidebarView('memory');
              }}
              title="Continual Harness Memory"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                activeSidebarView === 'memory'
                  ? 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              <Brain className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={handleOpenLocalDirectory}
              title="Open Folder on Disk"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-cyan-300 hover:bg-slate-900/40 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Primary Left Sidebar: File Navigator & Explorer */}
        <aside className="w-64 bg-[#040713] border-r border-indigo-950/60 flex flex-col justify-between overflow-hidden flex-shrink-0">
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Explorer Header */}
            <div className="p-3 border-b border-indigo-950/60 flex justify-between items-center bg-[#050816]">
              <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                EXPLORER
              </span>
              <button
                onClick={handleOpenLocalDirectory}
                className="px-2.5 py-1 bg-indigo-950/60 hover:bg-indigo-900/50 border border-indigo-800/40 rounded-lg text-[10px] font-mono text-cyan-300 hover:text-white transition-all flex items-center gap-1.5"
                title="Open real local folder on your computer"
              >
                <FolderOpen className="w-3 h-3" />
                <span>Open Folder</span>
              </button>
            </div>

            {/* Quick Filter Search */}
            <div className="p-2 border-b border-indigo-950/40">
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter files..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="w-full bg-[#02040b] border border-indigo-950/80 rounded-lg pl-7 pr-2.5 py-1 text-[11px] font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* File Tree listing */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5">
              {nativeTree.length > 0 ? (
                filteredTree.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectFile(item)}
                    className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                      activeFile === item.name
                        ? 'bg-indigo-950/80 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                    }`}
                  >
                    {item.isDirectory ? <Folder className="w-3.5 h-3.5 text-indigo-400" /> : getFileIcon(item.name)}
                    <span className="truncate">{item.name}</span>
                  </div>
                ))
              ) : (
                Object.keys(fileContents)
                  .filter((fn) => fn.toLowerCase().includes(fileSearchQuery.toLowerCase()))
                  .map((fileName) => (
                    <div
                      key={fileName}
                      onClick={() => setActiveFile(fileName)}
                      className={`px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                        activeFile === fileName
                          ? 'bg-indigo-950/80 text-cyan-300 border-l-2 border-cyan-400 font-semibold'
                          : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                      }`}
                    >
                      {getFileIcon(fileName)}
                      <span className="truncate">{fileName}</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Bottom Host Badge */}
          <div className="p-3 bg-[#02040b] border-t border-indigo-950/60 text-[11px] font-mono text-slate-500">
            <div className="flex justify-between items-center">
              <span>HOST:</span>
              <span className="text-slate-300 font-medium">{hostStats?.hostname || 'SYNAPSE-LOCAL'}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>PRIME HARNESS:</span>
              <span className="text-emerald-400 font-semibold">v{primeStatus.version}</span>
            </div>
          </div>
        </aside>

        {/* Center Panel: Multi-Tab Code Editor & Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#030612]">
          
          {/* Editor Header Bar with Open Tabs & Action Controls */}
          <div className="h-10 bg-[#050816] border-b border-indigo-950/60 px-3 flex justify-between items-center">
            
            {/* Open File Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {openFiles.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveFile(tab)}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono cursor-pointer flex items-center gap-2 border-t-2 transition-all ${
                    activeFile === tab
                      ? 'bg-[#030612] text-white border-cyan-400 font-semibold shadow-sm'
                      : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  {getFileIcon(tab)}
                  <span>{tab}</span>
                  {tab === activeFile && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (openFiles.length > 1) {
                          const next = openFiles.filter((f) => f !== tab);
                          setOpenFiles(next);
                          if (activeFile === tab) setActiveFile(next[0]);
                        }
                      }}
                      className="ml-1 text-slate-500 hover:text-white rounded"
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Language Picker & Execution Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Execution Timer Pill */}
              {lastExecutionTime !== null && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{lastExecutionTime}ms</span>
                </div>
              )}

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#02050f] border border-indigo-950/80 text-cyan-300 text-xs font-mono rounded-lg px-2.5 py-1 outline-none"
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
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5"
                title="Save (Ctrl+S)"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isCompiling}
                className={`px-4 py-1 rounded-lg text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-[0.98] ${
                  isCompiling
                    ? 'bg-amber-600/70 text-white cursor-wait animate-pulse'
                    : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/25'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isCompiling ? 'Running...' : 'Run Code'}</span>
              </button>

              {lastErrorTrace && (
                <button
                  onClick={handlePrimeAutoHeal}
                  className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 rounded-lg text-xs font-mono font-bold animate-pulse transition-all flex items-center gap-1.5"
                  title="Prime Agent Autonomous Self-Healing"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Auto-Heal</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Editor Body */}
          <div className="flex-1 relative flex overflow-hidden">
            {/* Line numbers column */}
            <div className="w-12 bg-[#030612] text-slate-600 font-mono text-xs text-right pr-3 pt-4 select-none border-r border-indigo-950/30">
              {(fileContents[activeFile] || '').split('\n').map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
              ))}
            </div>

            {/* Code text area */}
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
          <div className="h-60 bg-[#02050f] border-t border-indigo-950/60 flex flex-col overflow-hidden">
            
            {/* Dock Tab Selector */}
            <div className="h-9 bg-[#040715] border-b border-indigo-950/50 px-3 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'text-cyan-300 font-bold bg-indigo-950/60 border border-indigo-800/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>SHELL OUTPUT</span>
                </button>
                <button
                  onClick={() => setActiveTab('prime')}
                  className={`py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'prime'
                      ? 'text-cyan-300 font-bold bg-indigo-950/60 border border-indigo-800/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>PRIME AGENT RLM</span>
                  {primeStatus.daemonActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                </button>
                <button
                  onClick={() => setActiveTab('repl')}
                  className={`py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'repl'
                      ? 'text-cyan-300 font-bold bg-indigo-950/60 border border-indigo-800/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>REPL KERNEL</span>
                </button>
                <button
                  onClick={() => setActiveTab('host')}
                  className={`py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'host'
                      ? 'text-cyan-300 font-bold bg-indigo-950/60 border border-indigo-800/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>HOST RADAR</span>
                </button>
              </div>

              {/* Utility buttons for dock */}
              <div className="flex items-center gap-2 text-slate-500">
                <button
                  onClick={() => setTerminalLogs([])}
                  title="Clear Output"
                  className="p-1 hover:text-slate-300 hover:bg-slate-900 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dock Content */}
            <div className="flex-1 overflow-y-auto p-3 font-mono text-xs">
              
              {/* Tab 1: Terminal Shell Logs */}
              {activeTab === 'editor' && (
                <div className="space-y-1">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed flex items-start gap-2">
                      {log.type === 'sys' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-indigo-950/80 text-cyan-400 text-[10px] font-bold">SYS</span>
                          <span className="text-slate-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'ok' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-bold">OK</span>
                          <span className="text-emerald-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'info' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] font-bold">INFO</span>
                          <span className="text-slate-400">{log.text}</span>
                        </>
                      )}
                      {log.type === 'cmd' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-400 text-[10px] font-bold">CMD</span>
                          <span className="text-amber-300 font-semibold">{log.text}</span>
                        </>
                      )}
                      {log.type === 'err' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-400 text-[10px] font-bold">ERR</span>
                          <span className="text-rose-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'log' && (
                        <span className="text-slate-300">{log.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Prime Agent Autonomous HUD */}
              {activeTab === 'prime' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">PRIME AGENT RLM HARNESS</span>
                        <span className="text-slate-500">| Mode: {primeStatus.daemonActive ? 'Daemon' : 'Embedded'}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Autonomous Diagnostic Engine
                      </span>
                    </div>

                    {primeOutput && (
                      <div className="p-3 rounded-xl bg-[#030614] border border-indigo-950/80 text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {primeOutput}
                      </div>
                    )}

                    {suggestedPatch && (
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Autonomous self-healed patch ready for {activeFile}.</span>
                        </div>
                        <button
                          onClick={handleApplyPatch}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-md active:scale-[0.98]"
                        >
                          Apply Patch to Editor
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prime Prompt Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-indigo-950/60">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={primePrompt}
                        onChange={(e) => setPrimePrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePrimeExecute()}
                        placeholder="Ask Prime Agent: 'Refactor memory leak', 'Add unit tests', 'Explain algorithm'..."
                        className="w-full bg-[#030614] border border-indigo-950/80 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-400 text-xs"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handlePrimeExecute()}
                        disabled={isPrimeThinking}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white rounded-lg font-bold text-xs"
                      >
                        {isPrimeThinking ? 'Thinking...' : 'Instruct'}
                      </button>
                      <button
                        onClick={() => handlePrimeExecute('Optimize performance and reduce memory allocations')}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg text-xs"
                      >
                        Optimize
                      </button>
                      <button
                        onClick={() => handlePrimeExecute('Generate comprehensive test suite')}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded-lg text-xs"
                      >
                        Gen Tests
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Python REPL Console */}
              {activeTab === 'repl' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-1 overflow-y-auto space-y-1 mb-2">
                    {replLogs.map((log, i) => (
                      <div key={i}>
                        <div className="text-cyan-400">&gt;&gt;&gt; {log.cmd}</div>
                        <div className="text-emerald-400 pl-4">{log.out}</div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleReplSubmit} className="flex gap-2">
                    <span className="text-cyan-400 font-bold">&gt;&gt;&gt;</span>
                    <input
                      type="text"
                      value={replInput}
                      onChange={(e) => setReplInput(e.target.value)}
                      placeholder="Execute Python / RLM statement in persistent kernel..."
                      className="flex-1 bg-[#030614] border border-indigo-950/80 rounded-lg px-3 py-1.5 text-white outline-none focus:border-cyan-400"
                    />
                  </form>
                </div>
              )}

              {/* Tab 4: Host Telemetry Radar */}
              {activeTab === 'host' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#030614] border border-indigo-950/80 rounded-xl">
                      <span className="text-slate-500 text-[10px]">CPU LOAD</span>
                      <div className="text-xl font-bold text-cyan-400">{hostStats?.cpuUsagePercent || 12}%</div>
                      <span className="text-[10px] text-slate-500 truncate block">{hostStats?.cpuModel || 'Host Cores'}</span>
                    </div>
                    <div className="p-3 bg-[#030614] border border-indigo-950/80 rounded-xl">
                      <span className="text-slate-500 text-[10px]">RAM ALLOCATION</span>
                      <div className="text-xl font-bold text-emerald-400">{hostStats?.ramUsagePercent || 36}%</div>
                      <span className="text-[10px] text-slate-500">
                        {hostStats ? `${Math.round(hostStats.ramUsedBytes / (1024 * 1024 * 1024))}GB / ${Math.round(hostStats.ramTotalBytes / (1024 * 1024 * 1024))}GB` : 'Nominal'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#030614] border border-indigo-950/80 rounded-xl">
                      <span className="text-slate-500 text-[10px]">PLATFORM NODE</span>
                      <div className="text-sm font-bold text-white truncate">{hostStats?.platform || 'Windows x64'}</div>
                      <span className="text-[10px] text-slate-500">Host: {hostStats?.hostname || 'LOCAL'}</span>
                    </div>
                    <div className="p-3 bg-[#030614] border border-indigo-950/80 rounded-xl">
                      <span className="text-slate-500 text-[10px]">PORT SCANNER</span>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
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
                      <div className="text-slate-400 font-bold mb-2 text-xs">RUNNING OS PROCESSES ({hostStats.topProcesses.length})</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-400 font-mono">
                        {hostStats.topProcesses.slice(0, 8).map((proc) => (
                          <div key={proc.pid} className="p-2 bg-[#030614] border border-indigo-950/80 rounded-lg flex justify-between items-center">
                            <div className="truncate mr-2">
                              <div className="text-white font-medium truncate max-w-[110px]">{proc.name}</div>
                              <span className="text-[10px] text-slate-500">PID: {proc.pid} | {Math.round(proc.memory / 1024 / 1024)}MB</span>
                            </div>
                            <button
                              onClick={() => handleKillProcess(proc.pid)}
                              className="px-1.5 py-0.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded text-[10px]"
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
        <aside className="w-64 bg-[#040713] border-l border-indigo-950/60 p-3 flex flex-col justify-between overflow-y-auto flex-shrink-0">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
                <span>CONTINUAL MEMORY</span>
              </div>
              <div className="mt-2.5 space-y-2">
                {continualLessons.map((lesson, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#02050f] border border-indigo-950/80 text-[11px] text-slate-300 leading-snug">
                    <span className="text-cyan-400 font-bold">#{idx + 1}:</span> {lesson}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-indigo-950/60 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                <Radio className="w-3.5 h-3.5 text-indigo-400" />
                <span>SWARM PRESENCE</span>
              </div>
              <div className="mt-2.5 space-y-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#02050f] border border-indigo-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-white font-medium">Prime RLM Core</span>
                  </div>
                  <span className="text-[10px] text-emerald-400">ACTIVE</span>
                </div>
                <div className="p-2 rounded-lg bg-[#02050f] border border-indigo-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-medium">Host Sentry</span>
                  </div>
                  <span className="text-[10px] text-cyan-400">STREAMING</span>
                </div>
                <div className="p-2 rounded-lg bg-[#02050f] border border-indigo-950/80 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-600" />
                    <span className="text-slate-400">Yjs Peer Mesh</span>
                  </div>
                  <span className="text-[10px] text-slate-500">STANDBY</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-indigo-950/60 text-[10px] text-slate-600 font-mono text-center">
            SYNAPSEGRID CYBERNETIC MESH
          </div>
        </aside>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
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
  FolderPlus,
  FileCode,
  FilePlus,
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
  ChevronDown,
  Brain,
  HelpCircle,
  Hash,
  RefreshCw,
  Plus,
  Wand2,
  ShieldCheck,
  Command,
} from 'lucide-react';

// Dynamic import of Monaco Editor with SSR disabled
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0c0d0e] text-zinc-500 font-mono text-xs">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>Initializing Monaco Engine...</span>
      </div>
    </div>
  ),
});

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

  // Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('');

  // Modals for New File / New Folder
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFileNameInput, setNewFileNameInput] = useState('');
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderNameInput, setNewFolderNameInput] = useState('');

  // Editor & Workspace State
  const [workspaceName, setWorkspaceName] = useState<string>('SYNAPSE SANDBOX');
  const [workspacePath, setWorkspacePath] = useState<string>('');
  const [openFiles, setOpenFiles] = useState<string[]>(['main.ts', 'server.py', 'index.rs']);
  const [activeFile, setActiveFile] = useState<string>('main.ts');
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());
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
    { type: 'info', text: 'Monaco Editor active. Press Ctrl+Enter to compile & run. Press Ctrl+K for Command Palette.' },
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
  const [replHistory, setReplHistory] = useState<string[]>([]);
  const [replHistoryIndex, setReplHistoryIndex] = useState<number>(-1);
  const [replLogs, setReplLogs] = useState<Array<{ cmd: string; out: string }>>([
    { cmd: 'prime_version', out: '"0.10.4-rlm"' },
  ]);
  const [continualLessons, setContinualLessons] = useState<string[]>([
    'Always verify sandbox process exit codes before streaming output to UI.',
    'Use AST validation before patching multi-language code snippets.',
    'Isolate compiler temp directories per session to prevent race conditions.',
    'Maintain continuous telemetry heartbeat for early deadlock detection.',
  ]);
  const [newLessonInput, setNewLessonInput] = useState('');

  // Host Telemetry State
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [scannedPorts, setScannedPorts] = useState<Array<{ port: number; status: 'open' | 'closed' }>>([
    { port: 3000, status: 'open' },
    { port: 5000, status: 'open' },
    { port: 5432, status: 'closed' },
    { port: 6379, status: 'closed' },
    { port: 8080, status: 'closed' },
  ]);
  const [isScanningPorts, setIsScanningPorts] = useState(false);

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

  // Keyboard Shortcuts (Ctrl+S, Ctrl+Enter, Ctrl+K / Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveActiveFile();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || (e.shiftKey && e.key === 'P'))) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, fileContents, isCommandPaletteOpen]);

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

  // Refresh tree
  const handleRefreshTree = async () => {
    if (isDesktop && workspacePath) {
      try {
        const tree = await (window as any).synapseDesktop.fs.readTree(workspacePath);
        setNativeTree(tree);
        setTerminalLogs((prev) => [...prev, { type: 'ok', text: 'Refreshed workspace file tree.' }]);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Refresh error: ${err.message}` }]);
      }
    }
  };

  // Create New File
  const handleCreateFile = async () => {
    if (!newFileNameInput.trim()) return;
    const filename = newFileNameInput.trim();
    setIsNewFileModalOpen(false);
    setNewFileNameInput('');

    if (isDesktop && workspacePath) {
      try {
        const fullPath = `${workspacePath}/${filename}`;
        await (window as any).synapseDesktop.fs.createFile(fullPath, `// ${filename}\n`);
        await handleRefreshTree();
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Create file error: ${err.message}` }]);
      }
    }

    setFileContents((prev) => ({ ...prev, [filename]: `// ${filename}\n` }));
    if (!openFiles.includes(filename)) setOpenFiles((prev) => [...prev, filename]);
    setActiveFile(filename);
    setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Created file: ${filename}` }]);
  };

  // Create New Folder
  const handleCreateFolder = async () => {
    if (!newFolderNameInput.trim()) return;
    const folderName = newFolderNameInput.trim();
    setIsNewFolderModalOpen(false);
    setNewFolderNameInput('');

    if (isDesktop && workspacePath) {
      try {
        const fullPath = `${workspacePath}/${folderName}`;
        await (window as any).synapseDesktop.fs.createFolder(fullPath);
        await handleRefreshTree();
        setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Created directory: ${folderName}` }]);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Create folder error: ${err.message}` }]);
      }
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

  // Delete file
  const handleDeleteFile = async (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${item.name}?`)) {
      if (isDesktop && item.path) {
        try {
          await (window as any).synapseDesktop.fs.delete(item.path);
          await handleRefreshTree();
        } catch (err: any) {
          setTerminalLogs((prev) => [...prev, { type: 'err', text: `Delete error: ${err.message}` }]);
        }
      }
      setFileContents((prev) => {
        const next = { ...prev };
        delete next[item.name];
        return next;
      });
      setOpenFiles((prev) => prev.filter((f) => f !== item.name));
      if (activeFile === item.name) {
        const remaining = openFiles.filter((f) => f !== item.name);
        if (remaining.length > 0) setActiveFile(remaining[0]);
      }
      setTerminalLogs((prev) => [...prev, { type: 'info', text: `Deleted: ${item.name}` }]);
    }
  };

  // Save Active File
  const handleSaveActiveFile = async () => {
    const currentCode = fileContents[activeFile] || '';
    if (isDesktop && workspacePath) {
      try {
        const fullPath = `${workspacePath}/${activeFile}`;
        await (window as any).synapseDesktop.fs.writeFile(fullPath, currentCode);
        setDirtyFiles((prev) => {
          const next = new Set(prev);
          next.delete(activeFile);
          return next;
        });
        setTerminalLogs((prev) => [...prev, { type: 'ok', text: `Saved file: ${activeFile}` }]);
      } catch (err: any) {
        setTerminalLogs((prev) => [...prev, { type: 'err', text: `Save error: ${err.message}` }]);
      }
    } else {
      setDirtyFiles((prev) => {
        const next = new Set(prev);
        next.delete(activeFile);
        return next;
      });
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
      setDirtyFiles((prev) => new Set(prev).add(activeFile));
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
    setReplHistory((prev) => [...prev, cmd]);
    setReplHistoryIndex(-1);
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
      const stats = await (window as any).synapseDesktop.host.getStats();
      setHostStats(stats);
    }
  };

  // Live Port Scanner Trigger
  const handleScanPorts = async () => {
    setIsScanningPorts(true);
    const targetPorts = [3000, 5000, 5432, 6379, 8080];
    try {
      if (isDesktop) {
        const results = await (window as any).synapseDesktop.host.scanPorts(targetPorts);
        setScannedPorts(results);
      } else {
        // Fallback simulation for web
        setScannedPorts(targetPorts.map((p) => ({ port: p, status: p === 5000 || p === 3000 ? 'open' : 'closed' })));
      }
      setTerminalLogs((prev) => [...prev, { type: 'ok', text: 'Port connectivity scan completed.' }]);
    } catch (err: any) {
      setTerminalLogs((prev) => [...prev, { type: 'err', text: `Port scan error: ${err.message}` }]);
    } finally {
      setIsScanningPorts(false);
    }
  };

  // Add Continual Lesson
  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonInput.trim()) return;
    setContinualLessons((prev) => [...prev, newLessonInput.trim()]);
    setNewLessonInput('');
    setTerminalLogs((prev) => [...prev, { type: 'ok', text: 'Recorded new lesson to Continual Memory Harness.' }]);
  };

  // Helper for file type icon
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.ts') || filename.endsWith('.js')) return <FileCode className="w-3.5 h-3.5 text-zinc-300" />;
    if (filename.endsWith('.py')) return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
    if (filename.endsWith('.rs')) return <FileCode className="w-3.5 h-3.5 text-orange-400" />;
    if (filename.endsWith('.go')) return <FileCode className="w-3.5 h-3.5 text-emerald-400" />;
    if (filename.endsWith('.json')) return <FileText className="w-3.5 h-3.5 text-amber-300" />;
    return <FileText className="w-3.5 h-3.5 text-zinc-500" />;
  };

  // Filtered files in tree
  const filteredTree = nativeTree.filter((item) =>
    item.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#0c0d0e] overflow-hidden text-zinc-200 font-sans select-none">
      
      {/* Precision Window Titlebar */}
      <header
        className="h-10 bg-[#101113] border-b border-white/[0.06] px-3 flex justify-between items-center text-xs font-mono select-none"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-amber-400 text-[10px]">
            <Code2 className="w-3 h-3 text-amber-400" />
          </div>
          <span className="font-semibold tracking-wider text-zinc-100 flex items-center gap-1">
            Synapse<span className="text-amber-400 font-normal">Grid</span>
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 truncate max-w-xs">{workspaceName}</span>
        </div>

        {/* Center Spotlight Command Trigger */}
        <div className="hidden md:flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3 py-1 rounded bg-[#16171b] hover:bg-zinc-800 border border-white/[0.06] hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-all font-mono shadow-sm"
            title="Open Command Palette (Ctrl+K or Ctrl+Shift+P)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-zinc-400">Search commands, files, actions...</span>
            <span className="px-1.5 py-0.2 rounded bg-black/60 text-[10px] text-zinc-500 border border-zinc-800/80">Ctrl+K</span>
          </button>
        </div>

        {/* Right Section: Status Indicator, Home, Window Controls */}
        <div className="flex items-center gap-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready</span>
          </div>

          <Link
            href="/"
            className="px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
          >
            Home
          </Link>

          {isDesktop ? (
            <div className="flex items-center ml-1 border-l border-zinc-800/80 pl-2 gap-0.5">
              <button
                onClick={handleMinimize}
                title="Minimize"
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleMaximize}
                title="Maximize"
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 rounded transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClose}
                title="Close"
                className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-rose-900/80 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link href="/dashboard" className="text-zinc-400 hover:text-zinc-200 text-xs">
              Dashboard →
            </Link>
          )}
        </div>
      </header>

      {/* Main Workstation Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Far-Left Activity Bar (VS Code / Linear style) */}
        <nav className="w-11 bg-[#101113] border-r border-white/[0.06] flex flex-col justify-between items-center py-2.5 select-none flex-shrink-0 z-20">
          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={() => setActiveSidebarView('explorer')}
              title="File Explorer"
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
                activeSidebarView === 'explorer'
                  ? 'bg-zinc-800/90 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`}
            >
              {activeSidebarView === 'explorer' && (
                <span className="absolute -left-1.5 w-0.5 h-4 bg-amber-400 rounded-r" />
              )}
              <Folder className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSidebarView('prime')}
              title="Prime Agent Studio"
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
                activeSidebarView === 'prime'
                  ? 'bg-zinc-800/90 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`}
            >
              {activeSidebarView === 'prime' && (
                <span className="absolute -left-1.5 w-0.5 h-4 bg-amber-400 rounded-r" />
              )}
              <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSidebarView('telemetry')}
              title="Hardware Telemetry"
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
                activeSidebarView === 'telemetry'
                  ? 'bg-zinc-800/90 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`}
            >
              {activeSidebarView === 'telemetry' && (
                <span className="absolute -left-1.5 w-0.5 h-4 bg-amber-400 rounded-r" />
              )}
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSidebarView('memory')}
              title="Continual Memory & Swarm"
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors relative ${
                activeSidebarView === 'memory'
                  ? 'bg-zinc-800/90 text-amber-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
              }`}
            >
              {activeSidebarView === 'memory' && (
                <span className="absolute -left-1.5 w-0.5 h-4 bg-amber-400 rounded-r" />
              )}
              <Brain className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              title="Command Palette (Ctrl+K)"
              className="w-8 h-8 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors"
            >
              <Command className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenLocalDirectory}
              title="Open Folder on Disk"
              className="w-8 h-8 rounded flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Primary Left Sidebar: Dynamic View Selector */}
        <aside className="w-64 bg-[#121316] border-r border-white/[0.06] flex flex-col justify-between overflow-hidden flex-shrink-0">
          
          {/* VIEW 1: FILE EXPLORER */}
          {activeSidebarView === 'explorer' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Explorer Header */}
              <div className="h-9 px-3 border-b border-white/[0.06] flex justify-between items-center bg-[#141519]">
                <span className="text-xs font-semibold text-zinc-300">
                  Explorer
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsNewFileModalOpen(true)}
                    className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-amber-400 transition-colors"
                    title="New File"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-amber-400 transition-colors"
                    title="New Folder"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRefreshTree}
                    className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-amber-400 transition-colors"
                    title="Refresh Tree"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleOpenLocalDirectory}
                    className="p-1 hover:bg-zinc-800/80 rounded text-zinc-400 hover:text-amber-400 transition-colors"
                    title="Open Directory"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Filter Search */}
              <div className="p-2 border-b border-white/[0.05]">
                <div className="relative">
                  <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Filter files..."
                    value={fileSearchQuery}
                    onChange={(e) => setFileSearchQuery(e.target.value)}
                    className="w-full bg-[#0d0e11] border border-zinc-800/80 rounded pl-7 pr-2.5 py-1 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/80"
                  />
                </div>
              </div>

              {/* File Tree listing */}
              <div className="flex-1 overflow-y-auto p-1.5 font-mono text-xs space-y-0.5">
                {nativeTree.length > 0 ? (
                  filteredTree.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectFile(item)}
                      className={`px-2 py-1.5 rounded cursor-pointer transition-colors flex items-center justify-between group ${
                        activeFile === item.name
                          ? 'bg-zinc-800 text-zinc-100 font-medium'
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {item.isDirectory ? <Folder className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" /> : getFileIcon(item.name)}
                        <span className="truncate">{item.name}</span>
                        {dirtyFiles.has(item.name) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                        )}
                      </div>
                      <button
                        onClick={(e) => handleDeleteFile(item, e)}
                        title="Delete file"
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  Object.keys(fileContents)
                    .filter((fn) => fn.toLowerCase().includes(fileSearchQuery.toLowerCase()))
                    .map((fileName) => (
                      <div
                        key={fileName}
                        onClick={() => setActiveFile(fileName)}
                        className={`px-2 py-1.5 rounded cursor-pointer transition-colors flex items-center justify-between group ${
                          activeFile === fileName
                            ? 'bg-zinc-800 text-zinc-100 font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getFileIcon(fileName)}
                          <span className="truncate">{fileName}</span>
                          {dirtyFiles.has(fileName) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <button
                          onClick={(e) => handleDeleteFile({ id: fileName, name: fileName, path: fileName, isDirectory: false }, e)}
                          title="Delete file"
                          className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity p-0.5 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: PRIME AGENT STUDIO */}
          {activeSidebarView === 'prime' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="font-semibold text-zinc-200 font-sans">Prime Agent</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              </div>

              <div className="space-y-1 text-zinc-400 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Harness</span>
                  <span className="text-zinc-200">v{primeStatus.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mode</span>
                  <span className="text-zinc-200">{primeStatus.daemonActive ? 'Daemon (Detached)' : 'Embedded'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Engine</span>
                  <span className="text-zinc-200">RLM Kernel</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <span className="text-zinc-400 text-[11px] font-sans font-medium block">Quick Actions</span>
                <button
                  onClick={() => {
                    setActiveTab('prime');
                    handlePrimeExecute('Optimize performance and reduce memory allocations');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#16171d] hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                >
                  ⚡ Optimize Performance
                </button>
                <button
                  onClick={() => {
                    setActiveTab('prime');
                    handlePrimeExecute('Generate comprehensive test suite');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#16171d] hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                >
                  🧪 Generate Test Suite
                </button>
                <button
                  onClick={() => {
                    setActiveTab('prime');
                    handlePrimeExecute('Run deep security audit for race conditions and buffer boundaries');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#16171d] hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                >
                  🛡️ Security Audit
                </button>
                <button
                  onClick={() => {
                    setActiveTab('prime');
                    handlePrimeAutoHeal();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-[#16171d] hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
                >
                  ✨ Autonomous Auto-Heal
                </button>
              </div>

              <button
                onClick={() => setActiveTab('prime')}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition-colors mt-auto"
              >
                Open Prime Console
              </button>
            </div>
          )}

          {/* VIEW 3: HOST TELEMETRY */}
          {activeSidebarView === 'telemetry' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="font-semibold text-zinc-200 font-sans">Host Telemetry</span>
                <span className="text-[10px] text-zinc-400">{hostStats?.hostname || 'Local'}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-500">CPU Usage</span>
                    <span className="text-zinc-200 font-semibold">{hostStats?.cpuUsagePercent || 12}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${hostStats?.cpuUsagePercent || 12}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-500">RAM Usage</span>
                    <span className="text-zinc-200 font-semibold">{hostStats?.ramUsagePercent || 36}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${hostStats?.ramUsagePercent || 36}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                <div className="flex justify-between text-zinc-400">
                  <span className="text-zinc-500">Platform</span>
                  <span className="text-zinc-200">{hostStats?.platform || 'Windows x64'}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span className="text-zinc-500">Cores</span>
                  <span className="text-zinc-200">{hostStats?.cpuModel ? 'Active' : '4 Cores'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-zinc-400 font-sans font-medium">Port Scanner</span>
                  <button
                    onClick={handleScanPorts}
                    disabled={isScanningPorts}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-mono"
                  >
                    {isScanningPorts ? 'Scanning...' : 'Scan'}
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {scannedPorts.map((p) => (
                    <span
                      key={p.port}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                        p.status === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {p.port}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('host')}
                className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs transition-colors mt-auto"
              >
                View Full Radar Dock
              </button>
            </div>
          )}

          {/* VIEW 4: CONTINUAL MEMORY & SWARM */}
          {activeSidebarView === 'memory' && (
            <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                <span className="font-semibold text-zinc-200 font-sans">Continual Memory</span>
                <span className="text-[10px] text-zinc-400">{continualLessons.length} Rules</span>
              </div>

              <div className="space-y-2">
                {continualLessons.map((lesson, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#16171d] border border-white/[0.06] text-[11px] text-zinc-300 leading-snug">
                    <span className="text-amber-400 font-semibold">#{idx + 1}:</span> {lesson}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddLesson} className="pt-2 border-t border-white/[0.06]">
                <input
                  type="text"
                  placeholder="+ Add verified rule..."
                  value={newLessonInput}
                  onChange={(e) => setNewLessonInput(e.target.value)}
                  className="w-full bg-[#16171d] border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/80"
                />
              </form>

              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <span className="text-zinc-400 text-[11px] font-sans font-medium block">Swarm Mesh</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-1.5 rounded bg-[#16171d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-zinc-200">Prime RLM Core</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Active</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#16171d] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-zinc-200">Host Sentry</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Streaming</span>
                  </div>
                  <div className="p-1.5 rounded bg-[#16171d] border border-white/[0.06] flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span className="text-zinc-400">Yjs Peer Mesh</span>
                    </div>
                    <span className="text-[10px] text-zinc-500">Standby</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Sidebar Status Strip */}
          <div className="h-8 px-3 bg-[#0e0f12] border-t border-white/[0.06] text-[10px] font-mono text-zinc-500 flex justify-between items-center">
            <span>{hostStats?.hostname || 'Host'}</span>
            <span className="text-zinc-400">v{primeStatus.version}</span>
          </div>
        </aside>

        {/* Center Panel: Multi-Tab Code Editor & Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0c0d0e]">
          
          {/* Editor Header Bar with Open Tabs & Action Controls */}
          <div className="h-10 bg-[#121316] border-b border-white/[0.06] px-3 flex justify-between items-center">
            
            {/* Open File Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {openFiles.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveFile(tab)}
                  className={`px-3 py-1.5 rounded-t text-xs font-mono cursor-pointer flex items-center gap-2 border-t-2 transition-all ${
                    activeFile === tab
                      ? 'bg-[#0c0d0e] text-zinc-100 border-amber-400 font-medium'
                      : 'bg-transparent text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {getFileIcon(tab)}
                  <span>{tab}</span>
                  {dirtyFiles.has(tab) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
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
                      className="ml-1 text-zinc-500 hover:text-white rounded"
                    >
                      ×
                    </span>
                  )}
                </div>
              ))}
              <button
                onClick={() => setIsNewFileModalOpen(true)}
                title="New File Buffer"
                className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Picker & Execution Actions */}
            <div className="flex items-center gap-2.5">
              
              {/* Execution Timer Pill */}
              {lastExecutionTime !== null && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{lastExecutionTime}ms</span>
                </div>
              )}

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#16171b] border border-zinc-800 text-zinc-300 text-xs font-mono rounded px-2.5 py-1 outline-none focus:border-amber-500/80"
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
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/60 rounded text-xs font-mono transition-all flex items-center gap-1.5"
                title="Save (Ctrl+S)"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isCompiling}
                className={`px-3.5 py-1 rounded text-xs font-mono font-medium transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] ${
                  isCompiling
                    ? 'bg-amber-600/70 text-white cursor-wait animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-black font-semibold'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isCompiling ? 'Running...' : 'Run'}</span>
              </button>

              {lastErrorTrace && (
                <button
                  onClick={handlePrimeAutoHeal}
                  className="px-3 py-1 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 rounded text-xs font-mono font-medium transition-all flex items-center gap-1.5"
                  title="Prime Agent Autonomous Self-Healing"
                >
                  <Wand2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Auto-Heal</span>
                </button>
              )}
            </div>
          </div>

          {/* Code Editor Body — Monaco Professional Editor */}
          <div className="flex-1 relative flex overflow-hidden">
            <MonacoEditor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={fileContents[activeFile] || ''}
              onChange={(value) => {
                const val = value || '';
                setFileContents((prev) => ({ ...prev, [activeFile]: val }));
                setDirtyFiles((prev) => new Set(prev).add(activeFile));
              }}
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                tabSize: 2,
              }}
            />
          </div>

          {/* Bottom Dock: Precision Developer Console */}
          <div className="h-64 bg-[#0e0f12] border-t border-white/[0.06] flex flex-col overflow-hidden z-10">
            
            {/* Dock Tab Selector */}
            <div className="h-9 bg-[#121316] border-b border-white/[0.06] px-3 flex justify-between items-center text-xs font-mono">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`py-1 px-2.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'text-zinc-100 font-medium bg-zinc-800 border border-zinc-700/60'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal</span>
                </button>
                <button
                  onClick={() => setActiveTab('prime')}
                  className={`py-1 px-2.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'prime'
                      ? 'text-zinc-100 font-medium bg-zinc-800 border border-zinc-700/60'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Prime Agent</span>
                  {primeStatus.daemonActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
                <button
                  onClick={() => setActiveTab('repl')}
                  className={`py-1 px-2.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'repl'
                      ? 'text-zinc-100 font-medium bg-zinc-800 border border-zinc-700/60'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Python REPL</span>
                </button>
                <button
                  onClick={() => setActiveTab('host')}
                  className={`py-1 px-2.5 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
                    activeTab === 'host'
                      ? 'text-zinc-100 font-medium bg-zinc-800 border border-zinc-700/60'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Hardware Radar</span>
                </button>
              </div>

              {/* Utility buttons for dock */}
              <div className="flex items-center gap-2 text-zinc-500">
                <button
                  onClick={() => {
                    const text = terminalLogs.map((l) => l.text).join('\n');
                    navigator.clipboard.writeText(text);
                    setTerminalLogs((prev) => [...prev, { type: 'ok', text: 'Copied terminal logs to clipboard.' }]);
                  }}
                  title="Copy Console Output"
                  className="p-1 hover:text-zinc-300 hover:bg-zinc-800 rounded"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTerminalLogs([])}
                  title="Clear Output"
                  className="p-1 hover:text-zinc-300 hover:bg-zinc-800 rounded"
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
                          <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px] font-medium">SYS</span>
                          <span className="text-zinc-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'ok' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 text-[10px] font-medium">OK</span>
                          <span className="text-emerald-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'info' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-zinc-850 text-zinc-400 text-[10px] font-medium">INFO</span>
                          <span className="text-zinc-400">{log.text}</span>
                        </>
                      )}
                      {log.type === 'cmd' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 text-[10px] font-medium">CMD</span>
                          <span className="text-amber-300 font-medium">{log.text}</span>
                        </>
                      )}
                      {log.type === 'err' && (
                        <>
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 text-[10px] font-medium">ERR</span>
                          <span className="text-rose-300">{log.text}</span>
                        </>
                      )}
                      {log.type === 'log' && (
                        <span className="text-zinc-300">{log.text}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Prime Agent Autonomous HUD */}
              {activeTab === 'prime' && (
                <div className="flex flex-col h-full justify-between">
                  <div className="flex-1 overflow-y-auto space-y-2.5 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-semibold">Prime Agent RLM Harness</span>
                        <span className="text-zinc-500">| Mode: {primeStatus.daemonActive ? 'Daemon' : 'Embedded'}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800">
                        Autonomous Diagnostic Engine
                      </span>
                    </div>

                    {primeOutput && (
                      <div className="p-3 rounded bg-[#14151a] border border-white/[0.06] text-zinc-300 whitespace-pre-wrap leading-relaxed">
                        {primeOutput}
                      </div>
                    )}

                    {suggestedPatch && (
                      <div className="p-3 rounded bg-zinc-900 border border-emerald-500/30 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-zinc-200">Autonomous self-healed patch ready for {activeFile}.</span>
                        </div>
                        <button
                          onClick={handleApplyPatch}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs transition-all active:scale-[0.98]"
                        >
                          Apply Patch
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Prime Prompt Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/[0.06]">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={primePrompt}
                        onChange={(e) => setPrimePrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handlePrimeExecute()}
                        placeholder="Instruct Prime Agent: 'Refactor memory leak', 'Add unit tests', 'Explain algorithm'..."
                        className="w-full bg-[#14151a] border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 outline-none focus:border-amber-500/80 text-xs"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handlePrimeExecute()}
                        disabled={isPrimeThinking}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition-all active:scale-[0.98]"
                      >
                        {isPrimeThinking ? 'Thinking...' : 'Instruct'}
                      </button>
                      <button
                        onClick={() => handlePrimeExecute('Optimize performance and reduce memory allocations')}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 rounded text-xs"
                      >
                        Optimize
                      </button>
                      <button
                        onClick={() => handlePrimeExecute('Generate comprehensive test suite')}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 rounded text-xs"
                      >
                        Gen Tests
                      </button>
                      <button
                        onClick={() => handlePrimeExecute('Run deep security audit for race conditions and buffer boundaries')}
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/60 rounded text-xs"
                      >
                        Audit
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
                        <div className="text-amber-400">&gt;&gt;&gt; {log.cmd}</div>
                        <div className="text-zinc-300 pl-4">{log.out}</div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleReplSubmit} className="flex gap-2">
                    <span className="text-amber-400 font-bold">&gt;&gt;&gt;</span>
                    <input
                      type="text"
                      value={replInput}
                      onChange={(e) => setReplInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' && replHistory.length > 0) {
                          e.preventDefault();
                          const nextIdx = replHistoryIndex === -1 ? replHistory.length - 1 : Math.max(0, replHistoryIndex - 1);
                          setReplHistoryIndex(nextIdx);
                          setReplInput(replHistory[nextIdx]);
                        } else if (e.key === 'ArrowDown' && replHistoryIndex !== -1) {
                          e.preventDefault();
                          const nextIdx = replHistoryIndex + 1;
                          if (nextIdx >= replHistory.length) {
                            setReplHistoryIndex(-1);
                            setReplInput('');
                          } else {
                            setReplHistoryIndex(nextIdx);
                            setReplInput(replHistory[nextIdx]);
                          }
                        }
                      }}
                      placeholder="Execute Python / RLM statement (e.g. 2**32, import sys; sys.version)..."
                      className="flex-1 bg-[#14151a] border border-zinc-800 rounded px-3 py-1.5 text-zinc-100 outline-none focus:border-amber-500/80"
                    />
                  </form>
                </div>
              )}

              {/* Tab 4: Host Telemetry Radar */}
              {activeTab === 'host' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-[#14151a] border border-white/[0.06] rounded">
                      <span className="text-zinc-500 text-[10px]">CPU Load</span>
                      <div className="text-xl font-bold text-zinc-100">{hostStats?.cpuUsagePercent || 12}%</div>
                      <span className="text-[10px] text-zinc-500 truncate block">{hostStats?.cpuModel || 'Host Cores'}</span>
                    </div>
                    <div className="p-3 bg-[#14151a] border border-white/[0.06] rounded">
                      <span className="text-zinc-500 text-[10px]">RAM Allocation</span>
                      <div className="text-xl font-bold text-zinc-100">{hostStats?.ramUsagePercent || 36}%</div>
                      <span className="text-[10px] text-zinc-500">
                        {hostStats ? `${Math.round(hostStats.ramUsedBytes / (1024 * 1024 * 1024))}GB / ${Math.round(hostStats.ramTotalBytes / (1024 * 1024 * 1024))}GB` : 'Nominal'}
                      </span>
                    </div>
                    <div className="p-3 bg-[#14151a] border border-white/[0.06] rounded">
                      <span className="text-zinc-500 text-[10px]">Platform Node</span>
                      <div className="text-sm font-semibold text-zinc-200 truncate">{hostStats?.platform || 'Windows x64'}</div>
                      <span className="text-[10px] text-zinc-500">Host: {hostStats?.hostname || 'LOCAL'}</span>
                    </div>
                    <div className="p-3 bg-[#14151a] border border-white/[0.06] rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500 text-[10px]">Port Scanner</span>
                        <button
                          onClick={handleScanPorts}
                          disabled={isScanningPorts}
                          className="text-[10px] text-amber-400 hover:text-amber-300 font-mono"
                        >
                          {isScanningPorts ? 'Scanning...' : 'Scan'}
                        </button>
                      </div>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {scannedPorts.map((p) => (
                          <span
                            key={p.port}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              p.status === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-800 text-zinc-500'
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
                      <div className="text-zinc-400 font-semibold mb-2 text-xs flex justify-between items-center">
                        <span>Running OS Processes ({hostStats.topProcesses.length})</span>
                        <span className="text-[10px] font-normal text-zinc-500">Native Process Control Active</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-zinc-400 font-mono">
                        {hostStats.topProcesses.slice(0, 8).map((proc) => (
                          <div key={proc.pid} className="p-2 bg-[#14151a] border border-white/[0.06] rounded flex justify-between items-center">
                            <div className="truncate mr-2">
                              <div className="text-zinc-200 font-medium truncate max-w-[110px]">{proc.name}</div>
                              <span className="text-[10px] text-zinc-500">PID: {proc.pid} | {Math.round(proc.memory / 1024 / 1024)}MB</span>
                            </div>
                            <button
                              onClick={() => handleKillProcess(proc.pid)}
                              className="px-1.5 py-0.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded text-[10px] transition-colors"
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
      </div>

      {/* ================= COMMAND PALETTE MODAL ================= */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-xl bg-[#16171d] rounded-xl border border-zinc-700/80 overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-zinc-800 flex items-center gap-3 bg-[#121316]">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search action (e.g., 'Run', 'Heal', 'Save', 'Test')..."
                value={commandPaletteQuery}
                onChange={(e) => setCommandPaletteQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-mono text-zinc-100 placeholder-zinc-500 outline-none"
              />
              <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded">ESC</span>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto space-y-0.5 font-mono text-xs">
              {[
                { label: 'Compile & Run Active Code', icon: Play, action: () => { handleRunCode(); setIsCommandPaletteOpen(false); }, shortcut: 'Ctrl+Enter' },
                { label: 'Prime Agent: Autonomous Self-Healing', icon: Wand2, action: () => { handlePrimeAutoHeal(); setIsCommandPaletteOpen(false); } },
                { label: 'Prime Agent: Optimize Performance', icon: Zap, action: () => { handlePrimeExecute('Optimize performance and reduce memory allocations'); setIsCommandPaletteOpen(false); } },
                { label: 'Prime Agent: Generate Test Suite', icon: Sparkles, action: () => { handlePrimeExecute('Generate comprehensive test suite'); setIsCommandPaletteOpen(false); } },
                { label: 'Save Active File to Disk', icon: Save, action: () => { handleSaveActiveFile(); setIsCommandPaletteOpen(false); }, shortcut: 'Ctrl+S' },
                { label: 'Open Native Workspace Folder', icon: FolderOpen, action: () => { handleOpenLocalDirectory(); setIsCommandPaletteOpen(false); } },
                { label: 'Create New File Buffer', icon: FilePlus, action: () => { setIsNewFileModalOpen(true); setIsCommandPaletteOpen(false); } },
                { label: 'Create New Directory Folder', icon: FolderPlus, action: () => { setIsNewFolderModalOpen(true); setIsCommandPaletteOpen(false); } },
                { label: 'Run Port Connectivity Scan', icon: Activity, action: () => { handleScanPorts(); setIsCommandPaletteOpen(false); } },
                { label: 'Clear Shell Output Logs', icon: Trash2, action: () => { setTerminalLogs([]); setIsCommandPaletteOpen(false); } },
              ]
                .filter((cmd) => cmd.label.toLowerCase().includes(commandPaletteQuery.toLowerCase()))
                .map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={idx}
                      onClick={cmd.action}
                      className="px-3 py-2.5 rounded-md hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-amber-400" />
                        <span>{cmd.label}</span>
                      </div>
                      {cmd.shortcut && (
                        <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                          {cmd.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW FILE MODAL ================= */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-[#16171d] rounded-xl border border-zinc-700/80 p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2 font-sans flex items-center gap-2">
              <FilePlus className="w-4 h-4 text-amber-400" />
              <span>Create New File</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-3 font-mono">Enter filename with extension (e.g., worker.ts, app.py):</p>
            <input
              type="text"
              autoFocus
              value={newFileNameInput}
              onChange={(e) => setNewFileNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
              placeholder="e.g. telemetry.py"
              className="w-full bg-[#121316] border border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-100 outline-none focus:border-amber-400 mb-4"
            />
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                onClick={() => setIsNewFileModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= NEW FOLDER MODAL ================= */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-[#16171d] rounded-xl border border-zinc-700/80 p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-2 font-sans flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Create New Folder</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-3 font-mono">Enter folder name:</p>
            <input
              type="text"
              autoFocus
              value={newFolderNameInput}
              onChange={(e) => setNewFolderNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              placeholder="e.g. services"
              className="w-full bg-[#121316] border border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-100 outline-none focus:border-amber-400 mb-4"
            />
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

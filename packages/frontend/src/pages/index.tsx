import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Bot,
  Users,
  Play,
  Shield,
  Activity,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  Radio,
  FolderGit2,
  CheckCircle2,
  Server,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [activeSnippet, setActiveSnippet] = useState<'prime' | 'compiler' | 'mesh'>('prime');

  return (
    <div className="min-h-[100dvh] bg-[#040711] cyber-grid relative overflow-x-hidden flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient Radial Mesh Lighting */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[35%] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center border-b border-indigo-950/50 backdrop-blur-xl sticky top-0 z-50 bg-[#040711]/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/25 border border-white/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white font-sans flex items-center gap-1.5">
              SYNAPSE<span className="text-cyan-400 font-light">GRID</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50 font-semibold tracking-wider">
                v1.2 RLM
              </span>
            </span>
          </div>
        </div>

        {/* Center Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold">PRIME RLM READY</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>MESH SYNC ACTIVE</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors font-medium"
          >
            Log In
          </Link>
          <Link
            href="/editor/session-desktop"
            className="px-5 py-2.5 text-xs uppercase tracking-wider font-mono font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl hover:from-indigo-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-indigo-600/25 border border-white/10 hover:shadow-cyan-500/25 active:scale-[0.98] flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Studio</span>
          </Link>
        </div>
      </nav>

      {/* Main Asymmetric Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 pt-12 pb-20 relative z-10 flex-grow">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission & CTAs */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/25 text-indigo-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Autonomous Cybernetic Development OS</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.08] font-sans">
                Next-Gen Workstation. <br />
                <span className="text-gradient-cyan">
                  Autonomous Prime Agent.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
                Engineered for engineers who build at terminal speed. Featuring persistent Python REPL kernels, autonomous code self-healing, multi-language sandbox, and zero-latency Yjs state sync.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/editor/session-desktop"
                className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white rounded-xl font-semibold text-sm transition-all shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2.5 border border-white/15"
              >
                <Zap className="w-4 h-4 fill-current text-white" />
                <span>Launch Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register"
                className="px-6 py-3.5 bg-slate-900/60 text-slate-200 border border-indigo-900/40 rounded-xl font-medium text-sm hover:bg-indigo-950/40 hover:text-white hover:border-indigo-600/40 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Create Cloud Session</span>
              </Link>
            </div>

            {/* Technical Verification Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-950/50 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">0ms</div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">Offline Native IPC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tracking-tight">5+ Lang</div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">Sandboxed Compiler</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-tight">v0.10.4</div>
                <div className="text-xs text-slate-400 mt-0.5 font-sans">Prime Agent RLM</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Cybernetic Workstation Preview */}
          <div className="lg:col-span-6">
            <div className="liquid-glass-elevated rounded-2xl overflow-hidden border border-indigo-500/20 shadow-2xl shadow-indigo-950/50">
              
              {/* Studio Window Bar */}
              <div className="h-10 bg-[#060a18] px-4 flex justify-between items-center border-b border-indigo-950/80 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-slate-400 ml-2 font-medium">synapse://runtime/session-desktop</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                  <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
                  <span>EMBEDDED 127.0.0.1</span>
                </div>
              </div>

              {/* Code Snippet Switcher Tabs */}
              <div className="flex border-b border-indigo-950/60 bg-[#050814] text-xs font-mono">
                <button
                  onClick={() => setActiveSnippet('prime')}
                  className={`px-4 py-2.5 flex items-center gap-2 border-r border-indigo-950/60 transition-colors ${
                    activeSnippet === 'prime'
                      ? 'bg-indigo-950/50 text-cyan-300 border-b-2 border-b-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>prime_healer.py</span>
                </button>
                <button
                  onClick={() => setActiveSnippet('compiler')}
                  className={`px-4 py-2.5 flex items-center gap-2 border-r border-indigo-950/60 transition-colors ${
                    activeSnippet === 'compiler'
                      ? 'bg-indigo-950/50 text-cyan-300 border-b-2 border-b-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>compiler_sandbox.ts</span>
                </button>
                <button
                  onClick={() => setActiveSnippet('mesh')}
                  className={`px-4 py-2.5 flex items-center gap-2 transition-colors ${
                    activeSnippet === 'mesh'
                      ? 'bg-indigo-950/50 text-cyan-300 border-b-2 border-b-cyan-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>host_telemetry.json</span>
                </button>
              </div>

              {/* Simulated Editor Surface */}
              <div className="p-5 font-mono text-xs leading-relaxed bg-[#030612] text-slate-300 overflow-x-auto min-h-[220px]">
                {activeSnippet === 'prime' && (
                  <div className="space-y-1">
                    <div><span className="text-indigo-400">import</span> rlm, continual_memory <span className="text-indigo-400">from</span> synapse.prime</div>
                    <div className="text-slate-500"># Autonomous self-healing diagnostic step</div>
                    <div><span className="text-cyan-400">async def</span> <span className="text-amber-300">execute_continual_loop</span>(task_id: str):</div>
                    <div className="pl-4">diagnostics = <span className="text-emerald-400">await</span> rlm.diagnose(task_id)</div>
                    <div className="pl-4">continual_memory.push_verified_lesson(diagnostics.lesson)</div>
                    <div className="pl-4 text-emerald-300 bg-emerald-950/30 border-l-2 border-emerald-400 py-0.5 px-2 rounded-r">
                      + return rlm.apply_patch(target=file_buffer, diff=diagnostics.diff)
                    </div>
                  </div>
                )}
                {activeSnippet === 'compiler' && (
                  <div className="space-y-1">
                    <div><span className="text-indigo-400">import</span> &#123; execFile &#125; <span className="text-indigo-400">from</span> <span className="text-emerald-300">&apos;child_process&apos;</span>;</div>
                    <div className="text-slate-500">// Multi-language isolated executor</div>
                    <div><span className="text-cyan-400">export const</span> <span className="text-amber-300">runSandbox</span> = <span className="text-indigo-400">async</span> (lang, code) =&gt; &#123;</div>
                    <div className="pl-4"><span className="text-indigo-400">const</span> runner = resolveCompiler(lang);</div>
                    <div className="pl-4"><span className="text-indigo-400">return await</span> runner.execute(&#123; code, timeoutMs: 5000 &#125;);</div>
                    <div>&#125;;</div>
                  </div>
                )}
                {activeSnippet === 'mesh' && (
                  <div className="space-y-1">
                    <div>&#123;</div>
                    <div className="pl-4">&quot;hostname&quot;: <span className="text-cyan-300">&quot;SYNAPSE-DESKTOP-STATION&quot;</span>,</div>
                    <div className="pl-4">&quot;cpuModel&quot;: <span className="text-cyan-300">&quot;AMD Ryzen / Intel Core i9&quot;</span>,</div>
                    <div className="pl-4">&quot;ports&quot;: &#123; <span className="text-emerald-300">&quot;5000&quot;: &quot;LISTEN&quot;</span>, <span className="text-emerald-300">&quot;3000&quot;: &quot;ACTIVE&quot;</span> &#125;,</div>
                    <div className="pl-4">&quot;prime_daemon&quot;: <span className="text-amber-300">true</span></div>
                    <div>&#125;</div>
                  </div>
                )}
              </div>

              {/* Simulated Terminal Status Footer */}
              <div className="bg-[#02040b] border-t border-indigo-950/80 px-4 py-3 flex justify-between items-center font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-400">Execution status:</span>
                  <span className="text-emerald-400 font-semibold">SUCCESS (14ms)</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>UTF-8</span>
                  <span>TypeScript</span>
                  <span className="text-indigo-400 font-bold">100% Offline IPC</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature Grid */}
        <section className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-bold">CORE CAPABILITIES</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
              Engineered with Extreme Precision
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Replacing fragmented developer tools with one cohesive, cybernetic workstation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="liquid-glass liquid-glass-interactive p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white font-sans">Yjs State Mesh</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Real-time peer-to-peer and cloud collaboration with conflict-free replicated data types and shared cursor telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-950/50 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Sub-millisecond</span>
                <span className="text-cyan-400">Live Sync</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="liquid-glass liquid-glass-interactive p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white font-sans">Multi-Lang Compiler</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Instant sandboxed code compilation for Python, JavaScript, TypeScript, C++, Rust, and Go with isolated process telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-950/50 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Zero Setup</span>
                <span className="text-cyan-400">Native Sandbox</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="liquid-glass liquid-glass-interactive p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white font-sans">Prime Agent RLM</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Recursive Language Model harness with self-healing code diffs, persistent Python REPL, and cross-session memory lessons.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-950/50 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Autonomous</span>
                <span className="text-emerald-400">Self-Heal</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="liquid-glass liquid-glass-interactive p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white font-sans">Host Telemetry</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Deep OS process monitoring, real-time CPU/RAM gauges, port connectivity scanner, and native process termination via IPC.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-indigo-950/50 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Real-Time</span>
                <span className="text-amber-400">Live Hardware</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-indigo-950/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-400 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>SYNAPSEGRID WORKSTATION • SECURED &amp; ENCRYPTED TERMINAL</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} SynapseGrid Core. Released under MIT.
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Cpu,
  Bot,
  Users,
  Play,
  Activity,
  ArrowRight,
  Code2,
  Radio,
  Zap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [activeSnippet, setActiveSnippet] = useState<'prime' | 'compiler' | 'mesh'>('prime');

  return (
    <div className="min-h-[100dvh] bg-[#0c0d0e] relative overflow-x-hidden flex flex-col justify-between text-zinc-100">
      
      {/* Top Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center border-b border-white/[0.07] backdrop-blur-md sticky top-0 z-50 bg-[#0c0d0e]/90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-amber-400">
            <Code2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-zinc-100 font-sans flex items-center gap-2">
              SYNAPSE<span className="text-amber-400 font-normal">GRID</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/60 font-medium">
                v1.2 RLM
              </span>
            </span>
          </div>
        </div>

        {/* Center Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-zinc-300 font-medium">PRIME RLM READY</span>
          </div>
          <span className="text-zinc-600">|</span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-zinc-400" />
            <span>LOCAL IPC ACTIVE</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-medium"
          >
            Log In
          </Link>
          <Link
            href="/editor/session-desktop"
            className="px-4 py-2 text-xs font-mono font-semibold text-black bg-amber-500 rounded-md hover:bg-amber-400 transition-all duration-200 active:scale-[0.98] flex items-center gap-2 shadow-sm"
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
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Cybernetic Development OS</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-100 leading-[1.12] font-sans">
                Engineered for speed. <br />
                <span className="text-amber-400">
                  Driven by Autonomous RLM.
                </span>
              </h1>
              <p className="text-base text-zinc-400 leading-relaxed max-w-xl font-normal">
                A stealth developer workstation with Monaco Editor, persistent Python REPL kernels, autonomous code self-healing, multi-language sandbox, and offline host telemetry.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/editor/session-desktop"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-md font-semibold text-sm transition-all shadow-sm active:scale-[0.98] flex items-center gap-2.5"
              >
                <Zap className="w-4 h-4 fill-current text-black" />
                <span>Launch Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register"
                className="px-5 py-3 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-md font-medium text-sm hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-zinc-400" />
                <span>Create Session</span>
              </Link>
            </div>

            {/* Technical Verification Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.07] text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 tracking-tight">0ms</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-sans">Offline Native IPC</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 tracking-tight">5+ Lang</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-sans">Sandboxed Compiler</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tracking-tight">v0.10.4</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-sans">Prime Agent RLM</div>
              </div>
            </div>
          </div>

          {/* Right Column: Workstation Preview */}
          <div className="lg:col-span-6">
            <div className="bg-[#121316] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl">
              
              {/* Studio Window Bar */}
              <div className="h-10 bg-[#15161a] px-4 flex justify-between items-center border-b border-white/[0.07] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
                  <span className="text-zinc-400 ml-2 font-medium">synapse://runtime/session-desktop</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 bg-zinc-800 border border-zinc-700/60 px-2 py-0.5 rounded">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  <span>EMBEDDED 127.0.0.1</span>
                </div>
              </div>

              {/* Code Snippet Switcher Tabs */}
              <div className="flex border-b border-white/[0.07] bg-[#141519] text-xs font-mono">
                <button
                  onClick={() => setActiveSnippet('prime')}
                  className={`px-4 py-2.5 flex items-center gap-2 border-r border-white/[0.07] transition-colors ${
                    activeSnippet === 'prime'
                      ? 'bg-[#121316] text-zinc-100 border-b-2 border-b-amber-400 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5 text-amber-400" />
                  <span>prime_healer.py</span>
                </button>
                <button
                  onClick={() => setActiveSnippet('compiler')}
                  className={`px-4 py-2.5 flex items-center gap-2 border-r border-white/[0.07] transition-colors ${
                    activeSnippet === 'compiler'
                      ? 'bg-[#121316] text-zinc-100 border-b-2 border-b-amber-400 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>compiler_sandbox.ts</span>
                </button>
                <button
                  onClick={() => setActiveSnippet('mesh')}
                  className={`px-4 py-2.5 flex items-center gap-2 transition-colors ${
                    activeSnippet === 'mesh'
                      ? 'bg-[#121316] text-zinc-100 border-b-2 border-b-amber-400 font-semibold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-zinc-400" />
                  <span>host_telemetry.json</span>
                </button>
              </div>

              {/* Simulated Editor Surface */}
              <div className="p-5 font-mono text-xs leading-relaxed bg-[#0c0d0e] text-zinc-300 overflow-x-auto min-h-[220px]">
                {activeSnippet === 'prime' && (
                  <div className="space-y-1">
                    <div><span className="text-amber-400">import</span> rlm, continual_memory <span className="text-amber-400">from</span> synapse.prime</div>
                    <div className="text-zinc-500"># Autonomous self-healing diagnostic step</div>
                    <div><span className="text-zinc-100">async def</span> <span className="text-amber-300">execute_continual_loop</span>(task_id: str):</div>
                    <div className="pl-4">diagnostics = <span className="text-emerald-400">await</span> rlm.diagnose(task_id)</div>
                    <div className="pl-4">continual_memory.push_verified_lesson(diagnostics.lesson)</div>
                    <div className="pl-4 text-emerald-300 bg-emerald-950/40 border-l-2 border-emerald-400 py-0.5 px-2 rounded-r">
                      + return rlm.apply_patch(target=file_buffer, diff=diagnostics.diff)
                    </div>
                  </div>
                )}
                {activeSnippet === 'compiler' && (
                  <div className="space-y-1">
                    <div><span className="text-amber-400">import</span> &#123; execFile &#125; <span className="text-amber-400">from</span> <span className="text-emerald-300">&apos;child_process&apos;</span>;</div>
                    <div className="text-zinc-500">// Multi-language isolated executor</div>
                    <div><span className="text-zinc-100">export const</span> <span className="text-amber-300">runSandbox</span> = <span className="text-amber-400">async</span> (lang, code) =&gt; &#123;</div>
                    <div className="pl-4"><span className="text-zinc-400">const</span> runner = resolveCompiler(lang);</div>
                    <div className="pl-4"><span className="text-zinc-400">return await</span> runner.execute(&#123; code, timeoutMs: 5000 &#125;);</div>
                    <div>&#125;;</div>
                  </div>
                )}
                {activeSnippet === 'mesh' && (
                  <div className="space-y-1">
                    <div>&#123;</div>
                    <div className="pl-4">&quot;hostname&quot;: <span className="text-zinc-200">&quot;SYNAPSE-DESKTOP-STATION&quot;</span>,</div>
                    <div className="pl-4">&quot;cpuModel&quot;: <span className="text-zinc-200">&quot;Host Architecture x64&quot;</span>,</div>
                    <div className="pl-4">&quot;ports&quot;: &#123; <span className="text-emerald-400">&quot;5000&quot;: &quot;LISTEN&quot;</span>, <span className="text-emerald-400">&quot;3000&quot;: &quot;ACTIVE&quot;</span> &#125;,</div>
                    <div className="pl-4">&quot;prime_daemon&quot;: <span className="text-amber-400">true</span></div>
                    <div>&#125;</div>
                  </div>
                )}
              </div>

              {/* Simulated Terminal Status Footer */}
              <div className="bg-[#121316] border-t border-white/[0.07] px-4 py-3 flex justify-between items-center font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-zinc-400">Execution status:</span>
                  <span className="text-emerald-400 font-semibold">SUCCESS (14ms)</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-500">
                  <span>UTF-8</span>
                  <span>TypeScript</span>
                  <span className="text-zinc-300 font-medium">100% Offline IPC</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Feature Grid */}
        <section className="mt-28">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-semibold">CORE CAPABILITIES</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100 font-sans">
              Engineered with Extreme Precision
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Replacing fragmented developer tools with one cohesive, stealth workstation.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#121316] border border-white/[0.07] p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-100 font-sans">State Mesh</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Real-time peer-to-peer and cloud collaboration with conflict-free replicated data types and shared cursor telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Sub-millisecond</span>
                <span className="text-zinc-200">Live Sync</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#121316] border border-white/[0.07] p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-100 font-sans">Multi-Lang Compiler</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Instant sandboxed code compilation for Python, JavaScript, TypeScript, C++, Rust, and Go with isolated process telemetry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Zero Setup</span>
                <span className="text-amber-400">Native Sandbox</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#121316] border border-white/[0.07] p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-100 font-sans">Prime Agent RLM</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Recursive Language Model harness with self-healing code diffs, persistent Python REPL, and cross-session memory lessons.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Autonomous</span>
                <span className="text-emerald-400">Self-Heal</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#121316] border border-white/[0.07] p-6 rounded-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-100 font-sans">Host Telemetry</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Deep OS process monitoring, real-time CPU/RAM gauges, port connectivity scanner, and native process termination via IPC.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Real-Time</span>
                <span className="text-zinc-200">Hardware Radar</span>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-white/[0.07] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-400 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>SYNAPSEGRID WORKSTATION • SECURED TERMINAL</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} SynapseGrid Core. Released under MIT.
        </div>
      </footer>
    </div>
  );
}

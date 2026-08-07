import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040711] relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background glow circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>

      {/* Navigation bar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-indigo-950/40 relative z-10">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-600/30">
            S
          </span>
          <span className="font-bold text-xl tracking-tight text-white font-sans">
            SYNAPSE<span className="text-indigo-400 font-light">GRID</span>
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-5 py-2 text-sm text-indigo-300 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 text-sm text-white bg-indigo-600 rounded-xl font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-16 md:py-24 relative z-10 flex-grow flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 rounded-full text-indigo-400 text-xs font-bold tracking-wider uppercase mb-6">
            ✨ Next-Gen Collaborative Dev Space
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Code Collaboratively. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-indigo-100 bg-clip-text text-transparent text-glow-blue">
              Compile Instantly.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            An advanced development workspace featuring a multi-language compiler, secure AI assistant, shared terminal control, and real-time collaboration.
          </p>

          <div className="flex gap-5 justify-center flex-wrap">
            <Link
              href="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 rounded-2xl font-semibold hover:bg-indigo-950/60 hover:text-white transition-all hover:scale-[1.02]"
            >
              Access Workspace
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mt-8">
          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-5 text-indigo-400">
              👥
            </div>
            <h3 className="font-bold text-lg text-white mb-3">Live Collaboration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Edit code simultaneously with teammates using YJS-based robust state sync.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-5 text-indigo-400">
              ⚙️
            </div>
            <h3 className="font-bold text-lg text-white mb-3">Instant Compiler</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compile and execute Python, JS, C++, Go, and Rust directly in your sandbox.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-5 text-indigo-400">
              🤖
            </div>
            <h3 className="font-bold text-lg text-white mb-3">AI Companion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Get intelligent security scans, code completions, and automated refactoring suggestions.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-2xl mb-5 text-indigo-400">
              🖥️
            </div>
            <h3 className="font-bold text-lg text-white mb-3">Terminal Control</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Monitor server telemetry, run scripts, and view operational container stats in real time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 text-center border-t border-indigo-950/40 text-slate-500 text-sm relative z-10">
        &copy; {new Date().getFullYear()} SynapseGrid. Secured and encrypted terminal operations.
      </footer>
    </div>
  );
}

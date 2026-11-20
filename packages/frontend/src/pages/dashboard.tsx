import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import {
  Code2,
  PlusCircle,
  Radio,
  Layers,
  ArrowUpRight,
  Zap,
  LogOut,
  Terminal,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface Session {
  id: string;
  name: string;
  description?: string;
  role: string;
  joinedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSessionName, setNewSessionName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchSessions();
  }, [isAuthenticated]);

  const fetchSessions = async () => {
    try {
      const response = await apiClient.get('/api/sessions');
      setSessions(response.data.sessions || []);
    } catch (err: any) {
      setError('Unable to reach central cloud mesh. Local desktop node is ready.');
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/sessions', {
        name: newSessionName,
      });

      setSessions([...sessions, response.data.session]);
      setNewSessionName('');
    } catch (err: any) {
      setError('Failed to create new session on mesh');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/api/sessions/join', {
        inviteCode: joinCode,
      });

      fetchSessions();
      setJoinCode('');
    } catch (err: any) {
      setError('Failed to join target session code');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[100dvh] bg-[#0c0d0e] relative overflow-x-hidden flex flex-col justify-between text-zinc-100">
      
      {/* Navigation */}
      <nav className="bg-[#121316] border-b border-white/[0.07] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-amber-400">
              <Code2 className="w-4 h-4 text-amber-400" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white font-sans flex items-center gap-1.5">
              SYNAPSE<span className="text-amber-400 font-normal">GRID</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-750 text-zinc-400">
                CONTROL CENTER
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/editor/session-desktop"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Workstation</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-zinc-300 font-mono">{user?.username}</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-rose-300 border border-rose-950/80 bg-rose-950/20 rounded-md hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 relative z-10 flex-grow">
        
        {/* Error notification banner */}
        {error && (
          <div className="p-4 mb-6 text-xs font-mono text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-md flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Launch Banner for Local Desktop IDE */}
        <div className="bg-[#121316] p-6 rounded-xl mb-8 border border-white/[0.08] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-amber-400 border border-zinc-700/60">
                LOCAL STANDALONE ENGINE
              </span>
              <span className="text-xs text-zinc-500 font-mono">Offline Native IPC Active</span>
            </div>
            <h2 className="text-lg font-semibold text-white font-sans">Cybernetic Desktop Workstation</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Open your local source folders, compile multi-language code, inspect hardware telemetry, and execute Prime Agent RLM healing loops.
            </p>
          </div>
          <Link
            href="/editor/session-desktop"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-md font-semibold text-xs uppercase tracking-wider font-mono transition-all flex items-center gap-2 active:scale-[0.98] flex-shrink-0"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Open Workstation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Session Management Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Create Session Card */}
          <div className="bg-[#121316] p-6 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-sans">Initialize Cloud Workspace</h3>
                <p className="text-xs text-zinc-500 font-sans">Create a new collaborative Yjs mesh node</p>
              </div>
            </div>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Session Name</label>
                <input
                  type="text"
                  placeholder="e.g. neuro-compiler-core"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-black bg-amber-500 hover:bg-amber-400 rounded-md font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Initializing Mesh...' : 'Create Mesh Session'}
              </button>
            </form>
          </div>

          {/* Join Session Card */}
          <div className="bg-[#121316] p-6 rounded-xl border border-white/[0.08]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-300">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-sans">Connect via Invite Token</h3>
                <p className="text-xs text-zinc-500 font-sans">Join an existing team development mesh</p>
              </div>
            </div>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">Invite Token / Code</label>
                <input
                  type="text"
                  placeholder="e.g. syn-83kx-2ldp"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/70 rounded-md font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Join Mesh Node'}
              </button>
            </form>
          </div>

        </div>

        {/* Sessions list board */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">Active Sandbox Sessions</h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">TOTAL: {sessions.length} NODES</span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center p-12 bg-[#121316] rounded-xl border border-white/[0.07]">
              <div className="w-10 h-10 mx-auto rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-400 mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-zinc-300 font-sans">No cloud mesh sessions active yet.</p>
              <p className="text-xs text-zinc-500 mt-1.5 font-mono max-w-md mx-auto">
                Create a session above or launch the standalone Workstation directly to start coding offline with Prime Agent.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/editor/${session.id}`}
                  className="bg-[#121316] p-5 rounded-xl block relative overflow-hidden group border border-white/[0.07] hover:border-zinc-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors font-sans truncate pr-2">
                      {session.name}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </div>
                  
                  <div className="flex gap-2 items-center mb-4">
                    <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-[10px] font-mono font-medium uppercase">
                      {session.role}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ID: {session.id.slice(0, 8)}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 border-t border-white/[0.05] pt-3 mt-2 flex items-center gap-1.5 font-mono">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span>Created {new Date(session.joinedAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-white/[0.07] flex justify-between items-center text-xs font-mono text-zinc-500">
        <span>SYNAPSEGRID CLOUD MESH</span>
        <span>STATUS: ONLINE</span>
      </footer>
    </div>
  );
}

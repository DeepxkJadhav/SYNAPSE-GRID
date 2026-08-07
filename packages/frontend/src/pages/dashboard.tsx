import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

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
      setSessions(response.data.sessions);
    } catch (err: any) {
      setError('Failed to fetch operational sessions');
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
      setError('Failed to create new session');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/sessions/join', {
        inviteCode: joinCode,
      });

      fetchSessions();
      setJoinCode('');
    } catch (err: any) {
      setError('Failed to join target session');
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
    <div className="min-h-screen bg-[#040711] relative overflow-hidden flex flex-col">
      {/* Decorative background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[130px] pointer-events-none"></div>

      {/* Glass Nav */}
      <nav className="bg-slate-950/40 border-b border-indigo-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              S
            </span>
            <span className="font-bold text-lg tracking-tight text-white">
              SYNAPSE<span className="text-indigo-400 font-light">GRID</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-300 tracking-wide font-sans">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 border border-rose-950/40 bg-rose-950/10 rounded-xl hover:bg-rose-950/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 relative z-10 flex-grow">
        
        {/* Error notification banner */}
        {error && (
          <div className="p-4 mb-6 text-sm text-rose-400 bg-rose-950/20 border border-rose-500/20 rounded-xl">
            ⚠️ ERROR: {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Create Session Card */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">🛠️</span>
              <h2 className="text-xl font-bold text-white">Initialize New Session</h2>
            </div>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Session Name</label>
                <input
                  type="text"
                  placeholder="e.g. backend-refactor-sprint"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-950/40 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950/30 transition-all font-sans text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Initializing...' : 'Create Workspace'}
              </button>
            </form>
          </div>

          {/* Join Session Card */}
          <div className="glass-card p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl">📡</span>
              <h2 className="text-xl font-bold text-white">Connect to Session</h2>
            </div>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Invite Token / Code</label>
                <input
                  type="text"
                  placeholder="e.g. x83k-2ldp-7whq"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-950/40 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950/30 transition-all font-sans text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg shadow-indigo-600/20"
              >
                {loading ? 'Connecting...' : 'Join Workspace'}
              </button>
            </form>
          </div>

        </div>

        {/* Sessions list board */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-300 font-sans">Active Sandbox Sessions</h2>
            <span className="text-xs text-slate-500 font-mono">TOTAL: {sessions.length} NODES</span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center p-12 glass-card rounded-2xl">
              <span className="text-4xl block mb-4">📭</span>
              <p className="text-slate-400">No active sandbox environments found.</p>
              <p className="text-xs text-slate-600 mt-2">Initialize or join a session using the forms above to start collaborating.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/editor/${session.id}`}
                  className="glass-card glass-card-hover p-6 rounded-2xl block relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/10 rounded-bl-3xl flex items-center justify-center text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </div>
                  
                  <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors mb-2">
                    {session.name}
                  </h3>
                  
                  <div className="flex gap-2 items-center mb-4">
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 text-xs font-semibold uppercase">
                      {session.role}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ID: {session.id.slice(0, 8)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 border-t border-indigo-950/40 pt-4 mt-2">
                    Joined: {new Date(session.joinedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

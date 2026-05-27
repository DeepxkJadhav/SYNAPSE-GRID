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
      setError('Failed to fetch sessions');
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
      setError('Failed to create session');
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
      setError('Failed to join session');
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Collab Dev</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="p-3 mb-4 text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create Session</h2>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <input
                type="text"
                placeholder="Session name"
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>

          {/* Join Session */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Join Session</h2>
            <form onSubmit={handleJoinSession} className="space-y-4">
              <input
                type="text"
                placeholder="Invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Joining...' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Sessions List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-600">No sessions yet</p>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/editor/${session.id}`}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold">{session.name}</h3>
                  <p className="text-sm text-gray-600">Role: {session.role}</p>
                  <p className="text-xs text-gray-500">
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

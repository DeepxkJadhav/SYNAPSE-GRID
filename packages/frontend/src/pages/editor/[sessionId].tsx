import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/lib/authStore';

export default function Editor() {
  const router = useRouter();
  const { sessionId } = router.query;
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (sessionId) {
      setLoading(false);
    }
  }, [isAuthenticated, sessionId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <header className="bg-gray-800 text-white p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Session: {sessionId}</h1>
      </header>

      <main className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Sidebar - File Tree */}
        <aside className="w-64 bg-gray-800 rounded border border-gray-700 p-4 text-white overflow-y-auto">
          <h2 className="font-bold mb-4">Files</h2>
          <p className="text-gray-400">File tree will be here</p>
        </aside>

        {/* Editor */}
        <section className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-800 rounded border border-gray-700">
            <div className="h-full text-white p-4">
              <p className="text-gray-400">Monaco editor will be here</p>
            </div>
          </div>

          {/* Terminal */}
          <div className="mt-4 h-48 bg-gray-800 rounded border border-gray-700 p-4 text-white overflow-y-auto">
            <p className="text-gray-400">Terminal will be here</p>
          </div>
        </section>

        {/* Right Sidebar - Presence */}
        <aside className="w-64 bg-gray-800 rounded border border-gray-700 p-4 text-white overflow-y-auto">
          <h2 className="font-bold mb-4">Users</h2>
          <p className="text-gray-400">Active users will be here</p>
        </aside>
      </main>
    </div>
  );
}

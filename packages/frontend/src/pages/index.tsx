import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-600 flex flex-col items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Collab Dev</h1>
        <p className="text-xl mb-8">Real-time collaborative development environment</p>
        
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

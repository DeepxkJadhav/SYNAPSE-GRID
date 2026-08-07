import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';

export default function Login() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', formData);
      const { user, tokens } = response.data;

      setUser(user);
      setTokens(tokens.accessToken, tokens.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#040711] relative overflow-hidden px-4">
      {/* Decorative background glow */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 glass-card rounded-2xl relative z-10">
        
        {/* Logo/Brand Icon */}
        <div className="flex flex-col items-center mb-8">
          <span className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-indigo-600/30 mb-4">
            S
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
            SYNAPSE<span className="text-indigo-400 font-light">GRID</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Authorized terminal credential gate</p>
        </div>
        
        {error && (
          <div className="p-4 mb-5 text-sm text-rose-400 bg-rose-950/20 border border-rose-500/20 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email address</label>
            <input
              type="email"
              name="email"
              placeholder="operator@synapsegrid.net"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-950/40 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950/30 transition-all font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Secure password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-950/50 border border-indigo-950/40 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-950/30 transition-all font-sans text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 text-white bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.01]"
          >
            {loading ? 'Decrypting Session...' : 'Authenticate'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400 text-center">
          First operations run?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Register terminal
          </Link>
        </p>
      </div>
    </div>
  );
}

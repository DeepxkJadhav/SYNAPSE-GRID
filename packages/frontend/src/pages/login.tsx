import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/lib/authStore';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  Zap,
  AlertCircle,
  Eye,
  EyeOff,
  Code2,
  KeyRound,
} from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#040711] cyber-grid relative overflow-hidden px-4">
      {/* Ambient Glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 liquid-glass-elevated rounded-2xl relative z-10 border border-indigo-500/20 shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 mb-4 border border-white/20">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
            SYNAPSE<span className="text-cyan-400 font-light">GRID</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
            Operator Credential Gate
          </p>
        </div>
        
        {error && (
          <div className="p-3.5 mb-5 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="operator@synapsegrid.net"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#02050f]/80 border border-indigo-950/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Secure Passkey
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-11 py-3 bg-[#02050f]/80 border border-indigo-950/80 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-xl font-semibold text-sm hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating Session...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Authenticate Credentials</span>
              </>
            )}
          </button>
        </form>

        {/* Local Workstation Bypass */}
        <div className="mt-6 pt-5 border-t border-indigo-950/60 text-center">
          <Link
            href="/editor/session-desktop"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/70 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-600/40 text-xs font-mono text-cyan-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Launch Local Workstation (Offline Bypass)</span>
            <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <p className="mt-5 text-xs text-slate-400 text-center font-sans">
          First deployment?{' '}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Register new operator
          </Link>
        </p>
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#0c0d0e] relative overflow-hidden px-4 text-zinc-100">
      <div className="w-full max-w-md p-8 bg-[#121316] rounded-xl relative z-10 border border-white/[0.08] shadow-2xl">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-amber-400 mb-3">
            <Code2 className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white font-sans flex items-center gap-1.5">
            SYNAPSE<span className="text-amber-400 font-normal">GRID</span>
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1 uppercase tracking-wider">
            Operator Credential Gate
          </p>
        </div>
        
        {error && (
          <div className="p-3.5 mb-5 text-xs text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-md flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="operator@synapsegrid.net"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Secure Passkey
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-11 py-2.5 bg-[#0e0f12] border border-zinc-800 rounded-md text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all font-sans text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-md font-semibold text-sm transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
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
        <div className="mt-6 pt-5 border-t border-white/[0.07] text-center">
          <Link
            href="/editor/session-desktop"
            className="w-full py-2.5 px-4 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Local Workstation (Offline Bypass)</span>
            <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <p className="mt-5 text-xs text-zinc-400 text-center font-sans">
          First deployment?{' '}
          <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Register new operator
          </Link>
        </p>
      </div>
    </div>
  );
}

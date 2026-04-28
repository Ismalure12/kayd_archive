'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@kayd.so');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.auth.login(email, password);
      if (res.data?.token) {
        localStorage.setItem('kayd_token', res.data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-6">
      <div className="w-[380px] bg-paper border border-ink p-12">
        {/* Wordmark */}
        <Link href="/" className="flex items-center justify-center gap-1.5 mb-8 no-underline">
          <span className="font-display text-[40px] tracking-[-0.03em] text-ink">
            K<em className="italic text-accent-ink">ay</em>d
          </span>
          <span
            className="inline-block w-[7px] h-[7px] rounded-full bg-accent"
            style={{ transform: 'translateY(-6px)' }}
          />
        </Link>

        <div className="mono text-center mb-8 text-[10px]">Admin Console</div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mono block mb-1 text-[10px]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-2.5 py-1.5 bg-paper border border-rule font-body text-[14px] text-ink outline-none focus:border-ink transition-colors"
            />
          </div>

          <div>
            <label className="mono block mb-1 text-[10px]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-2.5 py-1.5 bg-paper border border-rule font-body text-[14px] text-ink outline-none focus:border-ink transition-colors"
            />
          </div>

          {error && (
            <div className="mono text-[10px] py-2" style={{ color: 'oklch(0.52 0.18 25)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn w-full justify-center mt-2"
          >
            {loading ? 'Signing in…' : 'Sign in ⟶'}
          </button>
        </form>

        <div className="mono text-[10px] text-center mt-6 text-ink-3">
          Reader access requires no account.{' '}
          <Link href="/" className="text-accent-ink">Back to archive</Link>
        </div>
      </div>
    </div>
  );
}

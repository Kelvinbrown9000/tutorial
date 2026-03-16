'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { brand } from '@/content/site';

export default function SignInPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ identifier, password });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center gap-2 text-[#0d1f3c]">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M18 2L32 8L32 18C32 26 25 31 18 34C11 31 4 26 4 18L4 8Z" fill="#2a9a5c" />
                <polyline points="11,19 15,23 24,14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-bold text-xl tracking-tight">Guardian Trust</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-[#e4e4e7] p-8" style={{ boxShadow: '0 4px 24px 0 rgb(0 0 0 / 0.10)' }}>
          <h1 className="text-2xl font-bold text-[#0d1f3c] mb-1">Welcome back</h1>
          <p className="text-sm text-[#71717a] mb-7">Sign in to your account</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} aria-label="Sign in form">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-[#18181b] mb-1.5">
                Username or Member Number
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none transition-all"
                placeholder="Enter your username or member number"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#18181b] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#d4d4d8]" />
                <span className="text-[#52525b]">Remember me</span>
              </label>
              <a href="#" className="text-[#1a4688] hover:text-[#0d1f3c] transition-colors font-medium">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#e4e4e7] text-center">
            <p className="text-sm text-[#71717a]">
              Not a member yet?{' '}
              <Link href="/membership/join" className="text-[#1f7f4a] font-semibold hover:text-[#155533]">
                Join Today
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-[#a1a1aa] text-center mt-6">
          Protected by 256-bit encryption · {brand.name}
        </p>
      </div>
    </div>
  );
}

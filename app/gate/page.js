'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function drawCaptcha(canvas, code) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = '#1a6640';
  ctx.fillRect(0, 0, W, H);

  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.15 + 0.05})`;
    ctx.lineWidth = Math.random() * 1.5 + 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * W, Math.random() * H);
    ctx.bezierCurveTo(Math.random() * W, Math.random() * H, Math.random() * W, Math.random() * H, Math.random() * W, Math.random() * H);
    ctx.stroke();
  }

  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const fonts = ['serif', 'Georgia', 'Arial'];
  const startX = 18;
  const spacing = (W - startX * 2) / code.length;

  for (let i = 0; i < code.length; i++) {
    const x = startX + i * spacing + spacing / 2;
    const y = H / 2 + (Math.random() * 10 - 5);
    const angle = (Math.random() - 0.5) * 0.45;
    const size = Math.floor(Math.random() * 8 + 22);
    const font = fonts[Math.floor(Math.random() * fonts.length)];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px ${font}`;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2 + 0.8})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 3;
    ctx.fillText(code[i], 0, 0);
    ctx.restore();
  }
}

function GateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const refreshCaptcha = useCallback(() => {
    const code = generateCode();
    setCaptchaCode(code);
    setCaptchaInput('');
    setTimeout(() => drawCaptcha(canvasRef.current, code), 0);
  }, []);

  useEffect(() => { refreshCaptcha(); }, [refreshCaptcha]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setError('Incorrect code. Please try again.');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gate', { method: 'POST' });
      if (res.ok) {
        router.replace(from);
      } else {
        setError('Something went wrong. Please try again.');
        refreshCaptcha();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: 'Inter, Arial, sans-serif' }}>

      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 4px 32px 0 rgb(0 0 0 / 0.10)' }}>

        {/* Header */}
        <div className="bg-[#0d1f3c] px-8 py-8 flex flex-col items-center">
          <svg width="52" height="52" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <path d="M18 2L32 8L32 18C32 26 25 31 18 34C11 31 4 26 4 18L4 8Z" fill="#2a9a5c"/>
            <path d="M18 6L28 10L28 18C28 24 23 28 18 31C13 28 8 24 8 18L8 10Z" fill="white" opacity="0.08"/>
            <polyline points="11,19 15,23 24,14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="mt-3 text-center">
            <p className="text-white font-extrabold text-base tracking-widest uppercase leading-tight">Guardian Trust</p>
            <p className="text-[#93c5fd] text-xs tracking-widest uppercase mt-0.5">Demo Credit Union</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          <h1 className="text-2xl font-bold text-[#0d1f3c] mb-1">Welcome</h1>

          <div className="border-l-4 border-[#1a4688] pl-4 py-2 mb-5 bg-[#f0f7ff] rounded-r-xl">
            <p className="text-sm text-[#52525b] leading-relaxed">
              Please confirm you are not a robot by entering the auto-generated code below to access Guardian Trust online banking.
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAPTCHA */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <canvas
                  ref={canvasRef}
                  width={240}
                  height={60}
                  className="flex-1 rounded-lg"
                />
                <button type="button" onClick={refreshCaptcha} title="Refresh code"
                  className="p-2 rounded-lg border border-[#d4d4d8] text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#0d1f3c] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                maxLength={6}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm font-mono tracking-widest text-center focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none transition-all uppercase"
              />
            </div>

            <button type="submit" disabled={loading || captchaInput.length < 6}
              className="w-full py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying…
                </>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e4e4e7] px-8 py-4 text-center">
          <p className="text-[10px] text-[#a1a1aa] leading-relaxed">
            This is a demonstration project for educational purposes only.<br/>
            Not a real financial institution.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#a1a1aa] mt-6">
        © {new Date().getFullYear()} Guardian Trust Demo Credit Union
      </p>
    </div>
  );
}

export default function GatePage() {
  return (
    <Suspense>
      <GateForm />
    </Suspense>
  );
}

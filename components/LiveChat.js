'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const QUICK_REPLIES = [
  'How do I open an account?',
  'What are your current rates?',
  'How do I apply for a loan?',
  'What are your branch hours?',
];

function genSessionId() {
  return Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36);
}

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminOnline, setAdminOnline] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const [unread, setUnread] = useState(0);
  const lastPollRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const pollRef = useRef(null);

  // Init session
  useEffect(() => {
    let sid = sessionStorage.getItem('gt_chat_session');
    if (!sid) {
      sid = genSessionId();
      sessionStorage.setItem('gt_chat_session', sid);
    }
    setSessionId(sid);
  }, []);

  // Poll admin status before session starts (so button shows correct status)
  useEffect(() => {
    if (started) return; // once session is active, the session poll handles it
    function checkStatus() {
      fetch('/api/chat/status')
        .then((r) => r.json())
        .then((d) => setAdminOnline(!!d.adminOnline))
        .catch(() => {});
    }
    checkStatus();
    const t = setInterval(checkStatus, 15000);
    return () => clearInterval(t);
  }, [started]);

  // Start session when chat opens for first time
  useEffect(() => {
    if (!open || !sessionId || started) return;
    setStarted(true);
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        setAdminOnline(!!data.adminOnline);
        setMessages([
          {
            role: 'system',
            text: data.adminOnline
              ? "You're connected! A support agent is online and ready to help."
              : "Welcome to Guardian Trust support! Our team is currently offline, but leave a message and we'll get back to you — or call us at (800) 555-4827.",
          },
        ]);
      })
      .catch(() => {});
  }, [open, sessionId, started]);

  // Poll for new messages from admin
  const poll = useCallback(async () => {
    if (!sessionId || !started) return;
    try {
      const after = lastPollRef.current
        ? `?after=${encodeURIComponent(lastPollRef.current)}`
        : '';
      const res = await fetch(`/api/chat/${sessionId}${after}`);
      const data = await res.json();
      setAdminOnline(!!data.adminOnline);
      if (data.messages?.length) {
        lastPollRef.current = data.messages[data.messages.length - 1].createdAt;
        // Only add admin messages (customer messages are added optimistically)
        const adminMsgs = data.messages.filter((m) => m.role === 'admin');
        if (adminMsgs.length) {
          setMessages((prev) => {
            // Avoid duplicates
            const existingTexts = new Set(
              prev.filter((m) => m.role === 'admin').map((m) => m.text + m.createdAt)
            );
            const newMsgs = adminMsgs.filter(
              (m) => !existingTexts.has(m.text + m.createdAt)
            );
            if (!newMsgs.length) return prev;
            if (!open) setUnread((n) => n + newMsgs.length);
            return [...prev, ...newMsgs];
          });
        }
      }
    } catch {
      // silently ignore poll errors
    }
  }, [sessionId, started, open]);

  useEffect(() => {
    if (!started) return;
    pollRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollRef.current);
  }, [poll, started]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    const trimmed = (text || input).trim();
    if (!trimmed || sending || !sessionId) return;
    setInput('');

    const optimistic = { role: 'customer', text: trimmed, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);

    try {
      const res = await fetch(`/api/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json();
      setAdminOnline(!!data.adminOnline);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'admin', text: "Sorry, couldn't send your message. Please call (800) 555-4827.", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const showQuickReplies = messages.length <= 1 && !sending;

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[#e4e4e7] bg-white"
          style={{ width: 360, maxWidth: 'calc(100vw - 40px)', height: 520 }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-[#0d1f3c] shrink-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1a4688] flex items-center justify-center text-white font-bold text-sm select-none">GT</div>
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d1f3c] ${adminOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Guardian Trust Support</p>
              <p className={`text-xs ${adminOnline ? 'text-green-300' : 'text-[#93c5fd]'}`}>
                {adminOnline ? '● Agent Online' : '● Currently Offline'}
              </p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat"
              className="text-[#93c5fd] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8f9fc]">
            {messages.map((msg, i) => {
              if (msg.role === 'system') {
                return (
                  <div key={i} className="text-center">
                    <span className="text-xs text-[#71717a] bg-white border border-[#e4e4e7] px-3 py-1.5 rounded-full inline-block">
                      {msg.text}
                    </span>
                  </div>
                );
              }
              return (
                <div key={i} className={`flex items-end gap-2 ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'admin' && (
                    <div className="w-7 h-7 rounded-full bg-[#1a4688] flex items-center justify-center text-white text-[10px] font-bold shrink-0">GT</div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'customer'
                      ? 'bg-[#1a4688] text-white rounded-br-sm'
                      : 'bg-white text-[#18181b] rounded-bl-sm border border-[#e4e4e7]'
                  }`} style={{ boxShadow: '0 1px 4px 0 rgb(0 0 0 / 0.06)' }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Typing / sending indicator */}
            {sending && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1a4688] flex items-center justify-center text-white text-[10px] font-bold shrink-0">GT</div>
                <div className="bg-white border border-[#e4e4e7] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick replies */}
            {showQuickReplies && started && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#1a4688] text-[#1a4688] bg-white hover:bg-[#f0f7ff] transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-[#e4e4e7] px-3 py-3 flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={adminOnline ? 'Type your message…' : 'Leave a message…'}
              disabled={sending}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#d4d4d8] text-sm outline-none focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] disabled:opacity-60 bg-[#fafafa]"
            />
            <button onClick={() => send()} disabled={!input.trim() || sending} aria-label="Send"
              className="w-10 h-10 rounded-xl bg-[#1a4688] text-white flex items-center justify-center hover:bg-[#0d1f3c] disabled:opacity-40 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <div className="bg-white px-4 pb-3 text-center shrink-0">
            <p className="text-[10px] text-[#a1a1aa]">Guardian Trust FCU · <a href="/legal/privacy" className="underline hover:text-[#1a4688]">Privacy Policy</a></p>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open live chat'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-[#0d1f3c] text-white hover:bg-[#1a4688] transition-all duration-200 flex items-center justify-center"
        style={{ boxShadow: '0 4px 20px 0 rgb(13 31 60 / 0.35)' }}>
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
        {/* Admin online indicator on button */}
        {!open && adminOnline && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

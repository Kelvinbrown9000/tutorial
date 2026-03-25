'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';

const fmtTime = (d) =>
  new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AdminChatPage() {
  const [sessions, setSessions] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const bottomRef = useRef(null);
  const heartbeatRef = useRef(null);

  // Load sessions list
  const loadSessions = useCallback(async () => {
    try {
      const data = await api.get('/admin/chat');
      setSessions(data.sessions || []);
      setIsOnline(data.isOnline);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Load messages for selected session
  const loadMessages = useCallback(async () => {
    if (!selected) return;
    try {
      const data = await api.get(`/admin/chat/${selected.sessionId}`);
      setMessages(data.session?.messages || []);
    } catch (err) {
      console.error(err);
    }
  }, [selected]);

  // Initial load + poll sessions every 5s
  useEffect(() => {
    loadSessions();
    const t = setInterval(loadSessions, 5000);
    return () => clearInterval(t);
  }, [loadSessions]);

  // Poll messages for selected session every 3s
  useEffect(() => {
    if (!selected) return;
    loadMessages();
    const t = setInterval(loadMessages, 3000);
    return () => clearInterval(t);
  }, [selected, loadMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Heartbeat while online
  useEffect(() => {
    if (isOnline) {
      heartbeatRef.current = setInterval(() => {
        api.patch('/admin/chat', { action: 'heartbeat' }).catch(() => {});
      }, 30000);
    } else {
      clearInterval(heartbeatRef.current);
    }
    return () => clearInterval(heartbeatRef.current);
  }, [isOnline]);

  // Go offline on page unload
  useEffect(() => {
    const handler = () => api.patch('/admin/chat', { action: 'offline' }).catch(() => {});
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  async function toggleOnline() {
    setTogglingStatus(true);
    try {
      const action = isOnline ? 'offline' : 'online';
      await api.patch('/admin/chat', { action });
      setIsOnline(!isOnline);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingStatus(false);
    }
  }

  async function sendReply(e) {
    e?.preventDefault();
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    try {
      await api.post(`/admin/chat/${selected.sessionId}`, { text: reply.trim() });
      setReply('');
      loadMessages();
      loadSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function closeSession(sessionId) {
    try {
      await api.patch(`/admin/chat/${sessionId}`, {});
      if (selected?.sessionId === sessionId) setSelected(null);
      loadSessions();
    } catch (err) {
      console.error(err);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  }

  const waiting = sessions.filter((s) => s.status === 'waiting');
  const active = sessions.filter((s) => s.status === 'active');

  return (
    <div className="flex h-full gap-4 min-h-0" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Left panel — sessions list */}
      <div className="w-72 flex-shrink-0 flex flex-col bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
        {/* Online toggle */}
        <div className="px-4 py-3 border-b border-[#e4e4e7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}/>
            <span className="text-sm font-semibold text-[#0d1f3c]">
              {isOnline ? 'You are Online' : 'You are Offline'}
            </span>
          </div>
          <button
            onClick={toggleOnline}
            disabled={togglingStatus}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 ${
              isOnline
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}>
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Waiting */}
          {waiting.length > 0 && (
            <div>
              <p className="px-4 py-2 text-[10px] font-bold text-[#71717a] uppercase tracking-wider bg-[#fef9c3]">
                Waiting ({waiting.length})
              </p>
              {waiting.map((s) => (
                <SessionRow key={s.sessionId} session={s} selected={selected} onSelect={setSelected} onClose={closeSession} />
              ))}
            </div>
          )}

          {/* Active */}
          {active.length > 0 && (
            <div>
              <p className="px-4 py-2 text-[10px] font-bold text-[#71717a] uppercase tracking-wider bg-[#f0fdf4]">
                Active ({active.length})
              </p>
              {active.map((s) => (
                <SessionRow key={s.sessionId} session={s} selected={selected} onSelect={setSelected} onClose={closeSession} />
              ))}
            </div>
          )}

          {sessions.length === 0 && (
            <div className="py-16 text-center text-[#a1a1aa] text-sm px-4">
              No active chats
            </div>
          )}
        </div>
      </div>

      {/* Right panel — chat */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden min-w-0">
        {selected ? (
          <>
            {/* Header */}
            <div className="px-5 py-3 border-b border-[#e4e4e7] flex items-center justify-between bg-[#fafafa]">
              <div>
                <p className="text-sm font-semibold text-[#0d1f3c]">Session: <span className="font-mono text-xs text-[#71717a]">{selected.sessionId}</span></p>
                <p className="text-xs text-[#71717a]">Started {fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => closeSession(selected.sessionId)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors">
                Close Chat
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#f8f9fc]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.role === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'customer' && (
                    <div className="w-7 h-7 rounded-full bg-[#e4e4e7] flex items-center justify-center text-[#52525b] text-xs font-bold shrink-0">C</div>
                  )}
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'admin'
                      ? 'bg-[#0d1f3c] text-white rounded-br-sm'
                      : 'bg-white text-[#18181b] rounded-bl-sm border border-[#e4e4e7]'
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'admin' ? 'text-white/50' : 'text-[#a1a1aa]'}`}>
                      {msg.role === 'admin' ? 'You' : 'Customer'} · {fmtTime(msg.createdAt)}
                    </p>
                  </div>
                  {msg.role === 'admin' && (
                    <div className="w-7 h-7 rounded-full bg-[#1a4688] flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Reply input */}
            <form onSubmit={sendReply} className="border-t border-[#e4e4e7] px-4 py-3 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your reply…"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#d4d4d8] text-sm outline-none focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] bg-[#fafafa]"
              />
              <button type="submit" disabled={!reply.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-[#0d1f3c] text-white text-sm font-semibold hover:bg-[#1a4688] disabled:opacity-40 transition-colors">
                {sending ? '…' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#f0f7ff] flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#1a4688]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className="text-[#0d1f3c] font-semibold mb-1">Select a conversation</p>
            <p className="text-sm text-[#71717a]">Choose a session from the left to start replying</p>
            {!isOnline && (
              <div className="mt-5 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                You are offline. Go online to receive new chats.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionRow({ session, selected, onSelect, onClose }) {
  const lastMsg = session.messages?.[session.messages.length - 1];
  const isSelected = selected?.sessionId === session.sessionId;
  const unread = session.messages?.filter((m) => m.role === 'customer').length || 0;

  return (
    <button
      onClick={() => onSelect(session)}
      className={`w-full text-left px-4 py-3 border-b border-[#f4f4f5] transition-colors ${
        isSelected ? 'bg-[#f0f7ff]' : 'hover:bg-[#fafafa]'
      }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-[#71717a] truncate">{session.sessionId.slice(0, 18)}…</p>
          {lastMsg && (
            <p className="text-xs text-[#52525b] truncate mt-0.5">{lastMsg.text}</p>
          )}
          <p className="text-[10px] text-[#a1a1aa] mt-0.5">{fmtDate(session.updatedAt)}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            session.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
          }`}>
            {session.status}
          </span>
        </div>
      </div>
    </button>
  );
}

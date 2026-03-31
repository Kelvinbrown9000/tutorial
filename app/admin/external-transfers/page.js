'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_META = {
  pending:         { badge: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  approved:        { badge: 'bg-green-100 text-green-700',   label: 'Approved' },
  contact_support: { badge: 'bg-red-100 text-red-700',       label: 'Contact Support' },
};

function ActionModal({ transfer, onClose, onDone }) {
  const [action, setAction] = useState('approve');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (action === 'contact_support' && !adminNote.trim()) {
      setError('Please enter a note explaining what the customer needs to do.');
      return;
    }
    setLoading(true); setError('');
    try {
      const data = await api.patch(`/admin/external-transfers/${transfer._id}`, {
        action,
        adminNote: adminNote.trim() || undefined,
      });
      onDone(data.message);
    } catch (err) {
      setError(err.message || 'Failed to process');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0d1f3c]">Process Transfer</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Transfer summary */}
        <div className="bg-[#f4f4f5] rounded-xl p-4 text-sm space-y-1.5 mb-5">
          <div className="flex justify-between"><span className="text-[#71717a]">Reference</span><span className="font-mono text-xs font-semibold">{transfer.referenceId}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">Member</span><span className="font-medium">{transfer.userId?.firstName} {transfer.userId?.lastName}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">From Account</span><span className="font-mono text-xs">{transfer.fromAccountId?.accountNumber}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">Amount</span><span className="font-bold text-[#0d1f3c]">{fmt(transfer.amount)}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">To</span><span className="font-medium">{transfer.recipientName}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">Bank</span><span>{transfer.recipientBank || '—'}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">Routing #</span><span className="font-mono text-xs">{transfer.routingNumber}</span></div>
          <div className="flex justify-between"><span className="text-[#71717a]">Account #</span><span className="font-mono text-xs">{transfer.recipientAccountNumber}</span></div>
          {transfer.description && <div className="flex justify-between"><span className="text-[#71717a]">Note</span><span className="italic text-[#52525b]">{transfer.description}</span></div>}
        </div>

        {/* Action selector */}
        <div className="mb-4">
          <p className="text-sm font-medium text-[#18181b] mb-2">Action</p>
          <div className="flex rounded-xl border border-[#d4d4d8] overflow-hidden">
            <button type="button" onClick={() => { setAction('approve'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${action === 'approve' ? 'bg-green-600 text-white' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}>
              Approve & Process
            </button>
            <button type="button" onClick={() => { setAction('contact_support'); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${action === 'contact_support' ? 'bg-red-600 text-white' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}>
              Contact Support Required
            </button>
          </div>
        </div>

        {/* Admin note */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#18181b] mb-1.5">
            Admin Note {action === 'contact_support' && <span className="text-red-500">*</span>}
            {action === 'approve' && <span className="text-[#71717a] font-normal">(optional)</span>}
          </label>
          <textarea
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none resize-none"
            placeholder={action === 'contact_support'
              ? 'e.g. Please call (800) 555-4827 to verify this transfer before it can be processed.'
              : 'Internal note (optional)…'}
          />
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        {action === 'approve' && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs">
            This will immediately debit <strong>{fmt(transfer.amount)}</strong> from account <strong>{transfer.fromAccountId?.accountNumber}</strong>. This action cannot be undone.
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5]">Cancel</button>
          <button onClick={submit} disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-colors ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {loading ? 'Processing…' : action === 'approve' ? 'Approve & Process' : 'Require Support Contact'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminExternalTransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/external-transfers?status=${statusFilter}`);
      setTransfers(data.transfers || []);
      setPendingCount(data.pendingCount || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  function handleDone(msg) {
    setSelected(null);
    setToast(msg || 'Done');
    setTimeout(() => setToast(''), 3000);
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0d1f3c]">External Transfers</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-yellow-700 font-medium mt-0.5">{pendingCount} pending review</p>
          )}
        </div>
        {/* Status filter */}
        <div className="flex rounded-xl border border-[#d4d4d8] overflow-hidden">
          {[['pending','Pending'],['approved','Approved'],['contact_support','Contact Support'],['all','All']].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${statusFilter === val ? 'bg-[#0d1f3c] text-white' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1f3c] text-white text-sm px-5 py-3 rounded-xl shadow-lg">{toast}</div>
      )}

      <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">{[1,2,3].map((i) => <div key={i} className="h-14 bg-[#e4e4e7] rounded"/>)}</div>
        ) : transfers.length === 0 ? (
          <div className="py-20 text-center text-[#71717a] text-sm">No {statusFilter === 'all' ? '' : statusFilter} external transfers.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f4f4f5] bg-[#fafafa]">
                  {['Date','Reference','Member','Amount','Recipient','Bank','Routing','Status',''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5]">
                {transfers.map((t) => {
                  const s = STATUS_META[t.status] || STATUS_META.pending;
                  return (
                    <tr key={t._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3 text-xs text-[#71717a] whitespace-nowrap">{fmtDate(t.createdAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#52525b]">{t.referenceId}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0d1f3c] whitespace-nowrap">{t.userId?.firstName} {t.userId?.lastName}</p>
                        <p className="text-[10px] font-mono text-[#a1a1aa]">{t.userId?.memberNumber}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#0d1f3c] whitespace-nowrap">{fmt(t.amount)}</td>
                      <td className="px-4 py-3 text-[#52525b] whitespace-nowrap">{t.recipientName}</td>
                      <td className="px-4 py-3 text-xs text-[#71717a]">{t.recipientBank || '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#71717a]">{t.routingNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                        {t.adminNote && t.status === 'contact_support' && (
                          <p className="text-[10px] text-[#71717a] mt-1 max-w-[200px] truncate" title={t.adminNote}>{t.adminNote}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {t.status === 'pending' && (
                          <button onClick={() => setSelected(t)}
                            className="px-3 py-1.5 rounded-lg bg-[#1a4688] text-white text-xs font-semibold hover:bg-[#0d1f3c] whitespace-nowrap transition-colors">
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <ActionModal transfer={selected} onClose={() => setSelected(null)} onDone={handleDone} />
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const STATUS_STYLES = {
  pending:         { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Pending Review' },
  approved:        { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',   label: 'Approved' },
  contact_support: { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       label: 'Contact Support' },
};

export default function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState('');
  const [toType, setToType] = useState('internal');
  const [toId, setToId] = useState('');
  // External fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [externalHistory, setExternalHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    api.get('/accounts').then((d) => {
      setAccounts(d.accounts || []);
      if (d.accounts?.length) setFromId(d.accounts[0]._id);
    }).catch(console.error).finally(() => setLoadingAccounts(false));
  }, []);

  useEffect(() => {
    if (toType !== 'external') return;
    setHistoryLoading(true);
    api.get('/dashboard/external-transfers')
      .then((d) => setExternalHistory(d.transfers || []))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, [toType]);

  const fromAccount = accounts.find((a) => a._id === fromId);
  const internalTo = accounts.filter((a) => a._id !== fromId);

  function resetExternal() {
    setRecipientName(''); setRecipientBank(''); setRoutingNumber('');
    setRecipientAccountNumber(''); setAmount(''); setDescription('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError('Enter a valid amount'); return; }
    if (parsed > 25000) { setError('Maximum single transfer is $25,000'); return; }

    setLoading(true);
    try {
      if (toType === 'internal') {
        if (!toId) { setError('Select a destination account'); setLoading(false); return; }
        const data = await api.post('/transactions/transfer', {
          fromAccountId: fromId,
          toAccountId: toId,
          amount: parsed,
          description: description || undefined,
        });
        setSuccess({ type: 'internal', data });
      } else {
        if (!recipientName.trim()) { setError('Recipient name is required'); setLoading(false); return; }
        if (!/^\d{9}$/.test(routingNumber)) { setError('Routing number must be exactly 9 digits'); setLoading(false); return; }
        if (!recipientAccountNumber.trim()) { setError('Recipient account number is required'); setLoading(false); return; }
        const data = await api.post('/transactions/external-transfer', {
          fromAccountId: fromId,
          recipientName: recipientName.trim(),
          recipientBank: recipientBank.trim() || undefined,
          routingNumber,
          recipientAccountNumber: recipientAccountNumber.trim(),
          amount: parsed,
          description: description || undefined,
        });
        setSuccess({ type: 'external', data });
        resetExternal();
      }
      setAmount(''); setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white';

  if (loadingAccounts) {
    return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-16 bg-[#e4e4e7] rounded-2xl"/>)}</div>;
  }

  if (success?.type === 'internal') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 className="text-xl font-bold text-[#0d1f3c] mb-2">Transfer Successful</h3>
          <p className="text-[#71717a] text-sm mb-6">{success.data.message}</p>
          <div className="bg-[#f4f4f5] rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm"><span className="text-[#71717a]">Amount</span><span className="font-semibold">{fmt(success.data.transferOutTxn?.amount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#71717a]">Transaction ID</span><span className="font-mono text-xs text-[#52525b]">{success.data.transferOutTxn?.transactionId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#71717a]">New Balance</span><span className="font-semibold">{fmt(success.data.newBalance)}</span></div>
          </div>
          <button onClick={() => setSuccess(null)} className="w-full py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors">
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  if (success?.type === 'external') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#1a4688]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#0d1f3c] mb-2">Request Submitted</h3>
          <p className="text-[#71717a] text-sm mb-1">{success.data.message}</p>
          <div className="bg-[#f4f4f5] rounded-xl p-4 text-left space-y-2 my-6">
            <div className="flex justify-between text-sm"><span className="text-[#71717a]">Reference ID</span><span className="font-mono text-xs font-semibold text-[#0d1f3c]">{success.data.referenceId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-[#71717a]">Status</span><span className="font-semibold text-yellow-700">Pending Review</span></div>
          </div>
          <p className="text-xs text-[#71717a] mb-6">Your account will only be debited once the transfer is approved. You will be notified of any updates.</p>
          <button onClick={() => setSuccess(null)} className="w-full py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors">
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <h2 className="text-2xl font-bold text-[#0d1f3c]">Transfer Funds</h2>

      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6">
        {error && <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* From account */}
          <div>
            <label className="block text-sm font-medium text-[#18181b] mb-1.5">From Account</label>
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} required className={inputCls}>
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>{a.accountNumber} ({a.type}) — {fmt(a.balance)}</option>
              ))}
            </select>
            {fromAccount && <p className="mt-1 text-xs text-[#71717a]">Available: <strong>{fmt(fromAccount.balance)}</strong></p>}
          </div>

          {/* Transfer type */}
          <div>
            <p className="block text-sm font-medium text-[#18181b] mb-2">Transfer To</p>
            <div className="flex rounded-xl border border-[#d4d4d8] overflow-hidden">
              {[['internal', 'My Accounts'], ['external', 'External U.S. Bank']].map(([val, label]) => (
                <button key={val} type="button" onClick={() => { setToType(val); setError(''); }}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${toType === val ? 'bg-[#1a4688] text-white' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Internal: pick from own accounts */}
          {toType === 'internal' ? (
            <div>
              <label className="block text-sm font-medium text-[#18181b] mb-1.5">To Account</label>
              {internalTo.length === 0 ? (
                <p className="text-sm text-[#71717a]">No other accounts available.</p>
              ) : (
                <select value={toId} onChange={(e) => setToId(e.target.value)} required className={inputCls}>
                  <option value="">Select account…</option>
                  {internalTo.map((a) => (
                    <option key={a._id} value={a._id}>{a.accountNumber} ({a.type}) — {fmt(a.balance)}</option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            /* External: U.S. bank details */
            <div className="space-y-4">
              <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs leading-relaxed">
                External transfers are reviewed by our team and processed within <strong>1–2 business days</strong>. Your account is only debited upon approval.
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181b] mb-1.5">Recipient Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)}
                  className={inputCls} placeholder="e.g. Jane Smith" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181b] mb-1.5">Recipient Bank Name <span className="text-[#71717a] font-normal">(optional)</span></label>
                <input type="text" value={recipientBank} onChange={(e) => setRecipientBank(e.target.value)}
                  className={inputCls} placeholder="e.g. Chase Bank"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181b] mb-1.5">ABA Routing Number <span className="text-red-500">*</span></label>
                <input type="text" inputMode="numeric" maxLength={9} value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  className={`${inputCls} font-mono tracking-widest`} placeholder="9-digit routing number" required/>
                {routingNumber && routingNumber.length !== 9 && (
                  <p className="mt-1 text-xs text-red-600">Must be exactly 9 digits ({routingNumber.length}/9)</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#18181b] mb-1.5">Recipient Account Number <span className="text-red-500">*</span></label>
                <input type="text" inputMode="numeric" value={recipientAccountNumber}
                  onChange={(e) => setRecipientAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className={`${inputCls} font-mono tracking-widest`} placeholder="Recipient's account number" required/>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-[#18181b] mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-[#71717a] text-sm">$</span>
              <input type="number" min="0.01" step="0.01" max={fromAccount?.balance || undefined} value={amount}
                onChange={(e) => setAmount(e.target.value)} required
                className="w-full pl-7 pr-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
                placeholder="0.00"/>
            </div>
            <p className="mt-1 text-xs text-[#71717a]">Max single transfer: $25,000</p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-[#18181b] mb-1.5">Note <span className="text-[#71717a] font-normal">(optional)</span></label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200}
              className={inputCls} placeholder="e.g. Rent payment"/>
          </div>

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && fromAccount && (
            <div className="bg-[#f0f7ff] rounded-xl p-4 text-sm">
              <p className="font-medium text-[#0d1f3c] mb-2">Transfer Preview</p>
              <div className="space-y-1 text-[#52525b]">
                <div className="flex justify-between"><span>Amount</span><strong>{fmt(parseFloat(amount))}</strong></div>
                {toType === 'internal' && (
                  <div className="flex justify-between"><span>Balance after</span><strong>{fmt(fromAccount.balance - parseFloat(amount))}</strong></div>
                )}
                {toType === 'external' && (
                  <div className="flex justify-between"><span>Status after submit</span><strong className="text-yellow-700">Pending Review</strong></div>
                )}
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading
              ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</>
              : toType === 'external' ? 'Submit Transfer Request' : 'Transfer Funds'
            }
          </button>
        </form>
      </div>

      {/* External transfer history */}
      {toType === 'external' && (
        <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e4e4e7] bg-[#fafafa]">
            <p className="text-sm font-semibold text-[#0d1f3c]">Your External Transfer Requests</p>
          </div>
          {historyLoading ? (
            <div className="p-4 animate-pulse space-y-2">{[1,2].map((i) => <div key={i} className="h-12 bg-[#e4e4e7] rounded"/>)}</div>
          ) : externalHistory.length === 0 ? (
            <div className="py-10 text-center text-[#71717a] text-sm">No external transfer requests yet.</div>
          ) : (
            <div className="divide-y divide-[#f4f4f5]">
              {externalHistory.map((t) => {
                const s = STATUS_STYLES[t.status] || STATUS_STYLES.pending;
                return (
                  <div key={t._id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`}/>
                        <p className="text-sm font-medium text-[#0d1f3c] truncate">{t.recipientName}</p>
                      </div>
                      <p className="text-xs text-[#71717a]">{t.recipientBank ? `${t.recipientBank} · ` : ''}Routing: {t.routingNumber}</p>
                      <p className="text-xs font-mono text-[#a1a1aa] mt-0.5">{t.referenceId} · {fmtDate(t.createdAt)}</p>
                      {t.status === 'contact_support' && t.adminNote && (
                        <p className="mt-1.5 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{t.adminNote}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#0d1f3c]">{fmt(t.amount)}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${s.badge}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);

export default function TransferPage() {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState('');
  const [toType, setToType] = useState('internal'); // 'internal' | 'external'
  const [toId, setToId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    api.get('/accounts').then((d) => {
      setAccounts(d.accounts || []);
      if (d.accounts?.length) setFromId(d.accounts[0]._id);
    }).catch(console.error).finally(() => setLoadingAccounts(false));
  }, []);

  const fromAccount = accounts.find((a) => a._id === fromId);
  const internalTo = accounts.filter((a) => a._id !== fromId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError('Enter a valid amount'); return; }

    let resolvedToId = toId;
    if (toType === 'external') {
      // Look up by account number
      if (!toAccountNumber.trim()) { setError('Enter the destination account number'); return; }
      // We'll pass the account number as toAccountId — backend should support lookup
      // For now we send it as-is and let the backend find it
      // Actually, we need to look it up first — for simplicity, use the account number directly
      setError('External transfers require the recipient\'s account ID. Please contact support for external transfers.');
      return;
    }

    if (!resolvedToId) { setError('Select a destination account'); return; }

    setLoading(true);
    try {
      const data = await api.post('/transactions/transfer', {
        fromAccountId: fromId,
        toAccountId: resolvedToId,
        amount: parsed,
        description: description || undefined,
      });
      setSuccess(data);
      setAmount('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loadingAccounts) {
    return <div className="animate-pulse space-y-4">{[1,2,3].map((i) => <div key={i} className="h-16 bg-[#e4e4e7] rounded-2xl"/>)}</div>;
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 className="text-xl font-bold text-[#0d1f3c] mb-2">Transfer Successful</h3>
          <p className="text-[#71717a] text-sm mb-6">{success.message}</p>

          <div className="bg-[#f4f4f5] rounded-xl p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-[#71717a]">Amount</span>
              <span className="font-semibold text-[#0d1f3c]">{fmt(success.transferOutTxn?.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#71717a]">Transaction ID</span>
              <span className="font-mono text-xs text-[#52525b]">{success.transferOutTxn?.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#71717a]">New Balance</span>
              <span className="font-semibold text-[#0d1f3c]">{fmt(success.newBalance)}</span>
            </div>
          </div>

          <button onClick={() => setSuccess(null)}
            className="w-full py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors">
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
            <select value={fromId} onChange={(e) => setFromId(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white">
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>{a.accountNumber} ({a.type}) — {fmt(a.balance)}</option>
              ))}
            </select>
            {fromAccount && (
              <p className="mt-1 text-xs text-[#71717a]">Available: <strong>{fmt(fromAccount.balance)}</strong></p>
            )}
          </div>

          {/* Transfer type */}
          <div>
            <p className="block text-sm font-medium text-[#18181b] mb-2">Transfer To</p>
            <div className="flex rounded-xl border border-[#d4d4d8] overflow-hidden">
              {[['internal','My Accounts'],['external','Another Member']].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setToType(val)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${toType === val ? 'bg-[#1a4688] text-white' : 'text-[#52525b] hover:bg-[#f4f4f5]'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* To account */}
          {toType === 'internal' ? (
            <div>
              <label className="block text-sm font-medium text-[#18181b] mb-1.5">To Account</label>
              {internalTo.length === 0 ? (
                <p className="text-sm text-[#71717a]">No other accounts available.</p>
              ) : (
                <select value={toId} onChange={(e) => setToId(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white">
                  <option value="">Select account…</option>
                  {internalTo.map((a) => (
                    <option key={a._id} value={a._id}>{a.accountNumber} ({a.type}) — {fmt(a.balance)}</option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-[#18181b] mb-1.5">Destination Account Number</label>
              <input type="text" value={toAccountNumber} onChange={(e) => setToAccountNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
                placeholder="e.g. GTCHK12345678"/>
              <p className="mt-1 text-xs text-[#a1a1aa]">External transfers — contact support for assistance.</p>
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#18181b] mb-1.5">Note <span className="text-[#71717a] font-normal">(optional)</span></label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200}
              className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
              placeholder="e.g. Savings contribution"/>
          </div>

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && fromAccount && (
            <div className="bg-[#f0f7ff] rounded-xl p-4 text-sm">
              <p className="font-medium text-[#0d1f3c] mb-2">Transfer Preview</p>
              <div className="space-y-1 text-[#52525b]">
                <div className="flex justify-between"><span>Amount</span><strong>{fmt(parseFloat(amount))}</strong></div>
                <div className="flex justify-between"><span>Balance after</span><strong>{fmt(fromAccount.balance - parseFloat(amount))}</strong></div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</> : 'Transfer Funds'}
          </button>
        </form>
      </div>
    </div>
  );
}

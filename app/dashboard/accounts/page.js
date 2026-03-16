'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const TYPE_COLORS = { deposit: 'bg-green-100 text-green-700', withdrawal: 'bg-red-100 text-red-700', transfer_in: 'bg-blue-100 text-blue-700', transfer_out: 'bg-orange-100 text-orange-700', admin_credit: 'bg-purple-100 text-purple-700', admin_debit: 'bg-pink-100 text-pink-700' };
const TYPE_LABELS = { deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', admin_credit: 'Deposit', admin_debit: 'Admin Debit' };

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function WithdrawForm({ account, onSuccess, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError('Enter a valid amount'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.post('/transactions/withdraw', {
        accountId: account._id,
        amount: parsed,
        description: description || undefined,
      });
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
      <div>
        <p className="text-sm text-[#71717a] mb-3">
          Withdrawing from: <strong>{account.accountNumber}</strong>
          <span className="ml-2">· Available: <strong>{fmt(account.balance)}</strong></span>
        </p>
        <label className="block text-sm font-medium text-[#18181b] mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-[#71717a] text-sm">$</span>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
            className="w-full pl-7 pr-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
            placeholder="0.00"/>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#18181b] mb-1.5">Description <span className="text-[#71717a] font-normal">(optional)</span></label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200}
          className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
          placeholder="e.g. Rent payment"/>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5]">Cancel</button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors">
          {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Processing…</> : 'Withdraw Funds'}
        </button>
      </div>
    </form>
  );
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [txMap, setTxMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { account, type }
  const [toast, setToast] = useState('');

  const loadAccounts = useCallback(async () => {
    const data = await api.get('/accounts');
    setAccounts(data.accounts || []);
    return data.accounts || [];
  }, []);

  useEffect(() => {
    loadAccounts().then(async (accts) => {
      const entries = await Promise.all(
        accts.map(async (a) => {
          const data = await api.get(`/transactions/history?accountId=${a._id}&limit=5`);
          return [a._id, data.transactions || []];
        })
      );
      setTxMap(Object.fromEntries(entries));
    }).catch(console.error).finally(() => setLoading(false));
  }, [loadAccounts]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  async function handleSuccess(data) {
    setModal(null);
    showToast(data.message || 'Transaction successful');
    const accts = await loadAccounts();
    // refresh transactions
    const entries = await Promise.all(
      accts.map(async (a) => {
        const d = await api.get(`/transactions/history?accountId=${a._id}&limit=5`);
        return [a._id, d.transactions || []];
      })
    );
    setTxMap(Object.fromEntries(entries));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e4e4e7] p-6 animate-pulse space-y-3">
            <div className="h-4 bg-[#e4e4e7] rounded w-32"/>
            <div className="h-8 bg-[#e4e4e7] rounded w-48"/>
            <div className="h-3 bg-[#e4e4e7] rounded w-full"/>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#0d1f3c]">Your Accounts</h2>

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1f3c] text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {accounts.map((acct) => (
        <div key={acct._id} className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${acct.type === 'savings' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {acct.type === 'savings' ? 'Savings Account' : 'Checking Account'}
                  </span>
                  {acct.isActive && <span className="text-xs text-green-600 font-medium">Active</span>}
                </div>
                <p className="text-3xl font-bold text-[#0d1f3c] mt-1">{fmt(acct.balance)}</p>
                <p className="text-xs text-[#71717a] mt-0.5 font-mono">{acct.accountNumber}</p>
                {acct.nickname && <p className="text-xs text-[#71717a] mt-0.5 italic">&ldquo;{acct.nickname}&rdquo;</p>}
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/transactions?accountId=${acct._id}`}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium hover:bg-blue-100 transition-colors">
                  Transactions
                </Link>
                <button onClick={() => setModal(acct)}
                  className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium hover:bg-red-100 transition-colors">
                  − Withdraw
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#f4f4f5]">
              <div>
                <p className="text-xs text-[#71717a]">Available Balance</p>
                <p className="text-sm font-semibold text-[#18181b]">{fmt(acct.availableBalance)}</p>
              </div>
              <div>
                <p className="text-xs text-[#71717a]">Interest Rate</p>
                <p className="text-sm font-semibold text-[#18181b]">{acct.interestRate > 0 ? `${(acct.interestRate * 100).toFixed(2)}% APY` : 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-[#71717a]">Opened</p>
                <p className="text-sm font-semibold text-[#18181b]">{fmtDate(acct.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Recent transactions for this account */}
          <div className="border-t border-[#f4f4f5]">
            <div className="px-5 py-3 bg-[#fafafa]">
              <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wide">Recent Activity</p>
            </div>
            {(txMap[acct._id] || []).length === 0 ? (
              <p className="px-5 py-4 text-sm text-[#a1a1aa]">No transactions yet.</p>
            ) : (
              <div className="divide-y divide-[#f4f4f5]">
                {(txMap[acct._id] || []).map((tx) => (
                  <div key={tx._id} className="flex items-center gap-3 px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
                      {TYPE_LABELS[tx.type] || tx.type}
                    </span>
                    <span className="flex-1 text-sm text-[#52525b] truncate">{tx.description || '—'}</span>
                    <span className={`text-sm font-semibold whitespace-nowrap ${['deposit','transfer_in','admin_credit'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                      {['deposit','transfer_in','admin_credit'].includes(tx.type) ? '+' : '-'}{fmt(tx.amount)}
                    </span>
                    <span className="text-xs text-[#a1a1aa] whitespace-nowrap hidden sm:block">{fmtDate(tx.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {modal && (
        <Modal
          title={`Withdraw from ${modal.accountNumber}`}
          onClose={() => setModal(null)}
        >
          <WithdrawForm
            account={modal}
            onSuccess={handleSuccess}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}

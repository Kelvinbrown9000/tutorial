'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const TYPE_COLORS = { deposit: 'bg-green-100 text-green-700', withdrawal: 'bg-red-100 text-red-700', transfer_in: 'bg-blue-100 text-blue-700', transfer_out: 'bg-orange-100 text-orange-700', admin_credit: 'bg-purple-100 text-purple-700', admin_debit: 'bg-pink-100 text-pink-700' };
const TYPE_LABELS = { deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', admin_credit: 'Admin Credit', admin_debit: 'Admin Debit' };
const CREDIT_TYPES = new Set(['deposit', 'transfer_in', 'admin_credit']);

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ type: '', startDate: '', endDate: '', minAmount: '', maxAmount: '', status: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 25 });
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    try {
      const data = await api.get(`/admin/transactions?${params}`);
      setTransactions(data.transactions || []);
      setPagination(data.pagination || {});
      setStats(data.stats || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  function handleFilter(e) {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
    setPage(1);
  }

  const inputCls = 'px-3 py-2.5 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white';

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#0d1f3c]">All Transactions</h2>

      {/* Stats bar */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: fmt(stats.totalAmount) },
            { label: 'Deposits', value: fmt(stats.depositTotal), color: 'text-green-600' },
            { label: 'Withdrawals', value: fmt(stats.withdrawalTotal), color: 'text-red-600' },
            { label: 'Transfers', value: fmt(stats.transferTotal), color: 'text-blue-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#e4e4e7] px-4 py-3">
              <p className="text-xs text-[#71717a]">{s.label}</p>
              <p className={`text-lg font-bold ${s.color || 'text-[#0d1f3c]'}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <select name="type" value={filters.type} onChange={handleFilter} className={inputCls}>
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select name="status" value={filters.status} onChange={handleFilter} className={inputCls}>
            <option value="">All Statuses</option>
            {['pending','completed','failed','reversed'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilter} className={inputCls}/>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilter} className={inputCls}/>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#71717a]">$</span>
            <input type="number" name="minAmount" placeholder="Min" value={filters.minAmount} onChange={handleFilter} className={`${inputCls} pl-6`}/>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-[#71717a]">$</span>
            <input type="number" name="maxAmount" placeholder="Max" value={filters.maxAmount} onChange={handleFilter} className={`${inputCls} pl-6`}/>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
        <div className="px-5 py-3 bg-[#fafafa] border-b border-[#e4e4e7]">
          <p className="text-xs text-[#71717a]">{pagination.total?.toLocaleString()} transaction{pagination.total !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="p-6 animate-pulse space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-[#e4e4e7] rounded"/>)}</div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center text-[#71717a] text-sm">No transactions found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f4f4f5]">
                    {['Date','ID','User','Account','Type','Amount','Balance After','Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f5]">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-[#fafafa]">
                      <td className="px-4 py-3 text-xs text-[#71717a] whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#a1a1aa]">{tx.transactionId}</td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium text-[#0d1f3c]">{tx.userId?.firstName} {tx.userId?.lastName}</p>
                        <p className="text-[#a1a1aa] font-mono">{tx.userId?.memberNumber}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#71717a]">{tx.accountId?.accountNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
                          {TYPE_LABELS[tx.type] || tx.type}
                        </span>
                      </td>
                      <td className={`px-4 py-3 font-semibold whitespace-nowrap ${CREDIT_TYPES.has(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                        {CREDIT_TYPES.has(tx.type) ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-[#52525b] whitespace-nowrap">{tx.balanceAfter != null ? fmt(tx.balanceAfter) : '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : tx.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#f4f4f5]">
                <p className="text-xs text-[#71717a]">Page {pagination.page} of {pagination.pages}</p>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">Previous</button>
                  <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

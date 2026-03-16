'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const TYPE_COLORS = { deposit: 'bg-green-100 text-green-700', withdrawal: 'bg-red-100 text-red-700', transfer_in: 'bg-blue-100 text-blue-700', transfer_out: 'bg-orange-100 text-orange-700', admin_credit: 'bg-purple-100 text-purple-700', admin_debit: 'bg-pink-100 text-pink-700' };
const TYPE_LABELS = { deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', admin_credit: 'Deposit', admin_debit: 'Admin Debit' };
const CREDIT_TYPES = new Set(['deposit', 'transfer_in', 'admin_credit']);

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ accountId: searchParams.get('accountId') || '', type: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/accounts').then((d) => setAccounts(d.accounts || [])).catch(console.error);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (filters.accountId) params.set('accountId', filters.accountId);
    if (filters.type) params.set('type', filters.type);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    try {
      const data = await api.get(`/transactions/history?${params}`);
      setTransactions(data.transactions || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
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

  function exportCSV() {
    const header = 'Date,Type,Description,Amount,Balance After,Account\n';
    const rows = transactions.map((tx) =>
      [fmtDate(tx.createdAt), tx.type, `"${(tx.description || '').replace(/"/g,'""')}"`, tx.amount, tx.balanceAfter || '', tx.accountId?.accountNumber || ''].join(',')
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  const inputCls = 'px-3 py-2 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0d1f3c]">Transaction History</h2>
        <button onClick={exportCSV} className="px-4 py-2 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <select name="accountId" value={filters.accountId} onChange={handleFilter} className={inputCls}>
            <option value="">All Accounts</option>
            {accounts.map((a) => <option key={a._id} value={a._id}>{a.accountNumber} ({a.type})</option>)}
          </select>
          <select name="type" value={filters.type} onChange={handleFilter} className={inputCls}>
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilter} className={inputCls} placeholder="From"/>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilter} className={inputCls} placeholder="To"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
        <div className="px-5 py-3 bg-[#fafafa] border-b border-[#e4e4e7] flex items-center justify-between">
          <p className="text-xs text-[#71717a]">{pagination.total} transaction{pagination.total !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-4 bg-[#e4e4e7] rounded"/>)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#71717a] text-sm">No transactions found.</p>
            <p className="text-[#a1a1aa] text-xs mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f4f4f5]">
                    {['Date','Type','Description','Account','Amount','Balance After'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#71717a] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f4f5]">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-5 py-3.5 text-xs text-[#71717a] whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
                          {TYPE_LABELS[tx.type] || tx.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#52525b] max-w-[200px] truncate">{tx.description || '—'}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-[#71717a]">{tx.accountId?.accountNumber || '—'}</td>
                      <td className={`px-5 py-3.5 font-semibold whitespace-nowrap ${CREDIT_TYPES.has(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                        {CREDIT_TYPES.has(tx.type) ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                      <td className="px-5 py-3.5 text-[#52525b] whitespace-nowrap">{tx.balanceAfter != null ? fmt(tx.balanceAfter) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#f4f4f5]">
                <p className="text-xs text-[#71717a]">Page {pagination.page} of {pagination.pages}</p>
                <div className="flex gap-2">
                  <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">
                    Previous
                  </button>
                  <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const TYPE_LABELS = { deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', admin_credit: 'Deposit', admin_debit: 'Admin Debit' };
const TYPE_COLORS = { deposit: 'bg-green-100 text-green-700', withdrawal: 'bg-red-100 text-red-700', transfer_in: 'bg-blue-100 text-blue-700', transfer_out: 'bg-orange-100 text-orange-700', admin_credit: 'bg-purple-100 text-purple-700', admin_debit: 'bg-pink-100 text-pink-700' };

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-[#e4e4e7] rounded-lg ${className}`}/>;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/accounts'),
      api.get('/transactions/history?limit=6'),
    ]).then(([acctData, txData]) => {
      setAccounts(acctData.accounts || []);
      setTransactions(txData.transactions || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  // Build simple 7-day bar chart data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.toDateString(), total: 0 };
  });
  transactions.forEach((tx) => {
    const day = last7.find((d) => d.date === new Date(tx.createdAt).toDateString());
    if (day) day.total += tx.amount;
  });
  const maxBar = Math.max(...last7.map((d) => d.total), 1);

  const quickActions = [
    { label: 'Transactions', href: '/dashboard/transactions', icon: '☰', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Withdraw', href: '/dashboard/accounts', icon: '↑', color: 'bg-red-50 text-red-700 border-red-200' },
    { label: 'Transfer', href: '/dashboard/transfer', icon: '⇄', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Request Card', href: '/dashboard/cards', icon: '▣', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0d1f3c]">Good morning, {user?.firstName}</h2>
        <p className="text-[#71717a] text-sm mt-0.5">Here&apos;s your financial summary</p>
      </div>

      {/* Total balance banner */}
      <div className="bg-gradient-to-r from-[#0d1f3c] to-[#1a4688] rounded-2xl p-6 text-white">
        <p className="text-white/70 text-sm mb-1">Total Balance</p>
        {loading ? <Skeleton className="h-9 w-48 bg-white/20"/> : (
          <p className="text-3xl font-bold">{fmt(totalBalance)}</p>
        )}
        <p className="text-white/50 text-xs mt-2">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Accounts row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading ? [1,2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e4e4e7] p-5"><Skeleton className="h-4 w-24 mb-3"/><Skeleton className="h-7 w-32 mb-2"/><Skeleton className="h-3 w-40"/></div>
        )) : accounts.map((acct) => (
          <div key={acct._id} className="bg-white rounded-2xl border border-[#e4e4e7] p-5 hover:border-[#1a4688] transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${acct.type === 'savings' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {acct.type === 'savings' ? 'Savings' : 'Checking'}
              </span>
              <span className="text-xs text-[#71717a]">{acct.interestRate > 0 ? `${(acct.interestRate * 100).toFixed(2)}% APY` : ''}</span>
            </div>
            <p className="text-2xl font-bold text-[#0d1f3c]">{fmt(acct.balance)}</p>
            <p className="text-xs text-[#71717a] mt-1 font-mono">{acct.accountNumber}</p>
            {acct.nickname && <p className="text-xs text-[#71717a] mt-0.5 italic">{acct.nickname}</p>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border font-medium text-sm transition-transform hover:scale-105 ${action.color}`}>
            <span className="text-2xl">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
            <h3 className="font-semibold text-[#0d1f3c]">Recent Transactions</h3>
            <Link href="/dashboard/transactions" className="text-xs text-[#1a4688] font-medium hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-4">{[1,2,3].map((i) => <div key={i} className="flex gap-3"><Skeleton className="h-4 w-4/5"/></div>)}</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-[#71717a] text-sm">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-[#f4f4f5]">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
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

        {/* Spending chart */}
        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5">
          <h3 className="font-semibold text-[#0d1f3c] mb-4">7-Day Activity</h3>
          <div className="flex items-end gap-2 h-32">
            {last7.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-md bg-[#1a4688] transition-all"
                  style={{ height: `${Math.max(4, (day.total / maxBar) * 112)}px`, opacity: day.total > 0 ? 1 : 0.15 }}/>
                <span className="text-[10px] text-[#a1a1aa]">{day.label}</span>
              </div>
            ))}
          </div>
          {transactions.length === 0 && (
            <p className="text-xs text-[#a1a1aa] text-center mt-2">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

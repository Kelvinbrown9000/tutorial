'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const TYPE_COLORS = { deposit: 'bg-green-100 text-green-700', withdrawal: 'bg-red-100 text-red-700', transfer_in: 'bg-blue-100 text-blue-700', transfer_out: 'bg-orange-100 text-orange-700', admin_credit: 'bg-purple-100 text-purple-700', admin_debit: 'bg-pink-100 text-pink-700' };
const TYPE_LABELS = { deposit: 'Deposit', withdrawal: 'Withdrawal', transfer_in: 'Transfer In', transfer_out: 'Transfer Out', admin_credit: 'Admin Credit', admin_debit: 'Admin Debit' };

function StatCard({ label, value, sub, color = '#1a4688' }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5">
      <p className="text-xs text-[#71717a] font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-[#a1a1aa] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then((d) => setStats(d)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-24 bg-[#e4e4e7] rounded-2xl"/>)}
        </div>
        <div className="h-64 bg-[#e4e4e7] rounded-2xl"/>
      </div>
    );
  }

  const txByType = Object.fromEntries((stats?.transactionsByType || []).map((t) => [t._id, t]));
  const dailyTx = stats?.dailyTransactions || [];
  const maxDaily = Math.max(...dailyTx.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0d1f3c]">Admin Overview</h2>
        <p className="text-sm text-[#71717a] mt-0.5">Guardian Trust system dashboard</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers?.toLocaleString() || '0'} sub={`${stats?.activeUsers} active`}/>
        <StatCard label="Total Accounts" value={stats?.totalAccounts?.toLocaleString() || '0'}/>
        <StatCard label="Total Deposits" value={fmt(txByType.deposit?.totalAmount)} sub={`${txByType.deposit?.count || 0} txns`} color="#1f7f4a"/>
        <StatCard label="Pending Cards" value={stats?.pendingCardRequests || 0} color={stats?.pendingCardRequests > 0 ? '#d97706' : '#1a4688'}/>
        <StatCard label="System Balance" value={fmt(stats?.totalBalance)} sub="All accounts"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
            <h3 className="font-semibold text-[#0d1f3c]">Recent Transactions</h3>
            <Link href="/admin/transactions" className="text-xs text-[#1a4688] font-medium hover:underline">View all</Link>
          </div>
          {(stats?.recentTransactions || []).length === 0 ? (
            <div className="p-8 text-center text-[#71717a] text-sm">No transactions yet.</div>
          ) : (
            <div className="divide-y divide-[#f4f4f5]">
              {(stats?.recentTransactions || []).map((tx) => (
                <div key={tx._id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[tx.type] || 'bg-gray-100 text-gray-600'}`}>
                    {TYPE_LABELS[tx.type] || tx.type}
                  </span>
                  <span className="flex-1 min-w-0">
                    <p className="text-sm text-[#18181b] truncate">{tx.description || '—'}</p>
                    <p className="text-xs text-[#71717a]">{tx.userId?.firstName} {tx.userId?.lastName}</p>
                  </span>
                  <span className={`text-sm font-semibold whitespace-nowrap ${['deposit','transfer_in','admin_credit'].includes(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                    {fmt(tx.amount)}
                  </span>
                  <span className="text-xs text-[#a1a1aa] hidden sm:block whitespace-nowrap">{fmtDate(tx.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily transactions chart */}
        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-5">
          <h3 className="font-semibold text-[#0d1f3c] mb-4">Transactions — 7 Days</h3>
          {dailyTx.length === 0 ? (
            <p className="text-sm text-[#a1a1aa] text-center py-8">No data</p>
          ) : (
            <div className="flex items-end gap-2 h-36">
              {dailyTx.map((day) => (
                <div key={day._id} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-[9px] text-[#71717a] font-semibold">{day.count}</p>
                  <div className="w-full rounded-t-md bg-[#1a4688]"
                    style={{ height: `${Math.max(4, (day.count / maxDaily) * 108)}px` }}/>
                  <span className="text-[9px] text-[#a1a1aa]">{day._id?.slice(5)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Transaction type breakdown */}
          <div className="mt-5 pt-4 border-t border-[#f4f4f5] space-y-2">
            {(stats?.transactionsByType || []).map((t) => (
              <div key={t._id} className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[t._id] || 'bg-gray-100 text-gray-600'}`}>{TYPE_LABELS[t._id] || t._id}</span>
                <span className="text-[#52525b] font-medium">{t.count} · {fmt(t.totalAmount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/users', label: 'Manage Users', desc: 'View, edit, activate/deactivate members', color: 'bg-blue-50 border-blue-200' },
          { href: '/admin/transactions', label: 'All Transactions', desc: 'Monitor and audit all transactions', color: 'bg-green-50 border-green-200' },
          { href: '/admin/cards', label: `Card Requests${stats?.pendingCardRequests > 0 ? ` (${stats.pendingCardRequests})` : ''}`, desc: 'Approve, deny, or ship card requests', color: stats?.pendingCardRequests > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-purple-50 border-purple-200' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className={`${item.color} border rounded-2xl p-5 hover:shadow-sm transition-shadow`}>
            <p className="font-semibold text-[#0d1f3c] mb-1">{item.label}</p>
            <p className="text-xs text-[#71717a]">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

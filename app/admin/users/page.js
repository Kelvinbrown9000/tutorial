'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n ?? 0);
const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#e4e4e7]">
          <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function CreditDebitForm({ account, type, onSuccess, onClose }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) { setError('Enter a valid amount'); return; }
    if (!description.trim()) { setError('Description is required'); return; }
    setLoading(true); setError('');
    try {
      const data = await api.post(`/admin/accounts/${account._id}/${type}`, { amount: parsed, description });
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
      <p className="text-sm text-[#71717a]">
        Account: <strong className="font-mono">{account.accountNumber}</strong> · Balance: <strong>{fmt(account.balance)}</strong>
      </p>
      <div>
        <label className="block text-sm font-medium text-[#18181b] mb-1.5">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-3.5 text-[#71717a] text-sm">$</span>
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
            className="w-full pl-7 pr-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"/>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#18181b] mb-1.5">Reason / Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={500}
          className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none"
          placeholder="e.g. Error correction, bonus credit…"/>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5]">Cancel</button>
        <button type="submit" disabled={loading}
          className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 ${type === 'credit' ? 'bg-[#1f7f4a] hover:bg-[#155533]' : 'bg-red-600 hover:bg-red-700'}`}>
          {loading ? '…' : (type === 'credit' ? 'Credit Account' : 'Debit Account')}
        </button>
      </div>
    </form>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cdModal, setCdModal] = useState(null); // { account, type }
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    try {
      const data = await api.get(`/admin/users?${params}`);
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function openDetail(user) {
    setSelectedUser(user);
    setDetailLoading(true);
    try {
      const data = await api.get(`/admin/users/${user._id}`);
      setUserDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }

  async function toggleActive(user) {
    try {
      await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
      showToast(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      load();
      if (selectedUser?._id === user._id) {
        setSelectedUser((u) => ({ ...u, isActive: !u.isActive }));
      }
    } catch (err) {
      showToast(err.message);
    }
  }

  function handleCdSuccess(data) {
    setCdModal(null);
    showToast(data.message || 'Done');
    if (selectedUser) openDetail(selectedUser);
  }

  const inputCls = 'px-3 py-2.5 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#0d1f3c]">Users <span className="text-lg font-normal text-[#71717a]">({pagination.total})</span></h2>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1f3c] text-white text-sm px-5 py-3 rounded-xl shadow-lg">{toast}</div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder="Search name, email, member #…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className={`flex-1 min-w-48 ${inputCls}`}/>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className={inputCls}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden">
        {loading ? (
          <div className="p-6 animate-pulse space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-10 bg-[#e4e4e7] rounded"/>)}</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-[#71717a] text-sm">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f4f4f5] bg-[#fafafa]">
                  {['Member #','Name','Email','Accounts','Balance','Role','Status','Joined','Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5]">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#fafafa] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[#71717a]">{u.memberNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#0d1f3c] whitespace-nowrap">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-3 text-[#52525b] max-w-[160px] truncate">{u.email}</td>
                    <td className="px-4 py-3 text-center text-[#52525b]">{u.accountCount}</td>
                    <td className="px-4 py-3 font-semibold text-[#0d1f3c] whitespace-nowrap">{fmt(u.totalBalance)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#71717a] whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openDetail(u)}
                          className="px-3 py-1.5 rounded-lg bg-[#f0f7ff] text-[#1a4688] text-xs font-medium hover:bg-blue-100">
                          Details
                        </button>
                        <button onClick={() => toggleActive(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${u.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f4f4f5]">
            <p className="text-xs text-[#71717a]">Page {pagination.page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">Previous</button>
              <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-[#f4f4f5]">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <Modal title={`${selectedUser.firstName} ${selectedUser.lastName}`} onClose={() => { setSelectedUser(null); setUserDetail(null); }}>
          {detailLoading ? (
            <div className="animate-pulse space-y-3">{[1,2,3].map((i) => <div key={i} className="h-8 bg-[#e4e4e7] rounded"/>)}</div>
          ) : userDetail ? (
            <div className="space-y-5">
              {/* User info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Member #', userDetail.user.memberNumber],
                  ['Email', userDetail.user.email],
                  ['Role', userDetail.user.role],
                  ['Status', userDetail.user.isActive ? 'Active' : 'Inactive'],
                  ['Joined', fmtDate(userDetail.user.createdAt)],
                  ['Last Login', userDetail.user.lastLogin ? fmtDate(userDetail.user.lastLogin) : 'Never'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-[#71717a]">{label}</p>
                    <p className="font-medium text-[#0d1f3c] truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Accounts */}
              <div>
                <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Accounts</p>
                <div className="space-y-2">
                  {(userDetail.accounts || []).map((acct) => (
                    <div key={acct._id} className="flex items-center justify-between bg-[#f4f4f5] rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#0d1f3c] capitalize">{acct.type}</p>
                        <p className="text-xs font-mono text-[#71717a]">{acct.accountNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#0d1f3c]">{fmt(acct.balance)}</p>
                        <div className="flex gap-1 mt-1">
                          <button onClick={() => setCdModal({ account: acct, type: 'credit' })}
                            className="px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200">
                            Credit
                          </button>
                          <button onClick={() => setCdModal({ account: acct, type: 'debit' })}
                            className="px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200">
                            Debit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions */}
              {(userDetail.recentTransactions || []).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-2">Recent Transactions</p>
                  <div className="space-y-1">
                    {userDetail.recentTransactions.slice(0, 5).map((tx) => (
                      <div key={tx._id} className="flex items-center gap-2 text-xs px-3 py-2 bg-[#fafafa] rounded-lg">
                        <span className="text-[#71717a]">{fmtDate(tx.createdAt)}</span>
                        <span className="flex-1 text-[#52525b] truncate">{tx.description || tx.type}</span>
                        <span className={['deposit','transfer_in','admin_credit'].includes(tx.type) ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {fmt(tx.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => toggleActive(selectedUser)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${selectedUser.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'}`}>
                {selectedUser.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          ) : null}
        </Modal>
      )}

      {/* Credit/Debit modal */}
      {cdModal && (
        <Modal title={`${cdModal.type === 'credit' ? 'Credit' : 'Debit'} Account`} onClose={() => setCdModal(null)}>
          <CreditDebitForm account={cdModal.account} type={cdModal.type} onSuccess={handleCdSuccess} onClose={() => setCdModal(null)}/>
        </Modal>
      )}
    </div>
  );
}

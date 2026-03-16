'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-700', under_review: 'bg-blue-100 text-blue-700', approved: 'bg-green-100 text-green-700', denied: 'bg-red-100 text-red-700', shipped: 'bg-purple-100 text-purple-700' };
const STATUS_LABELS = { pending: 'Pending', under_review: 'Under Review', approved: 'Approved', denied: 'Denied', shipped: 'Shipped' };
const CARD_ICONS = { debit: '💳', credit: '🏦', prepaid: '💰' };

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0d1f3c]">{title}</h3>
          <button onClick={onClose} className="text-[#71717a] hover:text-[#18181b]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminCardsPage() {
  const [cardRequests, setCardRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [actionModal, setActionModal] = useState(null); // { req, action }
  const [adminNotes, setAdminNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    try {
      const data = await api.get(`/admin/cards?${params}`);
      setCardRequests(data.cardRequests || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function updateStatus(req, newStatus, notes) {
    setSubmitting(true);
    try {
      await api.patch(`/admin/cards/${req._id}`, { status: newStatus, adminNotes: notes || undefined });
      setCardRequests((prev) => prev.map((r) => r._id === req._id ? { ...r, status: newStatus, adminNotes: notes } : r));
      setActionModal(null);
      showToast(`Request ${STATUS_LABELS[newStatus]}`);
    } catch (err) {
      showToast(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const tabs = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Approved', value: 'approved' },
    { label: 'Denied', value: 'denied' },
    { label: 'Shipped', value: 'shipped' },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-[#0d1f3c]">Card Requests</h2>

      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#0d1f3c] text-white text-sm px-5 py-3 rounded-xl shadow-lg">{toast}</div>
      )}

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === tab.value ? 'bg-[#1a4688] text-white' : 'bg-white border border-[#d4d4d8] text-[#52525b] hover:bg-[#f4f4f5]'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          {[1,2,3,4].map((i) => <div key={i} className="h-40 bg-[#e4e4e7] rounded-2xl"/>)}
        </div>
      ) : cardRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e4e4e7] py-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-[#71717a] font-medium">No card requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cardRequests.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl border border-[#e4e4e7] p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{CARD_ICONS[req.cardType] || '💳'}</span>
                  <div>
                    <p className="font-semibold text-[#0d1f3c] capitalize">{req.cardType} Card</p>
                    <p className="text-xs text-[#71717a]">{req.userId?.firstName} {req.userId?.lastName} · {req.userId?.memberNumber}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[req.status]}`}>
                  {STATUS_LABELS[req.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#71717a] mb-4">
                <div><span className="font-medium">Account: </span><span className="font-mono">{req.accountId?.accountNumber}</span></div>
                <div><span className="font-medium">Type: </span><span className="capitalize">{req.accountId?.type}</span></div>
                <div><span className="font-medium">Requested: </span>{fmtDate(req.requestedAt)}</div>
                {req.deliveryAddress?.city && <div><span className="font-medium">Ship to: </span>{req.deliveryAddress.city}, {req.deliveryAddress.state}</div>}
              </div>

              {req.adminNotes && (
                <div className="mb-3 px-3 py-2 bg-[#f4f4f5] rounded-lg text-xs text-[#52525b]">
                  <strong>Admin note:</strong> {req.adminNotes}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {req.status === 'pending' && (
                  <>
                    <button onClick={() => { setActionModal({ req, action: 'under_review' }); setAdminNotes(''); }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100">
                      Set Under Review
                    </button>
                    <button onClick={() => { setActionModal({ req, action: 'approved' }); setAdminNotes(''); }}
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100">
                      Approve
                    </button>
                    <button onClick={() => { setActionModal({ req, action: 'denied' }); setAdminNotes(''); }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100">
                      Deny
                    </button>
                  </>
                )}
                {req.status === 'under_review' && (
                  <>
                    <button onClick={() => { setActionModal({ req, action: 'approved' }); setAdminNotes(''); }}
                      className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100">
                      Approve
                    </button>
                    <button onClick={() => { setActionModal({ req, action: 'denied' }); setAdminNotes(''); }}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100">
                      Deny
                    </button>
                  </>
                )}
                {req.status === 'approved' && (
                  <button onClick={() => updateStatus(req, 'shipped', req.adminNotes)}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100">
                    Mark Shipped
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#71717a]">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-white">Previous</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-[#d4d4d8] text-sm disabled:opacity-40 hover:bg-white">Next</button>
          </div>
        </div>
      )}

      {/* Approve/deny confirmation modal */}
      {actionModal && (
        <Modal title={`${STATUS_LABELS[actionModal.action]} Request`} onClose={() => setActionModal(null)}>
          <div className="space-y-4">
            <p className="text-sm text-[#52525b]">
              You are about to mark this <strong>{actionModal.req.cardType}</strong> card request as <strong className={STATUS_COLORS[actionModal.action]?.replace('bg-', 'text-').replace(' text-', ' ') || ''}>{STATUS_LABELS[actionModal.action]}</strong> for <strong>{actionModal.req.userId?.firstName} {actionModal.req.userId?.lastName}</strong>.
            </p>
            <div>
              <label className="block text-sm font-medium text-[#18181b] mb-1.5">Admin Notes <span className="text-[#71717a] font-normal">(optional)</span></label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} rows={3} maxLength={1000}
                className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none resize-none"
                placeholder="Reason, instructions, or comments…"/>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="px-5 py-2.5 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5]">Cancel</button>
              <button disabled={submitting} onClick={() => updateStatus(actionModal.req, actionModal.action, adminNotes)}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center transition-colors ${actionModal.action === 'denied' ? 'bg-red-600 hover:bg-red-700' : actionModal.action === 'approved' ? 'bg-[#1f7f4a] hover:bg-[#155533]' : 'bg-[#1a4688] hover:bg-[#0d1f3c]'}`}>
                {submitting ? '…' : `Confirm ${STATUS_LABELS[actionModal.action]}`}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

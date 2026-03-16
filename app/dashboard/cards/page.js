'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const STATUS_STEPS = ['pending', 'under_review', 'approved', 'shipped'];

const STATUS_META = {
  pending:      { label: 'Pending',      bg: 'bg-amber-50',   text: 'text-amber-600',  border: 'border-amber-200',  dot: 'bg-amber-400' },
  under_review: { label: 'Under Review', bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  approved:     { label: 'Approved',     bg: 'bg-emerald-50', text: 'text-emerald-600',border: 'border-emerald-200',dot: 'bg-emerald-500' },
  denied:       { label: 'Denied',       bg: 'bg-red-50',     text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-500' },
  shipped:      { label: 'Shipped',      bg: 'bg-purple-50',  text: 'text-purple-600', border: 'border-purple-200', dot: 'bg-purple-500' },
};

const CARD_TYPE_META = {
  debit:   { label: 'Debit Card',   gradient: 'from-[#0d1f3c] to-[#1a4688]', chip: '#f0c040' },
  credit:  { label: 'Credit Card',  gradient: 'from-[#1a1a2e] to-[#16213e]', chip: '#c0c0c0' },
  prepaid: { label: 'Prepaid Card', gradient: 'from-[#134e4a] to-[#0f766e]', chip: '#f0c040' },
};

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const STEP_LABELS = { pending: 'Submitted', under_review: 'In Review', approved: 'Approved', shipped: 'Shipped' };

function CardVisual({ cardType, accountNumber, size = 'md' }) {
  const meta = CARD_TYPE_META[cardType] || CARD_TYPE_META.debit;
  const masked = accountNumber ? `•••• ${accountNumber.slice(-4)}` : '•••• ••••';
  const isLg = size === 'lg';
  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-br ${meta.gradient} overflow-hidden select-none shadow-lg`}
      style={{ aspectRatio: '1.586 / 1', padding: isLg ? '20px' : '14px' }}>

      {/* Glare */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"/>
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5"/>
      <div className="absolute -bottom-8 -left-4 w-36 h-36 rounded-full bg-white/5"/>

      {/* Network logo */}
      <div className="absolute top-3 right-3 flex items-center">
        <div className={`rounded-full bg-red-500/80 ${isLg ? 'w-6 h-6' : 'w-5 h-5'}`}/>
        <div className={`rounded-full bg-yellow-400/80 -ml-2.5 ${isLg ? 'w-6 h-6' : 'w-5 h-5'}`}/>
      </div>

      {/* Layout: chip + number + bottom — use flex column filling height */}
      <div className="relative h-full flex flex-col justify-between">
        {/* Chip */}
        <div className={`grid grid-cols-3 gap-px rounded-md border border-yellow-300/40 ${isLg ? 'w-9 h-6' : 'w-7 h-5'}`}
          style={{ padding: '2px', background: meta.chip + '33' }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-sm" style={{ background: meta.chip + '66' }}/>
          ))}
        </div>

        {/* Card number */}
        <p className={`text-white/90 font-mono tracking-widest ${isLg ? 'text-sm' : 'text-xs'}`}>{masked}</p>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/40 uppercase tracking-wider font-medium" style={{ fontSize: '8px' }}>Card Type</p>
            <p className={`text-white font-semibold capitalize leading-tight ${isLg ? 'text-xs' : 'text-[11px]'}`}>{meta.label}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 uppercase tracking-wider font-medium" style={{ fontSize: '8px' }}>Guardian Trust</p>
            <p className={`text-white/70 font-mono leading-tight ${isLg ? 'text-xs' : 'text-[11px]'}`}>FCU</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`}/>
      {m.label}
    </span>
  );
}

function ProgressTracker({ status }) {
  const stepIdx = STATUS_STEPS.indexOf(status);
  if (status === 'denied' || stepIdx < 0) return null;
  return (
    <div className="mt-5">
      <div className="relative flex items-center justify-between">
        {/* Track line */}
        <div className="absolute left-0 right-0 top-3 h-0.5 bg-[#e4e4e7] -z-0"/>
        <div
          className="absolute left-0 top-3 h-0.5 bg-[#1a4688] transition-all duration-500 -z-0"
          style={{ width: `${(stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />
        {STATUS_STEPS.map((step, i) => {
          const done = i <= stepIdx;
          return (
            <div key={step} className="flex flex-col items-center gap-1.5 z-10">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-[#1a4688] border-[#1a4688]' : 'bg-white border-[#d4d4d8]'}`}>
                {done ? (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4d4d8]"/>
                )}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${done ? 'text-[#1a4688]' : 'text-[#a1a1aa]'}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CardsPage() {
  const [cardRequests, setCardRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ accountId: '', cardType: 'debit', street: '', city: '', state: '', zip: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([api.get('/cards'), api.get('/accounts')]).then(([c, a]) => {
      setCardRequests(c.cardRequests || []);
      setAccounts(a.accounts || []);
      if (a.accounts?.length) setForm((f) => ({ ...f, accountId: a.accounts[0]._id }));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.accountId) { setError('Select an account'); return; }
    setError(''); setSubmitting(true);
    try {
      const payload = { accountId: form.accountId, cardType: form.cardType };
      if (form.street && form.city && form.state && form.zip) {
        payload.deliveryAddress = { street: form.street, city: form.city, state: form.state, zip: form.zip };
      }
      const data = await api.post('/cards', payload);
      setCardRequests((prev) => [data.cardRequest, ...prev]);
      setShowForm(false);
      setForm((f) => ({ ...f, street: '', city: '', state: '', zip: '', cardType: 'debit' }));
      showToast('Card request submitted successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none bg-white transition-all';

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-[#0d1f3c] text-white text-sm px-5 py-3 rounded-2xl shadow-2xl">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0d1f3c]">My Cards</h2>
          <p className="text-sm text-[#71717a] mt-0.5">Manage and track your card requests</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(''); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Request Card
        </button>
      </div>

      {/* Request form */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-[#e4e4e7] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-[#f4f4f5] bg-[#fafafa]">
            <h3 className="font-bold text-[#0d1f3c]">New Card Request</h3>
            <p className="text-xs text-[#71717a] mt-0.5">Choose your card type and linked account</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card type selector */}
              <div>
                <p className="text-sm font-semibold text-[#0d1f3c] mb-3">Select Card Type</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'debit',   label: 'Debit',   desc: 'Linked to your account', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/> },
                    { val: 'credit',  label: 'Credit',  desc: 'Buy now, pay later', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/> },
                    { val: 'prepaid', label: 'Prepaid', desc: 'Load and spend', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"/> },
                  ].map(({ val, label, desc, icon }) => (
                    <button key={val} type="button" onClick={() => setForm((f) => ({ ...f, cardType: val }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all ${form.cardType === val ? 'border-[#1a4688] bg-[#f0f7ff]' : 'border-[#e4e4e7] bg-white hover:border-[#d4d4d8] hover:bg-[#fafafa]'}`}>
                      <svg className={`w-6 h-6 ${form.cardType === val ? 'text-[#1a4688]' : 'text-[#71717a]'}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        {icon}
                      </svg>
                      <span className={`text-sm font-semibold ${form.cardType === val ? 'text-[#1a4688]' : 'text-[#18181b]'}`}>{label}</span>
                      <span className="text-[10px] text-[#a1a1aa] leading-tight">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card preview */}
              <div className="max-w-[260px] mx-auto">
                <CardVisual
                  cardType={form.cardType}
                  accountNumber={accounts.find((a) => a._id === form.accountId)?.accountNumber}
                  size="lg"
                />
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-semibold text-[#0d1f3c] mb-2">Link to Account</label>
                <select value={form.accountId} onChange={(e) => setForm((f) => ({ ...f, accountId: e.target.value }))} required className={inputCls}>
                  {accounts.map((a) => (
                    <option key={a._id} value={a._id}>{a.accountNumber} — {a.type.charAt(0).toUpperCase() + a.type.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Delivery address */}
              <div>
                <p className="text-sm font-semibold text-[#0d1f3c] mb-1">Delivery Address <span className="font-normal text-[#71717a]">(optional)</span></p>
                <p className="text-xs text-[#a1a1aa] mb-3">Leave blank to use your address on file.</p>
                <div className="space-y-3">
                  <input type="text" placeholder="Street Address" value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className={inputCls}/>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className={`${inputCls} col-span-1`}/>
                    <input type="text" placeholder="ST" maxLength={2} value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value.toUpperCase() }))} className={`${inputCls} text-center uppercase`}/>
                    <input type="text" placeholder="ZIP" maxLength={10} value={form.zip} onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))} className={inputCls}/>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm">
                  {submitting ? (
                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting…</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Submit Request</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-[#e4e4e7] p-6 space-y-4">
              <div className="aspect-[1.586/1] w-48 bg-[#e4e4e7] rounded-2xl"/>
              <div className="h-4 bg-[#e4e4e7] rounded w-40"/>
              <div className="h-3 bg-[#e4e4e7] rounded w-full"/>
            </div>
          ))}
        </div>
      ) : cardRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e4e4e7] py-20 text-center">
          <div className="w-20 h-20 bg-[#f0f7ff] rounded-3xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-10 h-10 text-[#1a4688]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
            </svg>
          </div>
          <p className="text-[#0d1f3c] font-semibold text-lg">No cards yet</p>
          <p className="text-[#71717a] text-sm mt-1 mb-6">Request your first Guardian Trust card to get started.</p>
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Request Your First Card
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {cardRequests.map((req) => {
            const cardMeta = CARD_TYPE_META[req.cardType] || CARD_TYPE_META.debit;
            return (
              <div key={req._id} className="bg-white rounded-3xl border border-[#e4e4e7] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row gap-6">

                    {/* Card visual */}
                    <div className="w-full sm:w-44 flex-shrink-0">
                      <CardVisual cardType={req.cardType} accountNumber={req.accountId?.accountNumber}/>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#0d1f3c]">{cardMeta.label}</h3>
                          <p className="text-xs text-[#71717a] font-mono mt-0.5">{req.accountId?.accountNumber} · {req.accountId?.type}</p>
                        </div>
                        <StatusBadge status={req.status}/>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
                        <div>
                          <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-medium mb-0.5">Requested</p>
                          <p className="font-semibold text-[#18181b]">{fmtDate(req.requestedAt)}</p>
                        </div>
                        {req.reviewedAt && (
                          <div>
                            <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-medium mb-0.5">Reviewed</p>
                            <p className="font-semibold text-[#18181b]">{fmtDate(req.reviewedAt)}</p>
                          </div>
                        )}
                        {req.deliveryAddress?.city && (
                          <div>
                            <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-medium mb-0.5">Ship To</p>
                            <p className="font-semibold text-[#18181b]">{req.deliveryAddress.city}, {req.deliveryAddress.state} {req.deliveryAddress.zip}</p>
                          </div>
                        )}
                      </div>

                      {req.adminNotes && (
                        <div className="flex items-start gap-2 px-4 py-3 bg-[#f8f9ff] border border-[#e0e7ff] rounded-xl text-sm text-[#3730a3] mb-4">
                          <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#6366f1]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          <span>{req.adminNotes}</span>
                        </div>
                      )}

                      {/* Denied message */}
                      {req.status === 'denied' && (
                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                          This request was not approved. Contact support or submit a new request.
                        </div>
                      )}

                      {/* Progress tracker */}
                      <ProgressTracker status={req.status}/>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

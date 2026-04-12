'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/authContext';

function resizeImage(file, maxSize = 400) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  // localPicture: undefined = "use DB value", null = "removed", string = "local selection"
  const [localPicture, setLocalPicture] = useState(undefined);
  const [pendingData, setPendingData] = useState(null); // unsaved selection
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState(null);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // localPicture takes priority; if undefined, fall back to what's in DB
  const displayPicture = localPicture !== undefined ? localPicture : (user.profilePicture || null);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }
    const data = await resizeImage(file);
    setLocalPicture(data);  // show preview immediately
    setPendingData(data);   // mark as unsaved
    setMessage(null);
  }

  function handleCancel() {
    setLocalPicture(undefined); // revert to DB value
    setPendingData(null);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSave() {
    if (!pendingData) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/profile-picture', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profilePicture: pendingData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      // Keep localPicture as is (the saved image stays displayed)
      // Just clear the "unsaved" pending marker
      setPendingData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage({ type: 'success', text: 'Profile photo updated successfully.' });
      refreshUser(); // fire and forget — syncs DB state in background
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/profile-picture', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profilePicture: null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove');
      setLocalPicture(null); // immediately show initials
      setPendingData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMessage({ type: 'success', text: 'Profile photo removed.' });
      refreshUser();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0d1f3c]">My Profile</h2>
        <p className="text-sm text-[#71717a] mt-0.5">Manage your profile photo and view your account details.</p>
      </div>

      {/* Profile photo card */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6" style={{ boxShadow: '0 1px 8px 0 rgb(0 0 0 / 0.06)' }}>
        <h3 className="text-sm font-semibold text-[#0d1f3c] mb-4">Profile Photo</h3>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#1a4688] flex items-center justify-center border-4 border-white"
              style={{ boxShadow: '0 2px 12px 0 rgb(0 0 0 / 0.15)' }}>
              {displayPicture ? (
                <img src={displayPicture} alt="Profile" className="w-full h-full object-cover"/>
              ) : (
                <span className="text-white font-bold text-2xl">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1a4688] text-white flex items-center justify-center border-2 border-white hover:bg-[#0d1f3c] transition-colors"
              title="Change photo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/>
              </svg>
            </button>
          </div>

          {/* Controls */}
          <div className="flex-1">
            {pendingData ? (
              <div className="space-y-2">
                <p className="text-sm text-[#52525b]">Photo ready to save.</p>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving}
                    className="px-4 py-2 rounded-lg bg-[#1a4688] text-white text-sm font-medium hover:bg-[#0d1f3c] transition-colors disabled:opacity-60 flex items-center gap-2">
                    {saving && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                    {saving ? 'Saving…' : 'Save Photo'}
                  </button>
                  <button onClick={handleCancel} disabled={saving}
                    className="px-4 py-2 rounded-lg border border-[#d4d4d8] text-sm text-[#52525b] hover:bg-[#f4f4f5] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-[#52525b]">
                  {displayPicture ? 'Update your profile photo.' : 'Add a photo to personalise your account.'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg border border-[#d4d4d8] text-sm text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                    {displayPicture ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {displayPicture && (
                    <button onClick={handleRemove} disabled={removing}
                      className="px-4 py-2 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60 flex items-center gap-1.5">
                      {removing && <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
                      {removing ? 'Removing…' : 'Remove Photo'}
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#a1a1aa]">JPEG, PNG or WebP. Max 2 MB.</p>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div className={`mt-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            )}
            {message.text}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
      </div>

      {/* Account info card */}
      <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6" style={{ boxShadow: '0 1px 8px 0 rgb(0 0 0 / 0.06)' }}>
        <h3 className="text-sm font-semibold text-[#0d1f3c] mb-4">Account Information</h3>
        <dl className="space-y-1">
          {[
            ['Full Name', `${user.firstName} ${user.lastName}`],
            ['Email Address', user.email],
            ['Phone', user.phone || '—'],
            ['Member Number', user.memberNumber],
            ['Membership Type', user.membershipType === 'business' ? 'Business' : 'Personal'],
            ['Member Since', new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2.5 border-b border-[#f4f4f5] last:border-0">
              <dt className="text-sm text-[#71717a]">{label}</dt>
              <dd className="text-sm font-medium text-[#18181b] text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

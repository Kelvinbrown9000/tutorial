'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { useAuth } from '@/lib/authContext';

const steps = [
  { step: '01', title: 'Confirm Eligibility', desc: 'Review the eligibility criteria to make sure you qualify for membership.' },
  { step: '02', title: 'Complete the Application', desc: 'Fill out the secure online form — takes about 5–10 minutes.' },
  { step: '03', title: 'Fund Your Account', desc: 'Open your Share Savings account with a $5 minimum deposit.' },
  { step: '04', title: 'Welcome to the Family', desc: 'Your account is active! Access all products and services immediately.' },
];

export default function JoinPage() {
  const { register } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', membershipType: 'personal', terms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  }

  function validate() {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email';
    if (form.password.length < 8) errs.password = 'At least 8 characters';
    else if (!/[0-9]/.test(form.password)) errs.password = 'Must include at least one number';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must accept the terms';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setError('');
    setIsLoading(true);
    try {
      const user = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        membershipType: form.membershipType,
      });
      setSuccess(user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
      fieldErrors[field]
        ? 'border-red-400 bg-red-50'
        : 'border-[#d4d4d8] focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688]'
    }`;

  return (
    <>
      <PageHero
        title="Open Your Membership Today"
        subtitle="Joining Guardian Trust is free and takes about 10 minutes. You'll need a government-issued ID and your Social Security number."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Membership', href: '/membership' },
          { label: 'Join Now' },
        ]}
      />

      <section aria-labelledby="join-steps-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="join-steps-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            How to Join in 4 Easy Steps
          </h2>

          <ol className="space-y-6">
            {steps.map((s) => (
              <li key={s.step} className="flex items-start gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#0d1f3c] text-white flex items-center justify-center font-bold text-lg" aria-hidden="true">
                  {s.step}
                </div>
                <div className="pt-2">
                  <h3 className="font-bold text-[#0d1f3c] text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-[#52525b] leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 bg-[#f0f7ff] rounded-2xl p-8">
            <h3 className="text-xl font-bold text-[#0d1f3c] mb-4">What You&rsquo;ll Need</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Government-issued photo ID','Social Security Number (SSN or ITIN)','$5 minimum opening deposit','Personal contact information','U.S. mailing address','Eligibility documentation (if applicable)'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-[#18181b]">
                  <svg className="w-4 h-4 text-[#1f7f4a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            {!showForm && !success && (
              <div className="text-center">
                <p className="text-[#52525b] text-sm mb-4">Application opens in a secure, HTTPS-encrypted environment.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#1f7f4a] text-white font-bold text-base hover:bg-[#155533] transition-colors"
                >
                  Begin Application
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <p className="text-xs text-[#71717a] mt-3">
                  Already a member?{' '}
                  <Link href="/signin" className="text-[#1a4688] underline hover:text-[#0d1f3c]">Sign in to your account</Link>
                </p>
              </div>
            )}

            {success && (
              <div className="bg-[#f0fdf4] border border-[#86efac] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-[#1f7f4a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#0d1f3c] mb-2">Welcome to Guardian Trust!</h3>
                <p className="text-[#52525b] mb-1">Your membership has been created successfully.</p>
                <p className="text-sm font-mono bg-white border border-[#e4e4e7] rounded-lg px-4 py-2 inline-block my-3">
                  Member #: <strong>{success.memberNumber}</strong>
                </p>
                <p className="text-[#52525b] text-sm">You are now being redirected to your dashboard…</p>
              </div>
            )}

            {showForm && !success && (
              <div className="bg-white border border-[#e4e4e7] rounded-2xl p-8 mt-4" style={{ boxShadow: '0 2px 16px 0 rgb(0 0 0 / 0.06)' }}>
                <h3 className="text-xl font-bold text-[#0d1f3c] mb-6">Membership Application</h3>

                {error && (
                  <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['firstName','First Name'],['lastName','Last Name']].map(([field, label]) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-[#18181b] mb-1.5">{label}</label>
                        <input type="text" value={form[field]} onChange={set(field)} className={inputClass(field)}/>
                        {fieldErrors[field] && <p className="mt-1 text-xs text-red-600">{fieldErrors[field]}</p>}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18181b] mb-1.5">Email Address</label>
                    <input type="email" value={form.email} onChange={set('email')} className={inputClass('email')}/>
                    {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#18181b] mb-1.5">Phone <span className="text-[#71717a] font-normal">(optional)</span></label>
                    <input type="tel" value={form.phone} onChange={set('phone')} className="w-full px-4 py-3 rounded-xl border border-[#d4d4d8] text-sm focus:border-[#1a4688] focus:ring-1 focus:ring-[#1a4688] outline-none transition-all"/>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['password','Password'],['confirmPassword','Confirm Password']].map(([field, label]) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-[#18181b] mb-1.5">{label}</label>
                        <input type="password" value={form[field]} onChange={set(field)} className={inputClass(field)}/>
                        {fieldErrors[field] && <p className="mt-1 text-xs text-red-600">{fieldErrors[field]}</p>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#71717a] -mt-2">Min. 8 characters with at least one number.</p>

                  <div>
                    <p className="block text-sm font-medium text-[#18181b] mb-2">Membership Type</p>
                    <div className="flex gap-6">
                      {[['personal','Personal'],['business','Business']].map(([val, label]) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer text-sm text-[#52525b]">
                          <input type="radio" name="membershipType" value={val} checked={form.membershipType === val} onChange={set('membershipType')} className="accent-[#1a4688]"/>
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={form.terms} onChange={set('terms')} className="mt-0.5 accent-[#1a4688]"/>
                      <span className="text-sm text-[#52525b]">
                        I agree to the{' '}
                        <Link href="/legal/terms" className="text-[#1a4688] underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/legal/privacy" className="text-[#1a4688] underline">Privacy Policy</Link>
                      </span>
                    </label>
                    {fieldErrors.terms && <p className="mt-1 text-xs text-red-600 ml-6">{fieldErrors.terms}</p>}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="px-6 py-3 rounded-xl border border-[#d4d4d8] text-sm font-medium text-[#52525b] hover:bg-[#f4f4f5] transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading}
                      className="flex-1 py-3 rounded-xl bg-[#1f7f4a] text-white font-bold hover:bg-[#155533] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          Creating account…
                        </>
                      ) : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

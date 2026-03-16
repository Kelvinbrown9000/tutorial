"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="hero-gradient text-white relative overflow-hidden"
      aria-label="Homepage hero"
    >
      {/* Decorative SVG pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Abstract shape */}
      <div className="absolute -right-32 -top-32 w-96 h-96 rounded-full opacity-10 bg-[#2a9a5c] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full opacity-10 bg-[#3a6fbe] blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container-site relative z-10 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-12">
        {/* Text content */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium text-[#85d4a8] mb-6">
            <ShieldIcon />
            Member-Owned · Not-for-Profit · Since 1948
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-5">
            Banking Built on Trust.
            <br />
            <span className="text-[#4db87a]">Powered by Service.</span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            As a member-owned credit union, every dollar you save and every
            loan you take helps our entire community thrive. Better rates,
            lower fees, and people who genuinely care.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Link
              href="/membership/join"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1f7f4a] hover:bg-[#155533] text-white font-semibold text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Join Guardian Trust
              <ArrowRight />
            </Link>
            <Link
              href="/rates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base transition-all"
            >
              Explore Rates
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start">
            <TrustBadge icon={<LockIcon />} text="Federally Insured" />
            <TrustBadge icon={<StarIcon />} text="4.9★ App Rating" />
            <TrustBadge icon={<UsersIcon />} text="240,000+ Members" />
          </div>
        </div>

        {/* Hero illustration */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md" aria-hidden="true">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-blue-100">
      <span className="text-[#4db87a]">{icon}</span>
      {text}
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
      {/* Card background */}
      <rect x="20" y="40" width="360" height="230" rx="20" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Header bar */}
      <rect x="20" y="40" width="360" height="60" rx="20" fill="rgba(255,255,255,0.05)" />
      <rect x="20" y="80" width="360" height="20" fill="rgba(255,255,255,0.05)" />

      {/* Logo circle */}
      <circle cx="68" cy="70" r="22" fill="rgba(42,154,92,0.3)" stroke="#2a9a5c" strokeWidth="1.5" />
      <text x="68" y="75" textAnchor="middle" fontSize="16" fill="#4db87a" fontWeight="bold">GT</text>

      {/* Account info lines */}
      <rect x="105" y="58" width="130" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
      <rect x="105" y="72" width="90" height="6" rx="3" fill="rgba(255,255,255,0.2)" />

      {/* Balance */}
      <text x="340" y="65" textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.5)">BALANCE</text>
      <text x="340" y="80" textAnchor="end" fontSize="16" fill="white" fontWeight="bold">$24,871.50</text>

      {/* Divider */}
      <line x1="40" y1="115" x2="360" y2="115" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Stats row */}
      <g>
        <text x="80" y="148" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)">SAVINGS APY</text>
        <text x="80" y="165" textAnchor="middle" fontSize="20" fill="#4db87a" fontWeight="bold">4.75%</text>
      </g>
      <line x1="160" y1="130" x2="160" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <g>
        <text x="240" y="148" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.5)">AUTO LOAN APR</text>
        <text x="240" y="165" textAnchor="middle" fontSize="20" fill="white" fontWeight="bold">5.24%</text>
      </g>
      <line x1="320" y1="130" x2="320" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <g>
        <text x="360" y="148" textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.5)">POINTS</text>
        <text x="360" y="165" textAnchor="end" fontSize="20" fill="#ecc265" fontWeight="bold">8,420</text>
      </g>

      {/* Divider */}
      <line x1="40" y1="195" x2="360" y2="195" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Quick action buttons */}
      {[
        { x: 65, label: "Transfer" },
        { x: 165, label: "Pay Bill" },
        { x: 265, label: "Deposit" },
      ].map((b) => (
        <g key={b.label}>
          <rect x={b.x - 40} y="210" width="80" height="36" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <text x={b.x} y="234" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.7)" fontWeight="500">{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

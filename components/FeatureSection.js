import Link from "next/link";

const features = [
  {
    icon: <MobileDepositIcon />,
    title: "Mobile Deposit",
    desc: "Snap a photo of your check and deposit it from anywhere, any time of day.",
  },
  {
    icon: <BillPayIcon />,
    title: "Bill Pay",
    desc: "Schedule and automate payments to hundreds of billers nationwide.",
  },
  {
    icon: <TransferIcon />,
    title: "Instant Transfers",
    desc: "Move money between your Guardian Trust accounts in seconds — no waiting.",
  },
  {
    icon: <ZelleIcon />,
    title: "Send Money with Zelle\u00ae",
    desc: "Send and receive money with friends and family quickly and safely.",
  },
  {
    icon: <AlertIcon />,
    title: "Account Alerts",
    desc: "Custom push notifications and SMS alerts keep you informed on every transaction.",
  },
  {
    icon: <LockIcon />,
    title: "Biometric Login",
    desc: "Sign in with Face ID or fingerprint for fast, secure access to your account.",
  },
];

export default function FeatureSection() {
  return (
    <section
      aria-labelledby="digital-banking-heading"
      className="py-16 lg:py-20 bg-white"
    >
      <div className="container-site">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left: phone mockup */}
          <div className="flex-shrink-0 w-full max-w-xs" aria-hidden="true">
            <PhoneMockup />
          </div>

          {/* Right: features */}
          <div className="flex-1">
            <p className="text-[#1a4688] text-sm font-semibold uppercase tracking-widest mb-3">
              Digital Banking
            </p>
            <h2
              id="digital-banking-heading"
              className="text-3xl sm:text-4xl font-bold text-[#0d1f3c] mb-4"
            >
              Your Bank, Wherever You Are
            </h2>
            <p className="text-[#52525b] mb-8 leading-relaxed">
              Our mobile app and online banking platform put the full power of
              your membership in the palm of your hand — no branch visit
              required.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#f0f7ff] flex items-center justify-center text-[#1a4688]">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#0d1f3c] mb-0.5">
                      {f.title}
                    </h3>
                    <p className="text-sm text-[#52525b] leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/mobile-online-banking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors"
            >
              Explore Digital Banking
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <svg viewBox="0 0 240 440" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
      {/* Phone shell */}
      <rect x="20" y="10" width="200" height="420" rx="30" fill="#0d1f3c" />
      <rect x="24" y="14" width="192" height="412" rx="27" fill="#112d54" />
      {/* Screen */}
      <rect x="28" y="18" width="184" height="404" rx="24" fill="#0a1628" />
      {/* Notch */}
      <rect x="85" y="20" width="70" height="18" rx="9" fill="#0d1f3c" />

      {/* Status bar */}
      <text x="40" y="50" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="monospace">9:41 AM</text>
      <text x="180" y="50" textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.5)" fontFamily="monospace">100%</text>

      {/* Header */}
      <text x="120" y="90" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">Good morning, Alex</text>
      <text x="120" y="115" textAnchor="middle" fontSize="22" fill="white" fontWeight="bold" fontFamily="sans-serif">$24,871.50</text>
      <text x="120" y="132" textAnchor="middle" fontSize="10" fill="#4db87a" fontFamily="sans-serif">Total Balance</text>

      {/* Quick actions */}
      {[
        { x: 60, icon: "⇄", label: "Transfer" },
        { x: 120, icon: "📄", label: "Pay" },
        { x: 180, icon: "📸", label: "Deposit" },
      ].map((a) => (
        <g key={a.label}>
          <circle cx={a.x} cy="175" r="22" fill="rgba(255,255,255,0.08)" />
          <text x={a.x} y="180" textAnchor="middle" fontSize="14" fill="white">{a.icon}</text>
          <text x={a.x} y="210" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="sans-serif">{a.label}</text>
        </g>
      ))}

      {/* Divider */}
      <line x1="40" y1="230" x2="200" y2="230" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Transactions */}
      {[
        { label: "Amazon", amount: "-$42.99", y: 255 },
        { label: "Direct Deposit", amount: "+$2,100.00", y: 285, pos: true },
        { label: "Starbucks", amount: "-$6.75", y: 315 },
        { label: "Netflix", amount: "-$15.99", y: 345 },
      ].map((t) => (
        <g key={t.label}>
          <circle cx="50" cy={t.y} r="12" fill="rgba(255,255,255,0.07)" />
          <text x="70" y={t.y + 4} fontSize="11" fill="white" fontFamily="sans-serif" fontWeight="500">{t.label}</text>
          <text x="200" y={t.y + 4} textAnchor="end" fontSize="11" fill={t.pos ? "#4db87a" : "rgba(255,255,255,0.7)"} fontFamily="sans-serif">{t.amount}</text>
        </g>
      ))}

      {/* Bottom nav */}
      <rect x="28" y="380" width="184" height="42" rx="0" fill="rgba(0,0,0,0.3)" />
      {["Home", "Cards", "Pay", "More"].map((label, i) => (
        <text key={label} x={52 + i * 46} y="406" textAnchor="middle" fontSize="9" fill={i === 0 ? "#4db87a" : "rgba(255,255,255,0.4)"} fontFamily="sans-serif">{label}</text>
      ))}

      {/* Home bar */}
      <rect x="90" y="415" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function MobileDepositIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
}
function BillPayIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function TransferIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
}
function ZelleIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8l4 4-4 4"/></svg>;
}
function AlertIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
}
function LockIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}
function ArrowRight() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}

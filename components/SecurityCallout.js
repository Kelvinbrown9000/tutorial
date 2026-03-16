import Link from "next/link";
import { brand, disclaimers } from "@/content/site";

export default function SecurityCallout() {
  return (
    <section
      aria-labelledby="security-heading"
      className="py-14 lg:py-18 bg-[#f4f4f5]"
    >
      <div className="container-site">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NCUA badge */}
          <div className="md:col-span-1 bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-[#e4e4e7]" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
            <FederalSeal />
            <h3 className="text-base font-bold text-[#0d1f3c] mt-4 mb-2">
              Federally Insured
            </h3>
            <p className="text-sm text-[#52525b] leading-relaxed">
              {disclaimers.fdic}
            </p>
          </div>

          {/* Security center */}
          <div className="md:col-span-2 bg-[#0d1f3c] rounded-2xl p-7 text-white flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-[#1a4688] flex items-center justify-center">
                <ShieldCheckIcon />
              </div>
            </div>
            <div className="flex-1">
              <h2 id="security-heading" className="text-xl font-bold mb-2">
                Your Security Is Our Priority
              </h2>
              <p className="text-[#a8c8e8] text-sm leading-relaxed mb-5">
                We use 256-bit encryption, multi-factor authentication, and
                real-time fraud monitoring to protect every transaction and keep
                your accounts safe around the clock.
              </p>
              <div className="flex flex-wrap gap-3 mb-5">
                {[
                  "256-bit Encryption",
                  "Real-Time Fraud Alerts",
                  "MFA Protected",
                  "Zero Liability Policy",
                ].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#c0ecd4]"
                  >
                    <CheckSmall />
                    {badge}
                  </span>
                ))}
              </div>
              <Link
                href="/security"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#4db87a] hover:text-[#85d4a8] transition-colors"
              >
                Visit the Security Center
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FederalSeal() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="#f0f7ff" stroke="#1a4688" strokeWidth="2" />
      <path d="M32 10L36 24H50L39 33L43 47L32 38L21 47L25 33L14 24H28Z" fill="#1a4688" opacity="0.15" />
      <path d="M32 10L36 24H50L39 33L43 47L32 38L21 47L25 33L14 24H28Z" stroke="#1a4688" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="32" y="56" textAnchor="middle" fontSize="6" fill="#1a4688" fontWeight="700" fontFamily="sans-serif" letterSpacing="0.5">NCUA INSURED</text>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="w-6 h-6 text-[#4db87a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function CheckSmall() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
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

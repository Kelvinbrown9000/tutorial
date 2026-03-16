import Link from "next/link";
import { membershipEligibility, brand } from "@/content/site";

export default function EligibilityBanner() {
  return (
    <section
      aria-labelledby="eligibility-heading"
      className="py-16 lg:py-20 bg-[#f0f7ff]"
    >
      <div className="container-site">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: text */}
          <div className="flex-1">
            <p className="text-[#1f7f4a] text-sm font-semibold uppercase tracking-widest mb-3">
              Membership Eligibility
            </p>
            <h2
              id="eligibility-heading"
              className="text-3xl sm:text-4xl font-bold text-[#0d1f3c] mb-4"
            >
              Who Can Join {brand.shortName}?
            </h2>
            <p className="text-[#52525b] mb-6 leading-relaxed">
              {brand.name} was founded to serve our community, and we&rsquo;ve
              grown to welcome a broad and diverse membership. You may be
              eligible if you are any of the following:
            </p>

            <ul className="space-y-3 mb-8" aria-label="Membership eligibility criteria">
              {membershipEligibility.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[#18181b] text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/membership#eligibility"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors"
            >
              Check Your Eligibility
              <ArrowRight />
            </Link>
          </div>

          {/* Right: stat card */}
          <div
            className="flex-shrink-0 w-full max-w-xs lg:max-w-sm rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px 0 rgb(13 31 60 / 0.12)" }}
          >
            <div className="bg-[#0d1f3c] p-8 text-white">
              <ShieldBig />
              <h3 className="text-2xl font-bold mt-4 mb-2">
                Proud to Serve Our Community
              </h3>
              <p className="text-[#a8c8e8] text-sm leading-relaxed">
                For over 75 years, {brand.shortName} has put members first —
                not shareholders. Our profits flow back to you through better
                rates and lower fees.
              </p>
            </div>
            <div className="bg-white px-8 py-6 grid grid-cols-2 gap-4">
              {[
                { value: brand.memberCount, label: "Members" },
                { value: brand.assetSize, label: "In Assets" },
                { value: "75+", label: "Years of Service" },
                { value: "$0", label: "Monthly Checking Fees" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#1a4688]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#71717a] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#edfaf3] flex items-center justify-center mt-0.5">
      <svg className="w-3 h-3 text-[#1f7f4a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
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

function ShieldBig() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M26 4L46 13V28C46 38 36 46 26 50C16 46 6 38 6 28V13Z" fill="rgba(42,154,92,0.2)" stroke="#2a9a5c" strokeWidth="1.5"/>
      <path d="M26 12L38 18V27C38 33 32 38 26 41C20 38 14 33 14 27V18Z" fill="rgba(42,154,92,0.15)"/>
      <polyline points="19,27 24,32 34,22" stroke="#4db87a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

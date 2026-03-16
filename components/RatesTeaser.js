import Link from "next/link";
import { rates, disclaimers } from "@/content/site";

export default function RatesTeaser() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      aria-labelledby="rates-heading"
      className="py-16 lg:py-20 bg-[#0d1f3c]"
    >
      <div className="container-site">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[#4db87a] text-sm font-semibold uppercase tracking-widest mb-2">
              Today&rsquo;s Rates
            </p>
            <h2
              id="rates-heading"
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Rates That Work in Your Favor
            </h2>
            <p className="text-[#a8c8e8] mt-2 text-sm">
              Effective {today} &middot; Subject to change
            </p>
          </div>
          <Link
            href="/rates"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors flex-shrink-0"
          >
            All Rates
            <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {rates.map((rate) => (
            <div
              key={rate.label}
              className="bg-white/05 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
            >
              <p className="text-[#a8c8e8] text-xs font-medium uppercase tracking-wider mb-3">
                {rate.label}
              </p>
              <div className="flex items-end gap-1.5 mb-1">
                <span className="text-3xl font-bold text-white leading-none">
                  {rate.value}
                </span>
                <span className="text-[#4db87a] text-sm font-bold mb-0.5">
                  {rate.unit}
                </span>
              </div>
              <p className="text-[#71717a] text-xs mt-2">{rate.note}</p>
            </div>
          ))}
        </div>

        <Disclaimer text={disclaimers.apyGeneral} className="mt-6" />
      </div>
    </section>
  );
}

function Disclaimer({ text, className = "" }) {
  return (
    <p
      className={`text-[#52525b] text-xs leading-relaxed ${className}`}
      role="note"
    >
      {text}
    </p>
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

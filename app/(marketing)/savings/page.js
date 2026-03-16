import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { rates, disclaimers } from "@/content/site";

export const metadata = {
  title: "Savings Accounts",
  description:
    "Grow your savings with Guardian Trust high-yield savings, money market accounts, and certificates with competitive APY rates.",
};

const products = [
  {
    id: "share-savings",
    name: "Share Savings",
    rate: "1.50%",
    rateLabel: "APY",
    minBalance: "$5",
    desc: "Your foundational membership account. Open with just $5 and start building your financial future.",
    features: ["$5 minimum to open", "No monthly fees", "Up to 6 withdrawals/month", "Federally insured"],
  },
  {
    id: "high-yield",
    name: "High-Yield Savings",
    rate: "4.75%",
    rateLabel: "APY",
    minBalance: "$500",
    badge: "Best Rate",
    desc: "Maximize returns on your cash with our highest-yield savings option — no lock-in required.",
    features: ["$500 minimum balance for APY", "Tiered interest structure", "No withdrawal penalties", "Online-first account"],
  },
  {
    id: "money-market",
    name: "Money Market",
    rate: "3.95%",
    rateLabel: "APY",
    minBalance: "$2,500",
    desc: "Higher yields with easy check-writing access. Ideal for emergency funds or short-term goals.",
    features: ["$2,500 minimum balance", "Debit card included", "Check-writing privileges", "Tiered APY structure"],
  },
  {
    id: "certificates",
    name: "Share Certificate (CD)",
    rate: "5.10%",
    rateLabel: "APY",
    minBalance: "$500",
    badge: "Lock in Today",
    desc: "Lock in a guaranteed rate for 3–60 months. Perfect for money you won't need immediately.",
    features: ["$500 minimum deposit", "Terms: 3, 6, 12, 24, 36, 60 months", "Fixed guaranteed rate", "Auto-renewal option"],
  },
];

const faqs = [
  {
    question: "What is the difference between APY and APR?",
    answer:
      "APY (Annual Percentage Yield) reflects the total interest earned on savings over a year, including compounding. APR (Annual Percentage Rate) is typically used for loans and shows the annual cost of borrowing without compounding.",
  },
  {
    question: "Is there a penalty for early withdrawal on a Certificate?",
    answer:
      "Yes. Early withdrawal from a Share Certificate may incur a penalty equal to 90–180 days of dividends depending on the term. Contact us before withdrawing to understand your options.",
  },
  {
    question: "How is interest calculated and credited?",
    answer:
      "Dividends on savings accounts are calculated daily and credited to your account monthly. Certificate dividends are credited at maturity or monthly, depending on the term you select.",
  },
];

export default function SavingsPage() {
  return (
    <>
      <PageHero
        title="Savings Built to Grow With You"
        subtitle="From your first $5 to a full savings strategy — we have accounts that match every stage of your financial journey."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Savings Accounts" }]}
      />

      <section aria-labelledby="savings-products-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="savings-products-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Find the Right Account for Your Goals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                id={p.id}
                className="bg-white rounded-2xl border border-[#e4e4e7] p-6 flex flex-col"
                style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="text-lg font-bold text-[#0d1f3c]">{p.name}</h3>
                  {p.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#edfaf3] text-[#1f7f4a] flex-shrink-0">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="mb-3">
                  <span className="text-4xl font-bold text-[#1f7f4a]">{p.rate}</span>
                  <span className="text-sm text-[#71717a] ml-1.5">{p.rateLabel}</span>
                </div>
                <p className="text-sm text-[#52525b] mb-4 leading-relaxed flex-1">{p.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-[#52525b]">
                      <svg className="w-3.5 h-3.5 text-[#1f7f4a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/membership/join" className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors">
                  Open Account
                </Link>
              </div>
            ))}
          </div>
          <Disclaimer text={disclaimers.apyGeneral} className="mt-6 text-center" />
        </div>
      </section>

      <section aria-labelledby="savings-faq-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="savings-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Common Questions
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

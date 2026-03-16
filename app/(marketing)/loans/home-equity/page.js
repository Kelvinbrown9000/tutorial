import Link from "next/link";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Home Equity Loans",
  description:
    "Leverage your home's equity with a Guardian Trust Home Equity Loan or HELOC. Competitive rates and flexible access to funds.",
};

export default function HomeEquityPage() {
  return (
    <>
      <PageHero
        title="Put Your Home's Equity to Work"
        subtitle="Access the value you've built in your home with a fixed-rate Home Equity Loan or a flexible Home Equity Line of Credit (HELOC)."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Loans", href: "/loans" },
          { label: "Home Equity" },
        ]}
        cta={
          <Link href="/membership/join" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
            Apply for Home Equity
          </Link>
        }
      />

      <section className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Home Equity Loan",
                rate: "7.25% APR",
                desc: "Borrow a lump sum at a fixed rate. Perfect for a single large expense like a renovation or major purchase.",
                features: ["Fixed rate and payment", "Lump-sum disbursement", "Terms 5–20 years", "No closing costs on most loans", "Interest may be tax-deductible*"],
              },
              {
                title: "HELOC",
                rate: "7.99% Variable APR",
                desc: "Access a revolving line of credit secured by your home. Draw only what you need, when you need it.",
                features: ["10-year draw period", "20-year repayment period", "Variable rate tied to Prime", "Interest-only payments during draw", "Flexible access via online transfer"],
              },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-2xl border border-[#e4e4e7] p-7" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <h2 className="text-xl font-bold text-[#0d1f3c] mb-1">{p.title}</h2>
                <p className="text-[#1f7f4a] font-bold text-lg mb-3">{p.rate}</p>
                <p className="text-sm text-[#52525b] mb-5 leading-relaxed">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#52525b]">
                      <svg className="w-3.5 h-3.5 text-[#1f7f4a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/membership/join" className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors">
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
          <Disclaimer text={`${disclaimers.loanGeneral} *Consult a tax advisor regarding deductibility.`} className="mt-6" />
        </div>
      </section>
    </>
  );
}

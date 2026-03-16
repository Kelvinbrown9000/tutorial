import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Loans",
  description:
    "Auto loans, mortgages, personal loans, and home equity — Guardian Trust offers competitive rates and flexible terms for every borrowing need.",
};

const loanTypes = [
  {
    title: "Auto Loans",
    href: "/loans/auto",
    rate: "From 5.24% APR",
    desc: "Competitive rates for new and used vehicles with terms up to 84 months.",
    icon: "🚗",
  },
  {
    title: "Mortgage",
    href: "/loans/mortgage",
    rate: "From 6.49% APR",
    desc: "Purchase or refinance your home with transparent terms and personalized guidance.",
    icon: "🏠",
  },
  {
    title: "Personal Loans",
    href: "/loans/personal",
    rate: "From 8.99% APR",
    desc: "Borrow $1,000–$50,000 for any purpose with fixed rates and flexible repayment.",
    icon: "💳",
  },
  {
    title: "Home Equity",
    href: "/loans/home-equity",
    rate: "From 7.25% APR",
    desc: "Tap into your home's equity for renovations, consolidation, or major purchases.",
    icon: "🔑",
  },
];

export default function LoansPage() {
  return (
    <>
      <PageHero
        title="Loans That Make Life Happen"
        subtitle="Whether you're buying a car, a home, or covering an unexpected expense — Guardian Trust has a loan solution built for members."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Loans" }]}
      />
      <section aria-labelledby="loan-types-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="loan-types-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            What Are You Borrowing For?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {loanTypes.map((loan) => (
              <Link
                key={loan.title}
                href={loan.href}
                className="card-hover bg-white rounded-2xl border border-[#e4e4e7] p-7 flex flex-col hover:border-[#a8c8e8] transition-colors"
                style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}
              >
                <span className="text-3xl mb-3" aria-hidden="true">{loan.icon}</span>
                <h3 className="text-xl font-bold text-[#0d1f3c] mb-1">{loan.title}</h3>
                <p className="text-sm font-semibold text-[#1f7f4a] mb-2">{loan.rate}</p>
                <p className="text-sm text-[#52525b] leading-relaxed flex-1">{loan.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#1a4688]">
                  Learn More
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

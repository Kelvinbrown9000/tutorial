import Link from "next/link";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Personal Loans",
  description:
    "Guardian Trust personal loans offer fixed rates starting at 8.99% APR for any purpose — debt consolidation, home improvements, medical expenses, and more.",
};

export default function PersonalLoansPage() {
  return (
    <>
      <PageHero
        title="Personal Loans for Life's Big Moments"
        subtitle="Fixed rates, no prepayment penalties, and funds often available within 1 business day. Borrow $1,000–$50,000 for any purpose."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Loans", href: "/loans" },
          { label: "Personal Loans" },
        ]}
        cta={
          <Link href="/membership/join" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
            Apply Now
          </Link>
        }
      />

      <section aria-labelledby="personal-loan-details" className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-[#e4e4e7] p-8" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
              <h2 id="personal-loan-details" className="text-2xl font-bold text-[#0d1f3c] mb-6">Loan Details</h2>
              <dl className="space-y-4">
                {[
                  { label: "Loan Amounts", value: "$1,000 – $50,000" },
                  { label: "APR Range", value: "8.99% – 21.99%" },
                  { label: "Terms", value: "12 – 84 months" },
                  { label: "Origination Fee", value: "$0" },
                  { label: "Prepayment Penalty", value: "None" },
                  { label: "Funding Time", value: "As fast as 1 business day" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-[#e4e4e7] last:border-0">
                    <dt className="text-sm text-[#71717a]">{item.label}</dt>
                    <dd className="text-sm font-bold text-[#0d1f3c]">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-[#0d1f3c] rounded-2xl p-8 text-white flex flex-col">
              <h3 className="text-2xl font-bold mb-4">What Can You Use It For?</h3>
              <ul className="space-y-3 flex-1">
                {[
                  "Debt consolidation",
                  "Home improvements",
                  "Medical or dental expenses",
                  "Wedding or special events",
                  "Emergency expenses",
                  "Education costs",
                  "Vacation or travel",
                  "Any personal need",
                ].map((use) => (
                  <li key={use} className="flex items-center gap-2.5 text-sm text-[#a8c8e8]">
                    <svg className="w-3.5 h-3.5 text-[#4db87a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {use}
                  </li>
                ))}
              </ul>
              <Link href="/membership/join" className="mt-6 flex items-center justify-center px-5 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
                Apply in Minutes
              </Link>
            </div>
          </div>
          <Disclaimer text={disclaimers.loanGeneral} className="mt-6" />
        </div>
      </section>
    </>
  );
}

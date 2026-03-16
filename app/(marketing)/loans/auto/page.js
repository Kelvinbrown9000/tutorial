import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Auto Loans",
  description:
    "Finance a new or used vehicle with Guardian Trust auto loans. Competitive rates starting at 5.24% APR, flexible terms, and fast approval.",
};

const rateTable = [
  { term: "Up to 36 months", newCar: "5.24%", usedCar: "5.74%" },
  { term: "37–48 months", newCar: "5.49%", usedCar: "5.99%" },
  { term: "49–60 months", newCar: "5.74%", usedCar: "6.24%" },
  { term: "61–72 months", newCar: "6.24%", usedCar: "6.74%" },
  { term: "73–84 months", newCar: "6.99%", usedCar: "7.49%" },
];

const faqs = [
  {
    question: "Can I get pre-approved before I shop?",
    answer: "Absolutely. Getting pre-approved lets you know your budget and gives you the confidence of a committed buyer when you negotiate at the dealership. Apply online in minutes.",
  },
  {
    question: "What vehicles qualify for auto loan financing?",
    answer: "We finance new and used cars, trucks, SUVs, and motorcycles. Vehicles must generally be 10 model years old or newer for standard rates. Collector vehicles may also qualify — contact us for details.",
  },
  {
    question: "Is there a prepayment penalty?",
    answer: "No. You can pay off your auto loan early at any time with zero prepayment penalties. Extra payments go directly toward principal.",
  },
  {
    question: "Do you offer GAP coverage?",
    answer: "Yes. GAP (Guaranteed Asset Protection) coverage is available as an optional add-on. It covers the difference between your loan balance and your vehicle's value if it's totaled or stolen.",
  },
];

export default function AutoLoansPage() {
  return (
    <>
      <PageHero
        title="Auto Loans at Rates You'll Love"
        subtitle="Get behind the wheel faster with competitive financing for new and used vehicles — pre-approval in minutes."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Loans", href: "/loans" },
          { label: "Auto Loans" },
        ]}
        cta={
          <Link href="/membership/join" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
            Get Pre-Approved
          </Link>
        }
      />

      {/* Rates table */}
      <section aria-labelledby="auto-rates-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="auto-rates-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Current Auto Loan Rates
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[#e4e4e7]" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="bg-[#0d1f3c] text-white">
                  <th className="px-5 py-4 text-left font-semibold rounded-tl-2xl" scope="col">Loan Term</th>
                  <th className="px-5 py-4 text-right font-semibold" scope="col">New Vehicle APR</th>
                  <th className="px-5 py-4 text-right font-semibold rounded-tr-2xl" scope="col">Used Vehicle APR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7]">
                {rateTable.map((row, i) => (
                  <tr key={row.term} className={i % 2 === 0 ? "bg-white" : "bg-[#f4f4f5]"}>
                    <td className="px-5 py-4 font-medium text-[#0d1f3c]">{row.term}</td>
                    <td className="px-5 py-4 text-right text-[#1f7f4a] font-bold">{row.newCar}</td>
                    <td className="px-5 py-4 text-right text-[#1a4688] font-bold">{row.usedCar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Disclaimer text={disclaimers.loanGeneral} className="mt-4" />
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="auto-faq-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-3xl">
          <h2 id="auto-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

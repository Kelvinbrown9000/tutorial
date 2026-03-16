import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Mortgage Loans",
  description:
    "Purchase or refinance your home with Guardian Trust mortgage loans. Fixed and adjustable rates, low down payment options, and expert local guidance.",
};

const mortgageProducts = [
  {
    name: "30-Year Fixed",
    rate: "6.49%",
    unit: "APR",
    desc: "Consistent monthly payments for the life of your loan. The most popular choice for home buyers.",
  },
  {
    name: "15-Year Fixed",
    rate: "5.99%",
    unit: "APR",
    desc: "Pay off your home faster and save significantly on total interest.",
  },
  {
    name: "5/1 Adjustable (ARM)",
    rate: "5.75%",
    unit: "APR",
    desc: "Fixed for 5 years, then adjusts annually. Great if you plan to sell or refinance.",
  },
  {
    name: "FHA Loan",
    rate: "6.75%",
    unit: "APR",
    desc: "Government-backed financing with lower down payment requirements — as little as 3.5%.",
  },
];

const faqs = [
  {
    question: "What documents do I need to apply for a mortgage?",
    answer: "Typically: recent pay stubs (2 months), W-2s (2 years), bank statements (2–3 months), tax returns (2 years), and government-issued photo ID. Self-employed borrowers may need additional documentation.",
  },
  {
    question: "How much of a down payment do I need?",
    answer: "Down payments vary by loan type. Conventional loans can require as little as 3–5%. FHA loans start at 3.5%. VA and USDA loans may offer 0% down for qualifying borrowers.",
  },
  {
    question: "How long does the mortgage process take?",
    answer: "Typically 30–45 days from application to closing, depending on the complexity of the transaction and how quickly documents are provided. Our loan officers keep you informed at every step.",
  },
  {
    question: "Can I refinance my existing mortgage with Guardian Trust?",
    answer: "Yes. We offer rate-and-term refinancing, cash-out refinancing, and streamline refinancing options. Contact our mortgage team for a free no-obligation consultation.",
  },
];

export default function MortgagePage() {
  return (
    <>
      <PageHero
        title="Home Loans Made Simple"
        subtitle="From pre-qualification to closing day, our mortgage team guides you every step of the way with transparent rates and no surprises."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Loans", href: "/loans" },
          { label: "Mortgage" },
        ]}
        cta={
          <Link href="/membership/join" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
            Get Pre-Qualified
          </Link>
        }
      />

      <section aria-labelledby="mortgage-rates-heading" className="py-16 bg-white">
        <div className="container-site">
          <h2 id="mortgage-rates-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Today&rsquo;s Mortgage Rates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {mortgageProducts.map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border border-[#e4e4e7] p-6" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <h3 className="text-base font-bold text-[#0d1f3c] mb-2">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-[#1a4688]">{p.rate}</span>
                  <span className="text-sm text-[#71717a]">{p.unit}</span>
                </div>
                <p className="text-sm text-[#52525b] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <Disclaimer text={disclaimers.mortgageGeneral} className="mt-6 text-center max-w-3xl mx-auto" />
        </div>
      </section>

      <section aria-labelledby="mortgage-faq-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-3xl">
          <h2 id="mortgage-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Mortgage FAQs
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Investments & Insurance",
  description:
    "Guardian Trust investment and insurance services — IRAs, annuities, life insurance, and more through our trusted partners.",
};

export default function InvestmentsPage() {
  return (
    <>
      <PageHero
        title="Grow and Protect Your Wealth"
        subtitle="Beyond banking — our investments and insurance services help you plan for retirement, protect your family, and build lasting wealth."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Investments & Insurance" }]}
      />

      <section className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "ira",
                icon: "📊",
                title: "Retirement Accounts (IRAs)",
                desc: "Traditional and Roth IRAs with competitive rates. Build your tax-advantaged retirement savings through Guardian Trust.",
                coming: false,
              },
              {
                id: "insurance",
                icon: "🛡️",
                title: "Insurance Products",
                desc: "Life, disability, and accidental death & dismemberment insurance available through our member benefits program.",
                coming: false,
              },
            ].map((p) => (
              <div key={p.id} id={p.id} className="bg-white rounded-2xl border border-[#e4e4e7] p-7" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <span className="text-3xl block mb-3" aria-hidden="true">{p.icon}</span>
                <h2 className="text-xl font-bold text-[#0d1f3c] mb-2">{p.title}</h2>
                <p className="text-sm text-[#52525b] leading-relaxed mb-5">{p.desc}</p>
                <Link href="/contact" className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-[#71717a]">Investment products are not federally insured, are not obligations of the credit union, and may lose value. Investments are offered through a third-party registered broker-dealer.</p>
        </div>
      </section>
    </>
  );
}

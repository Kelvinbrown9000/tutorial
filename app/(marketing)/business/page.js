import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Business Banking",
  description:
    "Guardian Trust business banking solutions — checking, loans, merchant services, and more for small and growing businesses.",
};

export default function BusinessPage() {
  return (
    <>
      <PageHero
        title="Business Banking Built for Growth"
        subtitle="From startup to established enterprise, Guardian Trust delivers the tools and financing your business needs to succeed."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Business Banking" }]}
      />

      <section className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-4xl">
          <div className="bg-white rounded-2xl border border-[#e4e4e7] p-10 text-center" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
            <div className="text-5xl mb-4" aria-hidden="true">🏢</div>
            <h2 className="text-2xl font-bold text-[#0d1f3c] mb-3">Coming Soon</h2>
            <p className="text-[#52525b] max-w-md mx-auto mb-6">
              We&rsquo;re building a full suite of business banking products. In the meantime, call us to discuss business membership and our current offerings.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a4688] text-white font-semibold hover:bg-[#0d1f3c] transition-colors">
              Contact a Business Specialist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

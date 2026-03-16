import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Advice & Planning",
  description:
    "Free financial advice, calculators, budgeting tools, and credit education resources from Guardian Trust Federal Credit Union.",
};

export default function AdvicePage() {
  return (
    <>
      <PageHero
        title="Your Financial Roadmap Starts Here"
        subtitle="Tap into free tools, expert guidance, and educational resources designed to help you make better financial decisions at every stage of life."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Advice & Planning" }]}
      />

      <section className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { id: "education", icon: "🎓", title: "Financial Education", desc: "Courses, articles, and videos covering budgeting, saving, credit, and investing basics." },
              { id: "calculators", icon: "🧮", title: "Calculators", desc: "Mortgage, auto loan, savings, and retirement calculators to plan with precision." },
              { id: "budget", icon: "📊", title: "Budget Planner", desc: "Build a personalized monthly budget and identify opportunities to save more." },
              { id: "credit", icon: "⭐", title: "Credit Education", desc: "Understand credit scores, learn how to improve yours, and monitor changes." },
              { id: "blog", icon: "📝", title: "Financial Blog", desc: "Timely articles from our financial experts on market trends, tips, and strategies." },
              { id: "webinars", icon: "🖥️", title: "Webinars & Events", desc: "Free live and recorded sessions on topics from home buying to retirement planning." },
            ].map((item) => (
              <div key={item.id} id={item.id} className="bg-white rounded-2xl border border-[#e4e4e7] p-6" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <span className="text-3xl block mb-3" aria-hidden="true">{item.icon}</span>
                <h2 className="text-lg font-bold text-[#0d1f3c] mb-2">{item.title}</h2>
                <p className="text-sm text-[#52525b] leading-relaxed mb-4">{item.desc}</p>
                <Link href="/contact" className="text-sm font-semibold text-[#1a4688] hover:text-[#0d1f3c] transition-colors">
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

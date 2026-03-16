import Link from "next/link";

const cards = [
  {
    title: "Budget Smarter",
    desc: "Use our free budgeting tools to track spending, set goals, and build lasting financial habits.",
    href: "/advice#budget",
    icon: <ChartIcon />,
    tag: "Tools",
  },
  {
    title: "Mortgage Calculator",
    desc: "Estimate your monthly payment and see how much home you can afford with our easy calculator.",
    href: "/advice#calculators",
    icon: <CalcIcon />,
    tag: "Calculator",
  },
  {
    title: "Build Your Credit",
    desc: "Learn the steps to establish, monitor, and improve your credit score with expert guidance.",
    href: "/advice#credit",
    icon: <CreditIcon />,
    tag: "Education",
  },
];

export default function AdviceSection() {
  return (
    <section
      aria-labelledby="advice-heading"
      className="py-16 lg:py-20 bg-white"
    >
      <div className="container-site">
        <div className="text-center mb-12">
          <p className="text-[#1f7f4a] text-sm font-semibold uppercase tracking-widest mb-2">
            Advice & Planning
          </p>
          <h2
            id="advice-heading"
            className="text-3xl sm:text-4xl font-bold text-[#0d1f3c] mb-4"
          >
            Guidance for Every Financial Stage
          </h2>
          <p className="text-[#52525b] max-w-xl mx-auto">
            Free tools, educational resources, and expert articles to help you
            make smart decisions with your money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="card-hover group flex flex-col p-6 rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#a8c8e8] transition-colors"
              style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-lg bg-[#f0f7ff] flex items-center justify-center text-[#1a4688]">
                  {card.icon}
                </span>
                <span className="text-xs font-semibold text-[#1a4688] bg-[#f0f7ff] px-2.5 py-1 rounded-full">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0d1f3c] group-hover:text-[#1a4688] mb-2 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-[#52525b] leading-relaxed flex-1">
                {card.desc}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#1a4688]">
                Get Started
                <ArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
function ChartIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
function CalcIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/></svg>;
}
function CreditIcon() {
  return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

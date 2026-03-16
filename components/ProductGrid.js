import Link from "next/link";

const products = [
  {
    title: "Checking Accounts",
    desc: "Free checking with no monthly fees, early direct deposit, and a feature-packed debit card.",
    href: "/checking",
    icon: <CheckingIcon />,
    color: "bg-[#f0f7ff]",
    accent: "text-[#1a4688]",
    badge: null,
  },
  {
    title: "Savings Accounts",
    desc: "Earn more with our high-yield savings and money market accounts — members always come first.",
    href: "/savings",
    icon: <SavingsIcon />,
    color: "bg-[#edfaf3]",
    accent: "text-[#1f7f4a]",
    badge: "Up to 4.75% APY",
  },
  {
    title: "Credit Cards",
    desc: "Rewards, cash back, and no foreign transaction fees on cards that work as hard as you do.",
    href: "/credit-cards",
    icon: <CardIcon />,
    color: "bg-[#fdf3d9]",
    accent: "text-[#c8942a]",
    badge: null,
  },
  {
    title: "Auto Loans",
    desc: "Competitive rates for new and used vehicles with flexible terms and fast approvals.",
    href: "/loans/auto",
    icon: <AutoIcon />,
    color: "bg-[#f0f7ff]",
    accent: "text-[#1a4688]",
    badge: "From 5.24% APR",
  },
  {
    title: "Mortgages",
    desc: "Finance or refinance your home with transparent terms and personal guidance from our loan officers.",
    href: "/loans/mortgage",
    icon: <HomeIcon />,
    color: "bg-[#edfaf3]",
    accent: "text-[#1f7f4a]",
    badge: null,
  },
  {
    title: "Mobile & Online Banking",
    desc: "Bank anytime, anywhere with our award-winning app — deposits, transfers, bill pay, and more.",
    href: "/mobile-online-banking",
    icon: <MobileIcon />,
    color: "bg-[#fdf3d9]",
    accent: "text-[#c8942a]",
    badge: null,
  },
];

export default function ProductGrid() {
  return (
    <section aria-labelledby="products-heading" className="py-16 lg:py-20 bg-white">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2
            id="products-heading"
            className="text-3xl sm:text-4xl font-bold text-[#0d1f3c] mb-4"
          >
            Everything You Need to Thrive Financially
          </h2>
          <p className="text-[#52525b] text-lg max-w-2xl mx-auto">
            From everyday spending to long-term goals, our full suite of
            products is designed to help every member succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.title}
              href={product.href}
              className="card-hover group flex flex-col p-6 rounded-2xl border border-[#e4e4e7] bg-white hover:border-[#a8c8e8] transition-colors"
              style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${product.color}`}
              >
                <span className={product.accent}>{product.icon}</span>
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-bold text-[#0d1f3c] group-hover:text-[#1a4688] transition-colors">
                  {product.title}
                </h3>
                {product.badge && (
                  <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#edfaf3] text-[#1f7f4a] border border-[#c0ecd4]">
                    {product.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#52525b] leading-relaxed flex-1">
                {product.desc}
              </p>

              <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${product.accent}`}>
                Learn More
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
  return (
    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckingIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
}
function SavingsIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 00-9.95 9h11.64L9.74 7.05A1 1 0 1111.86 5.9l3.13 4.36 3.13-4.36a1 1 0 011.96.49L18.31 11H21.95A10 10 0 0012 2z"/><path d="M2.05 11h19.9"/><circle cx="12" cy="16" r="6" strokeDasharray="0"/><path d="M12 14v4m-2-2h4"/></svg>;
}
function CardIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
}
function AutoIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l4 4v4a2 2 0 01-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
}
function HomeIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function MobileIcon() {
  return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
}

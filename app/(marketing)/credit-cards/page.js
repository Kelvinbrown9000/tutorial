import Link from "next/link";
import PageHero from "@/components/PageHero";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Credit Cards",
  description:
    "Guardian Trust Visa credit cards offer rewards, cash back, and low rates. Apply today with no annual fee.",
};

const cards = [
  {
    id: "rewards",
    name: "Guardian Rewards Visa",
    tagline: "Earn on every purchase",
    apr: "14.99%–22.99%",
    annualFee: "$0",
    badge: "Most Popular",
    rewards: "2x points on dining & travel · 1.5x everywhere else",
    color: "from-[#0d1f3c] to-[#1a4688]",
    features: [
      "No annual fee",
      "2x points on dining and travel purchases",
      "1.5x points on all other purchases",
      "Redeem for travel, cash back, or merchandise",
      "No foreign transaction fees",
      "Cell phone protection up to $600",
    ],
  },
  {
    id: "cashback",
    name: "Guardian Cash Back Visa",
    tagline: "Unlimited cash back",
    apr: "15.99%–23.99%",
    annualFee: "$0",
    rewards: "1.5% unlimited cash back on all purchases",
    color: "from-[#155533] to-[#1f7f4a]",
    features: [
      "No annual fee",
      "Unlimited 1.5% cash back on every purchase",
      "Cash back credited monthly",
      "No caps or categories to track",
      "No foreign transaction fees",
      "Introductory 0% APR for 12 months on purchases",
    ],
  },
  {
    id: "secured",
    name: "Guardian Secured Visa",
    tagline: "Build or rebuild your credit",
    apr: "18.00%",
    annualFee: "$25",
    rewards: "Reports to all 3 major bureaus monthly",
    color: "from-[#4a3500] to-[#c8942a]",
    features: [
      "Secured deposit: $200–$5,000",
      "Reports to Equifax, Experian, TransUnion",
      "Graduate to unsecured card after 12 months",
      "Online account management",
      "Credit score monitoring included",
      "$25 annual fee",
    ],
  },
];

export default function CreditCardsPage() {
  return (
    <>
      <PageHero
        title="Credit Cards With Real Rewards"
        subtitle="Low rates, no gimmicks, and rewards that matter. Our Visa cards are designed to give members more."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Credit Cards" }]}
      />

      <section aria-labelledby="cards-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="cards-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Choose Your Card
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} id={card.id} className="bg-white rounded-2xl border border-[#e4e4e7] overflow-hidden flex flex-col" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                {/* Card visual */}
                <div className={`bg-gradient-to-br ${card.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/05" aria-hidden="true" />
                  {card.badge && (
                    <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full bg-[#1f7f4a] text-white mb-4">
                      {card.badge}
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-1">{card.name}</h3>
                  <p className="text-sm text-white/70">{card.tagline}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/50">Variable APR</p>
                      <p className="text-lg font-bold">{card.apr}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/50">Annual Fee</p>
                      <p className="text-lg font-bold">{card.annualFee}</p>
                    </div>
                  </div>
                </div>
                {/* Features */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm font-medium text-[#1a4688] mb-4 bg-[#f0f7ff] px-3 py-2 rounded-lg">
                    {card.rewards}
                  </p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[#52525b]">
                        <svg className="w-3.5 h-3.5 text-[#1f7f4a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/membership/join" className="flex items-center justify-center px-4 py-3 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors">
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Disclaimer text={`${disclaimers.apyGeneral} ${disclaimers.loanGeneral}`} className="mt-6" />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import Disclaimer from "@/components/Disclaimer";
import { disclaimers } from "@/content/site";

export const metadata = {
  title: "Checking Accounts",
  description:
    "Open a Guardian Trust checking account with no monthly fees, early direct deposit access, and a full-featured debit card.",
};

const accounts = [
  {
    name: "Everyday Checking",
    badge: "Most Popular",
    badgeColor: "bg-[#edfaf3] text-[#1f7f4a]",
    apr: "$0",
    aprLabel: "Monthly Fee",
    features: [
      "No monthly maintenance fees — ever",
      "Visa debit card with contactless pay",
      "Access to 85,000+ fee-free ATMs nationwide",
      "Early direct deposit — up to 2 days early",
      "Mobile check deposit",
      "Overdraft protection available",
    ],
    cta: "Open Account",
    ctaHref: "/membership/join",
    highlight: true,
  },
  {
    name: "Interest Checking",
    badge: null,
    apr: "0.15%",
    aprLabel: "APY on all balances",
    features: [
      "Earn interest on your balance daily",
      "No fee with $1,500 average daily balance",
      "All Everyday Checking benefits included",
      "Priority member service line",
      "Free paper statements",
    ],
    cta: "Open Account",
    ctaHref: "/membership/join",
    highlight: false,
  },
  {
    name: "Teen Checking",
    badge: "Ages 13–17",
    badgeColor: "bg-[#f0f7ff] text-[#1a4688]",
    apr: "$0",
    aprLabel: "Monthly Fee",
    features: [
      "No fees, no minimums",
      "Parental controls and spending alerts",
      "Joint account with parent/guardian",
      "Financial literacy resources included",
      "Earns small rewards for savings milestones",
    ],
    cta: "Open Account",
    ctaHref: "/membership/join",
    highlight: false,
  },
];

const faqs = [
  {
    question: "Is there a minimum deposit to open a checking account?",
    answer:
      "Yes, a small $5 deposit into a Share Savings account is required to establish membership. After that, your Everyday Checking account has no minimum balance requirement.",
  },
  {
    question: "How does early direct deposit work?",
    answer:
      "When your employer submits your payroll electronically, we release the funds up to 2 business days before your official pay date at no charge.",
  },
  {
    question: "What ATM network does Guardian Trust use?",
    answer:
      "We're part of the CO-OP and Allpoint ATM networks, giving you fee-free access to over 85,000 ATMs nationwide. Look for the CO-OP or Allpoint logo.",
  },
  {
    question: "Can I get overdraft protection?",
    answer:
      "Yes. You can link your savings account, a line of credit, or enroll in our courtesy pay program. We'll always let you know your options upfront — no hidden fees.",
  },
];

export default function CheckingPage() {
  return (
    <>
      <PageHero
        title="Checking Accounts That Work for You"
        subtitle="No hidden fees, no surprises. Just straightforward checking accounts that put more money in your pocket."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Checking Accounts" }]}
        cta={
          <Link
            href="/membership/join"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors"
          >
            Open an Account Today
          </Link>
        }
      />

      <section aria-labelledby="accounts-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="accounts-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Choose Your Checking Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accounts.map((acct) => (
              <div
                key={acct.name}
                className={`rounded-2xl p-7 flex flex-col border ${
                  acct.highlight
                    ? "bg-[#0d1f3c] border-[#1a4688] text-white"
                    : "bg-white border-[#e4e4e7] text-[#18181b]"
                }`}
                style={{ boxShadow: "0 2px 12px 0 rgb(0 0 0 / 0.08)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className={`text-xl font-bold ${acct.highlight ? "text-white" : "text-[#0d1f3c]"}`}>
                    {acct.name}
                  </h3>
                  {acct.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${acct.badgeColor || "bg-[#edfaf3] text-[#1f7f4a]"}`}>
                      {acct.badge}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <span className={`text-4xl font-bold ${acct.highlight ? "text-[#4db87a]" : "text-[#1a4688]"}`}>
                    {acct.apr}
                  </span>
                  <span className={`block text-xs mt-0.5 ${acct.highlight ? "text-[#a8c8e8]" : "text-[#71717a]"}`}>
                    {acct.aprLabel}
                  </span>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {acct.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${acct.highlight ? "text-[#4db87a]" : "text-[#1f7f4a]"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className={acct.highlight ? "text-[#c0ecd4]" : "text-[#52525b]"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={acct.ctaHref}
                  className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-colors ${
                    acct.highlight
                      ? "bg-[#1f7f4a] text-white hover:bg-[#155533]"
                      : "bg-[#1a4688] text-white hover:bg-[#0d1f3c]"
                  }`}
                >
                  {acct.cta}
                </Link>
              </div>
            ))}
          </div>
          <Disclaimer text={disclaimers.apyGeneral} className="mt-6 text-center" />
        </div>
      </section>

      <section aria-labelledby="checking-faq-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="checking-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Frequently Asked Questions
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";
import { membershipEligibility, brand } from "@/content/site";

export const metadata = {
  title: "Membership & Benefits",
  description:
    "Learn how to join Guardian Trust Federal Credit Union and discover the exclusive benefits of membership.",
};

const benefits = [
  { icon: "💰", title: "Better Rates", desc: "Members consistently enjoy higher savings rates and lower loan rates than traditional banks." },
  { icon: "🏧", title: "85,000+ Free ATMs", desc: "Use any CO-OP or Allpoint ATM nationwide — no fees, ever." },
  { icon: "📱", title: "Award-Winning App", desc: "4.9-star rated mobile banking with every feature you need on the go." },
  { icon: "🛡️", title: "Zero Liability", desc: "You're never responsible for unauthorized purchases on your debit or credit card." },
  { icon: "👤", title: "Personal Service", desc: "Real people answer your calls, and local loan officers know your community." },
  { icon: "📈", title: "Financial Education", desc: "Free resources, webinars, and one-on-one advice to help you reach your goals." },
];

const faqs = [
  {
    question: "How long does it take to open an account?",
    answer: "Most members can open their account online in under 10 minutes. You'll need a government-issued ID, your Social Security number, and a $5 opening deposit for the required Share Savings account.",
  },
  {
    question: "Can family members join if I'm eligible?",
    answer: "Yes! Immediate family members — including spouses, children, parents, siblings, and household members — are all eligible to join if you qualify.",
  },
  {
    question: "What is a Share Savings account?",
    answer: "The Share Savings account is your foundational membership account. The $5 balance represents your 'share' in the credit union as a part-owner. It must be maintained to keep your membership active.",
  },
  {
    question: "What if I move out of the service area?",
    answer: "Once a member, always a member — as long as you maintain your Share Savings account. You can continue to use all products and services regardless of where you live.",
  },
];

export default function MembershipPage() {
  return (
    <>
      <PageHero
        title="Become a Guardian Trust Member"
        subtitle="Joining takes minutes. The benefits last a lifetime. Discover what member-ownership really means for your finances."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Membership" }]}
        cta={
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/membership/join" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors">
              Join Now — It&rsquo;s Free
            </Link>
            <Link href="#eligibility" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors">
              Check Eligibility
            </Link>
          </div>
        }
      />

      {/* Eligibility */}
      <section id="eligibility" aria-labelledby="eligibility-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="eligibility-heading" className="text-3xl font-bold text-[#0d1f3c] mb-4">
            Who Is Eligible to Join?
          </h2>
          <p className="text-[#52525b] mb-8">
            {brand.name} proudly serves a broad and diverse community. You may be eligible if you fall into any of the following categories:
          </p>
          <ul className="space-y-3 mb-8">
            {membershipEligibility.map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-[#f0f7ff] rounded-xl">
                <svg className="w-5 h-5 text-[#1f7f4a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[#18181b]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[#71717a]">Not sure if you qualify? <Link href="/contact" className="text-[#1a4688] underline hover:text-[#0d1f3c]">Contact us</Link> and a membership specialist will help you.</p>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" aria-labelledby="benefits-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="benefits-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Member Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-[#e4e4e7] p-5" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <span className="text-2xl mb-3 block" aria-hidden="true">{b.icon}</span>
                <h3 className="font-bold text-[#0d1f3c] mb-1">{b.title}</h3>
                <p className="text-sm text-[#52525b] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="membership-faq-heading" className="py-16 bg-white">
        <div className="container-site max-w-3xl">
          <h2 id="membership-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Membership FAQs
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

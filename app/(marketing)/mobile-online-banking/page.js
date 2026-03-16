import Link from "next/link";
import PageHero from "@/components/PageHero";
import Accordion from "@/components/Accordion";

export const metadata = {
  title: "Mobile & Online Banking",
  description:
    "Bank anywhere with the Guardian Trust mobile app and online banking. Mobile deposit, bill pay, transfers, Zelle, and more.",
};

const features = [
  {
    id: "app",
    icon: "📱",
    title: "Mobile App",
    desc: "Our award-winning app (rated 4.9 stars) puts your full financial picture in one place. Check balances, transfer funds, deposit checks, pay bills, and manage your cards — all from your phone.",
    bullets: ["Available on iOS and Android", "Biometric login (Face ID / fingerprint)", "Instant transaction alerts", "Card controls — freeze, unfreeze, set limits"],
  },
  {
    id: "online",
    icon: "💻",
    title: "Online Banking",
    desc: "The full-featured web experience gives you powerful tools for managing your finances from any browser — no app required.",
    bullets: ["Account overview and statements", "External account transfers", "eStatements and eNotices", "Secure messaging with our team"],
  },
  {
    id: "billpay",
    icon: "📄",
    title: "Bill Pay",
    desc: "Pay any biller — utilities, credit cards, even individuals — through our integrated bill pay system. Schedule one-time or recurring payments and never miss a due date.",
    bullets: ["Pay thousands of billers nationwide", "Schedule recurring payments", "Payment history and confirmations", "Same-day payment options"],
  },
  {
    id: "zelle",
    icon: "⚡",
    title: "Zelle® Money Transfers",
    desc: "Send and receive money with friends and family in minutes, directly between bank accounts — no fees from Guardian Trust.",
    bullets: ["Transfers arrive within minutes", "No fee from Guardian Trust*", "Safe and bank-backed", "Available inside our mobile app"],
  },
];

const faqs = [
  {
    question: "Is the mobile app free to download?",
    answer: "Yes. The Guardian Trust mobile app is completely free to download from the Apple App Store or Google Play. There are no fees for using the app.",
  },
  {
    question: "How do I enroll in online banking?",
    answer: "Visit our sign-in page and select 'Enroll Now.' You'll need your member number (found on your statement or welcome letter), SSN, and the contact information on file.",
  },
  {
    question: "What is the mobile check deposit limit?",
    answer: "Standard mobile deposit limits are $5,000 per day and $10,000 per month. Members with longer tenure may qualify for higher limits. Deposits are typically available within 1 business day.",
  },
  {
    question: "Is Zelle safe to use?",
    answer: "Yes. Zelle is backed by major financial institutions and uses bank-level security. Only send money to people you know and trust — payments made through Zelle are typically irreversible.",
  },
];

export default function MobileOnlineBankingPage() {
  return (
    <>
      <PageHero
        title="Bank Anywhere, Any Time"
        subtitle="Our mobile app and online platform are designed to give you complete control over your finances — from your phone, tablet, or computer."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Mobile & Online Banking" }]}
      />

      <section aria-labelledby="digital-features-heading" className="py-16 bg-white">
        <div className="container-site">
          <h2 id="digital-features-heading" className="sr-only">Digital Banking Features</h2>
          <div className="space-y-16">
            {features.map((f, i) => (
              <div
                key={f.id}
                id={f.id}
                className={`flex flex-col lg:flex-row gap-10 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-4xl lg:hidden" aria-hidden="true">
                  {f.icon}
                </div>
                <div className="flex-shrink-0 hidden lg:flex w-24 h-24 rounded-3xl bg-[#f0f7ff] items-center justify-center text-5xl" aria-hidden="true">
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#0d1f3c] mb-3">{f.title}</h3>
                  <p className="text-[#52525b] leading-relaxed mb-4">{f.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-[#52525b]">
                        <svg className="w-3.5 h-3.5 text-[#1f7f4a] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-4 bg-[#f4f4f5]">
        <div className="container-site max-w-3xl">
          <p className="text-xs text-[#71717a]">*Zelle and the Zelle-related marks are wholly owned by Early Warning Services, LLC and are used herein under license. Guardian Trust does not charge for the Zelle service; third-party fees may apply.</p>
        </div>
      </section>

      <section aria-labelledby="digital-faq-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site max-w-3xl">
          <h2 id="digital-faq-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Digital Banking FAQs
          </h2>
          <Accordion items={faqs} />
        </div>
      </section>
    </>
  );
}

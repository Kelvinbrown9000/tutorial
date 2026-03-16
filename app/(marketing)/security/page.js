import Link from "next/link";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Security Center",
  description:
    "Protect your Guardian Trust accounts with our security resources, fraud alerts, and identity protection tips.",
};

const alerts = [
  {
    severity: "high",
    title: "Phishing Email Alert",
    date: "March 1, 2026",
    desc: "Members have reported receiving fraudulent emails claiming to be from Guardian Trust. We will never ask for your password, PIN, or full Social Security Number via email.",
  },
  {
    severity: "medium",
    title: "Text Message Scam (Smishing)",
    date: "February 14, 2026",
    desc: "Fraudulent text messages requesting card verification are circulating. Guardian Trust will never ask you to click a link to verify your card via text message.",
  },
];

const tips = [
  { icon: "🔑", title: "Use Strong, Unique Passwords", desc: "Create passwords that are at least 12 characters with a mix of letters, numbers, and symbols. Never reuse passwords across sites." },
  { icon: "📲", title: "Enable Multi-Factor Authentication", desc: "Add an extra layer of security to your online banking login by enabling MFA in your account settings." },
  { icon: "🚨", title: "Set Up Account Alerts", desc: "Configure real-time alerts for transactions, login attempts, and balance changes to spot unusual activity immediately." },
  { icon: "🔒", title: "Never Share Your Credentials", desc: "Guardian Trust staff will never ask for your full password, PIN, or one-time codes. Hang up and call us directly if you suspect fraud." },
  { icon: "🌐", title: "Use Secure Networks", desc: "Avoid logging in on public Wi-Fi. Use a VPN or wait until you're on a trusted connection." },
  { icon: "📋", title: "Monitor Your Credit", desc: "Review your credit reports regularly at annualcreditreport.com. Consider a fraud alert or freeze if you suspect identity theft." },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        title="Security Center"
        subtitle="Stay informed and protected. We monitor your accounts 24/7 — and we want you armed with the knowledge to spot threats before they happen."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Security Center" }]}
      />

      {/* Active alerts */}
      <section aria-labelledby="alerts-heading" className="py-12 bg-[#fff7ed]">
        <div className="container-site max-w-3xl">
          <h2 id="alerts-heading" className="text-2xl font-bold text-[#0d1f3c] mb-6 flex items-center gap-2">
            <span aria-hidden="true">⚠️</span> Active Security Alerts
          </h2>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`rounded-xl border p-5 ${alert.severity === "high" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
                role="alert"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-bold text-sm mb-0.5 ${alert.severity === "high" ? "text-red-700" : "text-yellow-700"}`}>
                      {alert.severity === "high" ? "HIGH PRIORITY" : "ADVISORY"}
                    </p>
                    <h3 className="font-bold text-[#0d1f3c]">{alert.title}</h3>
                    <p className="text-xs text-[#71717a] mt-0.5 mb-2">{alert.date}</p>
                    <p className="text-sm text-[#52525b] leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section aria-labelledby="security-tips-heading" className="py-16 bg-white">
        <div className="container-site">
          <h2 id="security-tips-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            Protect Yourself Online
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-[#f4f4f5] rounded-2xl p-5 border border-[#e4e4e7]">
                <span className="text-2xl block mb-2" aria-hidden="true">{tip.icon}</span>
                <h3 className="font-bold text-[#0d1f3c] mb-1.5">{tip.title}</h3>
                <p className="text-sm text-[#52525b] leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report fraud CTA */}
      <section aria-labelledby="report-fraud-heading" className="py-12 bg-[#0d1f3c] text-white">
        <div className="container-site text-center max-w-2xl">
          <h2 id="report-fraud-heading" className="text-2xl font-bold mb-3">Think You&rsquo;ve Been Compromised?</h2>
          <p className="text-[#a8c8e8] mb-6">Report fraud or suspicious activity immediately. Our fraud team is available 24/7 to assist you.</p>
          <a
            href="tel:18005554827"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1f7f4a] text-white font-semibold hover:bg-[#155533] transition-colors"
          >
            Report Fraud Now — (800) 555-4827
          </a>
        </div>
      </section>
    </>
  );
}

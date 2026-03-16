import PageHero from "@/components/PageHero";
import { brand } from "@/content/site";

export const metadata = {
  title: "Privacy Policy",
  description: "Read the Guardian Trust Federal Credit Union Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle={`Last updated: January 1, 2026`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal/privacy" },
          { label: "Privacy Policy" },
        ]}
      />

      <article
        className="py-16 bg-white"
        aria-labelledby="privacy-title"
      >
        <div className="container-site max-w-3xl prose prose-slate">
          <h2 id="privacy-title" className="text-2xl font-bold text-[#0d1f3c] mb-4">
            Our Commitment to Your Privacy
          </h2>
          <p className="text-[#52525b] leading-relaxed mb-6">
            {brand.name} (&ldquo;Guardian Trust,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, share, and safeguard information about you when you use our products, services, and website.
          </p>

          {[
            {
              title: "Information We Collect",
              content: "We collect information you provide directly — such as when you open an account, apply for a loan, or contact us. This may include your name, address, Social Security Number, date of birth, financial information, and contact details. We also collect information automatically when you use our digital banking services, including device information, IP addresses, and usage data.",
            },
            {
              title: "How We Use Your Information",
              content: "We use your information to open and service your accounts, process transactions, communicate with you, comply with legal and regulatory obligations, prevent fraud, and improve our products and services. We do not sell your personal information to third parties.",
            },
            {
              title: "Information Sharing",
              content: "We may share your information with affiliates, service providers, and partners who help us deliver our services — subject to strict confidentiality agreements. We may also disclose information as required by law, including in response to a court order or regulatory requirement.",
            },
            {
              title: "Your Rights and Choices",
              content: "You have the right to access, correct, and in certain cases, request deletion of your personal information. You may opt out of marketing communications at any time. To exercise these rights, contact us at the information below.",
            },
            {
              title: "Security",
              content: "We implement technical, administrative, and physical safeguards designed to protect your information. These include 256-bit encryption, multi-factor authentication, and regular security audits.",
            },
            {
              title: "Contact Us",
              content: `For privacy-related questions, contact our Privacy Officer at ${brand.address.street}, ${brand.address.city}, ${brand.address.state} ${brand.address.zip}, or call ${brand.supportPhone}.`,
            },
          ].map((section) => (
            <div key={section.title} className="mb-8">
              <h3 className="text-lg font-bold text-[#0d1f3c] mb-2">{section.title}</h3>
              <p className="text-[#52525b] leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}

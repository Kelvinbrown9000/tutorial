import PageHero from "@/components/PageHero";
import { brand } from "@/content/site";

export const metadata = {
  title: "Terms of Use",
  description: "Guardian Trust Federal Credit Union Website Terms of Use.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        title="Terms of Use"
        subtitle="Last updated: January 1, 2026"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal/terms" },
          { label: "Terms of Use" },
        ]}
      />
      <article className="py-16 bg-white" aria-labelledby="terms-title">
        <div className="container-site max-w-3xl">
          <h2 id="terms-title" className="text-2xl font-bold text-[#0d1f3c] mb-4">
            Agreement to Terms
          </h2>
          <p className="text-[#52525b] leading-relaxed mb-8">
            By accessing or using the {brand.name} website and digital banking services, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use immediately.
          </p>
          {[
            {
              title: "Permitted Use",
              content: "This website and its content are for lawful, personal, and informational purposes only. You may not use this site for any unlawful purpose or in a way that violates any applicable law or regulation.",
            },
            {
              title: "Intellectual Property",
              content: `All content on this website — including text, graphics, logos, icons, and images — is the property of ${brand.name} or its content suppliers and is protected by applicable intellectual property laws. Unauthorized use is prohibited.`,
            },
            {
              title: "Disclaimers",
              content: "Information on this site is provided for general informational purposes only and does not constitute financial, legal, or tax advice. Rates, terms, and product availability are subject to change. Contact us for current information.",
            },
            {
              title: "Limitation of Liability",
              content: `${brand.name} is not liable for any direct, indirect, incidental, or consequential damages resulting from your use of this website or its content.`,
            },
            {
              title: "Links to Third-Party Sites",
              content: "Our website may contain links to third-party websites. These links are provided for your convenience only. We do not endorse or control those sites and are not responsible for their content or practices.",
            },
            {
              title: "Changes to These Terms",
              content: "We reserve the right to update these Terms at any time. Continued use of the site after changes are posted constitutes acceptance of the revised Terms.",
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

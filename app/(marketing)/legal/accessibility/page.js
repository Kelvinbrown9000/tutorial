import PageHero from "@/components/PageHero";
import { brand } from "@/content/site";

export const metadata = {
  title: "Accessibility Statement",
  description: "Guardian Trust Federal Credit Union is committed to digital accessibility for people with disabilities.",
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="Accessibility Statement"
        subtitle="Guardian Trust is committed to ensuring our digital services are accessible to everyone."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal/accessibility" },
          { label: "Accessibility" },
        ]}
      />
      <article className="py-16 bg-white" aria-labelledby="a11y-title">
        <div className="container-site max-w-3xl">
          <h2 id="a11y-title" className="text-2xl font-bold text-[#0d1f3c] mb-4">
            Our Commitment
          </h2>
          <p className="text-[#52525b] leading-relaxed mb-8">
            {brand.name} is committed to providing a website and digital banking experience that is accessible to people with disabilities. We strive to conform to Level AA of the Web Content Accessibility Guidelines (WCAG) 2.1 published by the W3C.
          </p>
          {[
            {
              title: "Accessibility Features",
              content: "Our website includes: proper heading structure and landmark regions, keyboard navigation support for all interactive elements, meaningful alt text for images, sufficient color contrast ratios, resizable text without loss of functionality, and focus indicators for keyboard users.",
            },
            {
              title: "Known Limitations",
              content: "While we continually work to improve accessibility, some third-party content or older PDF documents may not fully meet WCAG 2.1 AA standards. We are actively working to resolve these issues.",
            },
            {
              title: "Feedback & Contact",
              content: `If you experience barriers accessing our website or have suggestions for improvement, please contact us at ${brand.supportPhone} or by mail at ${brand.address.street}, ${brand.address.city}, ${brand.address.state} ${brand.address.zip}. We aim to respond within 2 business days.`,
            },
            {
              title: "Technical Specifications",
              content: "This website is built using HTML5, JavaScript, and CSS. It relies on technologies including ARIA roles and attributes to enhance accessibility for screen reader users.",
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

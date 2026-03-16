import Link from "next/link";
import PageHero from "@/components/PageHero";
import { footerLinks, navItems } from "@/content/site";

export const metadata = {
  title: "Site Map",
  description: "Complete site map for Guardian Trust Federal Credit Union — find any page quickly.",
};

export default function SiteMapPage() {
  return (
    <>
      <PageHero
        title="Site Map"
        subtitle="A complete index of all pages on the Guardian Trust website."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Site Map" }]}
      />

      <section aria-labelledby="sitemap-heading" className="py-16 bg-white">
        <div className="container-site max-w-5xl">
          <h2 id="sitemap-heading" className="sr-only">All Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {navItems.map((section) => (
              <div key={section.label}>
                <Link href={section.href} className="text-lg font-bold text-[#0d1f3c] hover:text-[#1a4688] transition-colors block mb-3">
                  {section.label}
                </Link>
                <ul className="space-y-2 pl-1 border-l-2 border-[#daeaf7]">
                  {section.children?.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="text-sm text-[#52525b] hover:text-[#1a4688] pl-3 block py-0.5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-lg font-bold text-[#0d1f3c] mb-3">Company</p>
              <ul className="space-y-2 pl-1 border-l-2 border-[#daeaf7]">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#52525b] hover:text-[#1a4688] pl-3 block py-0.5 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-lg font-bold text-[#0d1f3c] mb-3">Legal</p>
              <ul className="space-y-2 pl-1 border-l-2 border-[#daeaf7]">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#52525b] hover:text-[#1a4688] pl-3 block py-0.5 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

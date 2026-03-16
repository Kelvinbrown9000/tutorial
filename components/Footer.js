import Link from "next/link";
import Logo from "./Logo";
import { brand, footerLinks, disclaimers } from "@/content/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1628] text-white" role="contentinfo">
      {/* Main footer grid */}
      <div className="container-site py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" aria-label="Guardian Trust Federal Credit Union — Home">
              <Logo className="h-10 w-auto text-white" />
            </Link>
            <p className="text-[#a8c8e8] text-sm leading-relaxed mt-4 max-w-xs">
              A member-owned, not-for-profit financial institution committed to
              the financial wellbeing of every person we serve.
            </p>
            <p className="text-[#52525b] text-xs mt-4">{disclaimers.fdic}</p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { label: "Facebook", href: brand.social.facebook, icon: <FbIcon /> },
                { label: "Twitter / X", href: brand.social.twitter, icon: <XIcon /> },
                { label: "Instagram", href: brand.social.instagram, icon: <IgIcon /> },
                { label: "LinkedIn", href: brand.social.linkedin, icon: <LiIcon /> },
                { label: "YouTube", href: brand.social.youtube, icon: <YtIcon /> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/08 flex items-center justify-center text-[#a1a1aa] hover:bg-[#1a4688] hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <FooterCol title="Products" links={footerLinks.products} />

          {/* Membership */}
          <FooterCol title="Membership" links={footerLinks.membership} />

          {/* Digital Banking */}
          <FooterCol title="Digital Banking" links={footerLinks.digital} />

          {/* Company */}
          <FooterCol title="Company" links={footerLinks.company} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/08">
        <div className="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#52525b] text-xs text-center sm:text-left">
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#52525b] text-xs hover:text-[#a8c8e8] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#4db87a] mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[#a8c8e8] text-sm hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Social icons
function FbIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>; }
function XIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function IgIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>; }
function LiIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }
function YtIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12z"/></svg>; }

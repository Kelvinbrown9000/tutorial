"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import MegaMenu from "./MegaMenu";
import GlobalSearch from "./GlobalSearch";
import { navItems } from "@/content/site";

export default function HeaderNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  return (
    <header
      className="bg-white sticky top-0 z-40 border-b border-[#e4e4e7]"
      style={{ boxShadow: "0 1px 0 0 rgb(0 0 0 / 0.08), 0 2px 8px 0 rgb(0 0 0 / 0.06)" }}
    >
      <div className="container-site flex items-center justify-between h-16 gap-4">
        {/* Logo */}
        <Link href="/" aria-label="Guardian Trust Federal Credit Union — Home" className="flex-shrink-0">
          <Logo className="h-10 w-auto text-[#0d1f3c]" />
        </Link>

        {/* Desktop nav */}
        <MegaMenu />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <GlobalSearch />

          <Link
            href="/signin"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border border-[#1a4688] text-[#1a4688] text-sm font-semibold hover:bg-[#f0f7ff] transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/membership/join"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-[#1f7f4a] text-white text-sm font-semibold hover:bg-[#155533] transition-colors"
          >
            Join Now
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-white border-t border-[#e4e4e7] max-h-[80vh] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          <div className="container-site py-4 flex flex-col gap-1">
            {navItems.map((item, i) => (
              <div key={item.label}>
                <button
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0d1f3c] hover:bg-[#f0f7ff] transition-colors"
                  onClick={() =>
                    setMobileExpanded(mobileExpanded === i ? null : i)
                  }
                  aria-expanded={mobileExpanded === i}
                >
                  {item.label}
                  <ChevronDown
                    className={`w-4 h-4 text-[#71717a] transition-transform ${
                      mobileExpanded === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileExpanded === i && item.children && (
                  <div className="ml-3 border-l-2 border-[#daeaf7] pl-3 mb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 px-2 text-sm text-[#18181b] hover:text-[#1a4688] rounded-md hover:bg-[#f0f7ff] transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-[#e4e4e7] flex flex-col gap-3">
              <Link
                href="/signin"
                className="flex items-center justify-center px-4 py-2.5 rounded-lg border border-[#1a4688] text-[#1a4688] text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/membership/join"
                className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#1f7f4a] text-white text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Join Now
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

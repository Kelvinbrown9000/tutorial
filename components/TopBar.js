"use client";

import Link from "next/link";
import { brand, announcement } from "@/content/site";

export default function TopBar() {
  return (
    <div className="bg-[#0a1628] text-white text-sm" role="banner">
      <div className="container-site flex items-center justify-between gap-4 py-2 flex-wrap">
        {/* Left: announcement */}
        {announcement.active && (
          <p className="text-[#85d4a8] font-medium truncate">
            {announcement.text}
            <Link
              href={announcement.linkHref}
              className="underline underline-offset-2 hover:text-white transition-colors ml-0.5"
            >
              {announcement.linkText}
            </Link>
          </p>
        )}

        {/* Right: phone + routing */}
        <div className="flex items-center gap-5 ml-auto flex-shrink-0">
          <a
            href={`tel:${brand.supportPhoneRaw}`}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
            aria-label={`24/7 Member Support: ${brand.supportPhone}`}
          >
            <PhoneIcon />
            <span className="hidden sm:inline">24/7 Support:&nbsp;</span>
            <span className="font-semibold">{brand.supportPhone}</span>
          </a>

          <span className="w-px h-4 bg-white/20" aria-hidden="true" />

          <span className="text-neutral-300 flex items-center gap-1.5">
            <RoutingIcon />
            <span className="hidden sm:inline">Routing:&nbsp;</span>
            <span className="font-semibold">{brand.routingNumber}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
    </svg>
  );
}

function RoutingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

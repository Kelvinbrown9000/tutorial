"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function StickyJoinButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed bottom-6 right-4 z-50" role="complementary" aria-label="Join prompt">
      <Link
        href="/membership/join"
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1f7f4a] text-white text-sm font-bold shadow-xl hover:bg-[#155533] transition-colors"
        style={{ boxShadow: "0 4px 20px 0 rgb(31 127 74 / 0.4)" }}
      >
        Join Now
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}

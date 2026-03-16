"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { navItems } from "@/content/site";

export default function MegaMenu() {
  const [activeIndex, setActiveIndex] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={menuRef}
      aria-label="Main navigation"
      className="hidden lg:flex items-center gap-0"
    >
      {navItems.map((item, i) => (
        <div key={item.label} className="relative">
          <button
            className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeIndex === i
                ? "text-[#2a9a5c] bg-navy-50"
                : "text-[#18181b] hover:text-[#1a4688] hover:bg-[#f0f7ff]"
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onFocus={() => setActiveIndex(i)}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            aria-expanded={activeIndex === i}
            aria-haspopup="true"
          >
            {item.label}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                activeIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown panel */}
          {activeIndex === i && item.children && (
            <div
              className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-[#e4e4e7] py-2 z-50"
              onMouseLeave={() => setActiveIndex(null)}
              role="menu"
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  className="flex flex-col px-4 py-3 hover:bg-[#f0f7ff] transition-colors group"
                  role="menuitem"
                  onClick={() => setActiveIndex(null)}
                >
                  <span className="text-sm font-semibold text-[#0d1f3c] group-hover:text-[#1a4688]">
                    {child.label}
                  </span>
                  {child.desc && (
                    <span className="text-xs text-[#71717a] mt-0.5">
                      {child.desc}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}

function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

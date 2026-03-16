"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { searchIndex } from "@/content/site";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const found = searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
    setResults(found.slice(0, 6));
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="Search"
        className="p-2 rounded-md text-[#52525b] hover:bg-[#f4f4f5] hover:text-[#1a4688] transition-colors"
        onClick={() => {
          setOpen(!open);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
      >
        <SearchIcon />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e4e4e7] z-50"
          role="search"
        >
          <div className="p-3">
            <label htmlFor="site-search" className="sr-only">
              Search Guardian Trust
            </label>
            <div className="flex items-center gap-2 border border-[#d4d4d8] rounded-lg px-3 py-2 focus-within:border-[#1a4688] focus-within:ring-1 focus-within:ring-[#1a4688]">
              <SearchIcon className="text-[#a1a1aa] flex-shrink-0" />
              <input
                id="site-search"
                ref={inputRef}
                type="search"
                placeholder="Search products, pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent text-[#18181b] placeholder:text-[#a1a1aa]"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[#a1a1aa] hover:text-[#52525b]"
                  aria-label="Clear search"
                >
                  <XIcon />
                </button>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <ul className="border-t border-[#e4e4e7] pb-2" role="listbox">
              {results.map((item) => (
                <li key={item.href} role="option">
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#f0f7ff] text-sm text-[#18181b] hover:text-[#1a4688] transition-colors"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <PageIcon />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {query.length >= 2 && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#71717a] border-t border-[#e4e4e7]">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg className="w-4 h-4 text-[#a1a1aa] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

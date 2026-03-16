"use client";

import { useState } from "react";

export default function Accordion({ items, className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={`divide-y divide-[#e4e4e7] rounded-2xl border border-[#e4e4e7] overflow-hidden ${className}`}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="bg-white">
            <h3>
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-[#0d1f3c] hover:bg-[#f0f7ff] transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`accordion-panel-${i}`}
                id={`accordion-btn-${i}`}
              >
                <span>{item.question}</span>
                <span
                  className={`flex-shrink-0 ml-4 w-6 h-6 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#1a4688] transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`accordion-panel-${i}`}
              role="region"
              aria-labelledby={`accordion-btn-${i}`}
              hidden={!isOpen}
            >
              <div className="px-6 pb-5 text-sm text-[#52525b] leading-relaxed border-t border-[#e4e4e7] pt-4">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

export default function Logo({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 48"
      aria-label="Guardian Trust Federal Credit Union"
      role="img"
      className={className}
      fill="none"
    >
      {/* Shield icon */}
      <path
        d="M20 4 L36 10 L36 24 C36 32 28 38 20 42 C12 38 4 32 4 24 L4 10 Z"
        fill="#2a9a5c"
      />
      <path
        d="M20 10 L30 14 L30 24 C30 29 25 33 20 36 C15 33 10 29 10 24 L10 14 Z"
        fill="#fff"
        opacity="0.15"
      />
      {/* Checkmark inside shield */}
      <polyline
        points="14,24 18,29 27,19"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Wordmark */}
      <text
        x="46"
        y="20"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="700"
        fontSize="14"
        fill="currentColor"
        letterSpacing="-0.3"
      >
        GUARDIAN TRUST
      </text>
      <text
        x="46"
        y="35"
        fontFamily="Inter, Arial, sans-serif"
        fontWeight="400"
        fontSize="10"
        fill="currentColor"
        opacity="0.75"
        letterSpacing="0.5"
      >
        FEDERAL CREDIT UNION
      </text>
    </svg>
  );
}

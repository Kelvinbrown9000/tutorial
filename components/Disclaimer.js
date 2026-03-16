export default function Disclaimer({ text, className = "" }) {
  return (
    <p
      className={`text-xs text-[#71717a] leading-relaxed ${className}`}
      role="note"
    >
      {text}
    </p>
  );
}

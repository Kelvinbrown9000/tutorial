import Breadcrumbs from "./Breadcrumbs";

export default function PageHero({ title, subtitle, breadcrumbs, cta }) {
  return (
    <div className="bg-gradient-to-br from-[#0d1f3c] to-[#1a4688] text-white">
      <div className="container-site py-12 lg:py-16">
        {breadcrumbs && (
          <div className="mb-4 [&_a]:text-[#a8c8e8] [&_span:not([aria-current])]:text-[#a8c8e8] [&_span[aria-current]]:text-white [&_svg]:text-[#6a9fd4]">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[#a8c8e8] text-lg max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {cta && <div className="mt-6">{cta}</div>}
      </div>
    </div>
  );
}

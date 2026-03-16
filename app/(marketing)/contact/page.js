import PageHero from "@/components/PageHero";
import { brand } from "@/content/site";

export const metadata = {
  title: "Contact Us",
  description:
    "Reach Guardian Trust Federal Credit Union by phone, secure message, or visit a branch. We're here 24/7 to help.",
};

const contactMethods = [
  {
    icon: "📞",
    title: "Phone Support",
    detail: brand.supportPhone,
    sub: "Available 24 hours a day, 7 days a week",
    action: { label: "Call Now", href: `tel:${brand.supportPhoneRaw}` },
  },
  {
    icon: "💬",
    title: "Secure Message",
    detail: "Sign in to send a message",
    sub: "Response within 1 business day",
    action: { label: "Sign In & Message", href: "/signin" },
  },
  {
    icon: "🏦",
    title: "Branch Locations",
    detail: "Multiple locations in the DC/VA area",
    sub: "Mon–Fri 9am–5pm · Sat 9am–1pm",
    action: { label: "Find a Branch", href: "#branches" },
  },
  {
    icon: "✉️",
    title: "Mail",
    detail: brand.address.street,
    sub: `${brand.address.city}, ${brand.address.state} ${brand.address.zip}`,
    action: null,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="We're Here to Help"
        subtitle="Real people, real answers. Reach us by phone, secure message, or in person at one of our branches."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <section aria-labelledby="contact-methods-heading" className="py-16 bg-[#f4f4f5]">
        <div className="container-site">
          <h2 id="contact-methods-heading" className="text-3xl font-bold text-[#0d1f3c] mb-10 text-center">
            How Would You Like to Connect?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {contactMethods.map((m) => (
              <div key={m.title} className="bg-white rounded-2xl border border-[#e4e4e7] p-6 flex flex-col" style={{ boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.06)" }}>
                <span className="text-3xl mb-3" aria-hidden="true">{m.icon}</span>
                <h3 className="font-bold text-[#0d1f3c] mb-1">{m.title}</h3>
                <p className="text-sm font-medium text-[#18181b] mb-0.5">{m.detail}</p>
                <p className="text-xs text-[#71717a] mb-4 flex-1">{m.sub}</p>
                {m.action && (
                  <a
                    href={m.action.href}
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#1a4688] text-white text-sm font-semibold hover:bg-[#0d1f3c] transition-colors"
                  >
                    {m.action.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branch locations placeholder */}
      <section id="branches" aria-labelledby="branches-heading" className="py-16 bg-white">
        <div className="container-site max-w-4xl">
          <h2 id="branches-heading" className="text-3xl font-bold text-[#0d1f3c] mb-8">
            Branch Locations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Main Branch", address: "1200 Guardian Way, Arlington, VA 22201", hours: "Mon–Fri 9am–5pm · Sat 9am–1pm" },
              { name: "Rosslyn Branch", address: "1900 Fort Myer Dr, Arlington, VA 22209", hours: "Mon–Fri 9am–5pm · Sat Closed" },
              { name: "Crystal City Branch", address: "2200 Crystal Dr, Arlington, VA 22202", hours: "Mon–Fri 9am–4:30pm · Sat 9am–12pm" },
            ].map((branch) => (
              <div key={branch.name} className="bg-[#f4f4f5] rounded-xl p-5 border border-[#e4e4e7]">
                <h3 className="font-bold text-[#0d1f3c] mb-1">{branch.name}</h3>
                <p className="text-sm text-[#52525b] mb-1">{branch.address}</p>
                <p className="text-xs text-[#71717a]">{branch.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

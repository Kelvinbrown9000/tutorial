# Guardian Trust Federal Credit Union — Marketing Website

A production-ready marketing website for **Guardian Trust Federal Credit Union**, built with Next.js 16 (App Router), JavaScript, and Tailwind CSS v4.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS v4 |
| Fonts | Inter (Google Fonts via next/font) |
| Runtime | Node.js 18+ |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9+

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
/
├── app/
│   ├── layout.js                 # Root layout (TopBar, Header, Footer, StickyJoin)
│   ├── page.js                   # Homepage
│   ├── checking/page.js
│   ├── savings/page.js
│   ├── credit-cards/page.js
│   ├── loans/page.js             # Loans overview
│   ├── loans/auto/page.js
│   ├── loans/mortgage/page.js
│   ├── loans/personal/page.js
│   ├── loans/home-equity/page.js
│   ├── membership/page.js
│   ├── membership/join/page.js
│   ├── rates/page.js
│   ├── mobile-online-banking/page.js
│   ├── contact/page.js
│   ├── site-map/page.js
│   ├── security/page.js
│   ├── signin/page.js
│   ├── business/page.js
│   ├── investments/page.js
│   ├── advice/page.js
│   └── legal/{privacy,terms,accessibility}/page.js
│
├── components/
│   ├── Logo.js                   # SVG wordmark shield + text
│   ├── TopBar.js                 # Utility bar: phone, routing, announcement
│   ├── HeaderNav.js              # Sticky header + mobile drawer
│   ├── MegaMenu.js               # Desktop dropdown mega-menu
│   ├── GlobalSearch.js           # Client-side search (JSON index)
│   ├── Hero.js                   # Homepage hero + SVG banking illustration
│   ├── ProductGrid.js            # 6-product category cards
│   ├── RatesTeaser.js            # Today's Rates module
│   ├── EligibilityBanner.js      # Membership eligibility + stats
│   ├── FeatureSection.js         # Digital banking + phone mockup SVG
│   ├── SecurityCallout.js        # NCUA badge + security features
│   ├── AdviceSection.js          # Advice & planning cards
│   ├── Footer.js                 # Full footer with social icons
│   ├── Accordion.js              # Accessible FAQ accordion
│   ├── Breadcrumbs.js            # Schema.org breadcrumb nav
│   ├── PageHero.js               # Inner page hero with breadcrumbs slot
│   ├── Disclaimer.js             # APY/APR disclaimer text
│   └── StickyJoinButton.js       # Mobile floating "Join Now" button
│
├── content/
│   └── site.js                   # Central brand config, nav, rates, copy
│
└── public/                       # Static assets
```

---

## Customization

All brand content lives in **`content/site.js`**:

```js
export const brand = {
  name: "Guardian Trust Federal Credit Union",
  supportPhone: "(800) 555-4827",
  routingNumber: "321170839",
  federallyInsured: true,
  // ...
};

export const rates = [ /* edit rates here */ ];
export const announcement = { active: true, text: "...", linkHref: "..." };
```

---

## Design System

Custom design tokens are defined in `app/globals.css` via Tailwind CSS v4 `@theme inline`:

- `--color-navy-*` — deep navy primary palette (50–950)
- `--color-trust-*` — trust green accent palette (50–900)
- `--color-gold-*` — gold highlight palette
- `--color-neutral-*` — neutral gray palette

---

## Accessibility

- Skip-to-content link at top of every page
- Semantic HTML landmarks (`header`, `main`, `nav`, `footer`, `section`, `article`)
- ARIA roles, `aria-expanded`, `aria-label`, `aria-current` throughout
- Keyboard-navigable mega menu and accordion
- `focus-visible` ring on all interactive elements
- `aria-hidden="true"` on all decorative SVGs
- Schema.org `BreadcrumbList` microdata on all inner pages

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage (Hero, Products, Rates, Eligibility, Digital, Security, Advice) |
| `/checking` | Checking account comparison |
| `/savings` | Savings, money market, certificates |
| `/credit-cards` | Visa credit card lineup |
| `/loans` | Loans overview |
| `/loans/auto` | Auto loan rates table + FAQ |
| `/loans/mortgage` | Mortgage products + FAQ |
| `/loans/personal` | Personal loan details |
| `/loans/home-equity` | HELOC and home equity |
| `/membership` | Eligibility + benefits |
| `/membership/join` | Join / apply flow |
| `/rates` | Full rates tables |
| `/mobile-online-banking` | Digital banking features + FAQ |
| `/contact` | Contact methods and branches |
| `/security` | Security center + fraud alerts |
| `/site-map` | Full page index |
| `/signin` | Sign-in page |
| `/business` | Business banking stub |
| `/investments` | Investments & insurance stub |
| `/advice` | Advice & planning resources |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of use |
| `/legal/accessibility` | Accessibility statement |

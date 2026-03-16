// Guardian Trust Federal Credit Union — Central Content Configuration
// Edit this file to update brand, contact, rates, and copy across the site.

export const brand = {
  name: "Guardian Trust Federal Credit Union",
  shortName: "Guardian Trust",
  tagline: "Banking Built on Trust. Powered by Service.",
  supportPhone: "(800) 555-4827",
  supportPhoneRaw: "18005554827",
  supportEmail: "support@guardiantrustfederal.org",
  routingNumber: "321170839",
  federallyInsured: true,
  insurer: "NCUA",
  founded: 1948,
  memberCount: "240,000+",
  assetSize: "$3.2 Billion",
  address: {
    street: "1200 Guardian Way, Suite 100",
    city: "Arlington",
    state: "VA",
    zip: "22201",
  },
  social: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#",
  },
};

export const disclaimers = {
  apyGeneral:
    "APY = Annual Percentage Yield. APR = Annual Percentage Rate. Rates are effective as of the date shown and subject to change without notice. All accounts subject to approval. Membership required.",
  loanGeneral:
    "All loan products are subject to credit approval. Rates, terms, and conditions vary based on creditworthiness and other factors. Not all applicants will qualify for the lowest rate.",
  mortgageGeneral:
    "Mortgage rates are subject to change daily. Rates displayed are for illustrative purposes only. Contact a loan officer for current rates and to determine your eligibility.",
  fdic: brand.federallyInsured
    ? `Federally insured by the ${brand.insurer} up to $250,000 per depositor.`
    : "Deposits not federally insured.",
};

export const membershipEligibility = [
  "Active duty military, veterans, and their immediate family members",
  "Employees of select employer groups (SEGs) in our service area",
  "Residents and workers in participating counties and communities",
  "Family members of current Guardian Trust members",
  "Retirees from qualifying government and federal agencies",
];

export const rates = [
  {
    label: "High-Yield Savings",
    value: "4.75%",
    unit: "APY",
    note: "On balances $500+",
  },
  {
    label: "30-Year Fixed Mortgage",
    value: "6.49%",
    unit: "APR",
    note: "As low as",
  },
  {
    label: "New Auto Loan",
    value: "5.24%",
    unit: "APR",
    note: "Up to 60 months",
  },
  {
    label: "Personal Loan",
    value: "8.99%",
    unit: "APR",
    note: "Starting from",
  },
  {
    label: "Rewards Credit Card",
    value: "14.99%",
    unit: "APR",
    note: "Variable rate",
  },
];

export const navItems = [
  {
    label: "Loans",
    href: "/loans",
    children: [
      { label: "Auto Loans", href: "/loans/auto", desc: "New & used vehicle financing" },
      { label: "Mortgage", href: "/loans/mortgage", desc: "Home purchase & refinance" },
      { label: "Personal Loans", href: "/loans/personal", desc: "Borrow for any purpose" },
      { label: "Home Equity", href: "/loans/home-equity", desc: "Leverage your home's value" },
    ],
  },
  {
    label: "Checking & Savings",
    href: "/checking",
    children: [
      { label: "Checking Accounts", href: "/checking", desc: "Everyday spending accounts" },
      { label: "Savings Accounts", href: "/savings", desc: "Grow your savings" },
      { label: "Money Market", href: "/savings#money-market", desc: "Higher yields, easy access" },
      { label: "Certificates (CDs)", href: "/savings#certificates", desc: "Lock in great rates" },
    ],
  },
  {
    label: "Cards",
    href: "/credit-cards",
    children: [
      { label: "Rewards Visa", href: "/credit-cards#rewards", desc: "Earn points on everything" },
      { label: "Cash Back Card", href: "/credit-cards#cashback", desc: "Unlimited cash back" },
      { label: "Secured Card", href: "/credit-cards#secured", desc: "Build or rebuild credit" },
    ],
  },
  {
    label: "Business",
    href: "/business",
    children: [
      { label: "Business Checking", href: "/business#checking", desc: "Accounts for your business" },
      { label: "Business Loans", href: "/business#loans", desc: "Grow with confidence" },
    ],
  },
  {
    label: "Investments",
    href: "/investments",
    children: [
      { label: "IRAs", href: "/investments#ira", desc: "Retirement savings accounts" },
      { label: "Insurance", href: "/investments#insurance", desc: "Protect what matters most" },
    ],
  },
  {
    label: "Membership",
    href: "/membership",
    children: [
      { label: "Eligibility", href: "/membership#eligibility", desc: "See if you qualify" },
      { label: "How to Join", href: "/membership/join", desc: "Open an account today" },
      { label: "Member Benefits", href: "/membership#benefits", desc: "Exclusive perks for members" },
    ],
  },
  {
    label: "Advice",
    href: "/advice",
    children: [
      { label: "Financial Education", href: "/advice#education", desc: "Learn and grow" },
      { label: "Calculators", href: "/advice#calculators", desc: "Plan your finances" },
      { label: "Blog", href: "/advice#blog", desc: "Tips and insights" },
    ],
  },
  {
    label: "Digital Banking",
    href: "/mobile-online-banking",
    children: [
      { label: "Mobile App", href: "/mobile-online-banking#app", desc: "Bank on the go" },
      { label: "Online Banking", href: "/mobile-online-banking#online", desc: "Full-featured web banking" },
      { label: "Bill Pay", href: "/mobile-online-banking#billpay", desc: "Pay bills automatically" },
      { label: "Zelle", href: "/mobile-online-banking#zelle", desc: "Send money instantly" },
    ],
  },
];

export const footerLinks = {
  products: [
    { label: "Checking Accounts", href: "/checking" },
    { label: "Savings Accounts", href: "/savings" },
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Auto Loans", href: "/loans/auto" },
    { label: "Mortgages", href: "/loans/mortgage" },
    { label: "Personal Loans", href: "/loans/personal" },
  ],
  membership: [
    { label: "Eligibility", href: "/membership#eligibility" },
    { label: "How to Join", href: "/membership/join" },
    { label: "Member Benefits", href: "/membership#benefits" },
    { label: "Rates", href: "/rates" },
  ],
  digital: [
    { label: "Mobile Banking", href: "/mobile-online-banking" },
    { label: "Online Banking", href: "/mobile-online-banking#online" },
    { label: "Bill Pay", href: "/mobile-online-banking#billpay" },
  ],
  company: [
    { label: "Contact Us", href: "/contact" },
    { label: "Security Center", href: "/security" },
    { label: "Site Map", href: "/site-map" },
    { label: "Careers", href: "#" },
    { label: "About Us", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Use", href: "/legal/terms" },
    { label: "Accessibility", href: "/legal/accessibility" },
  ],
};

export const searchIndex = [
  { title: "Home", href: "/", keywords: "home banking credit union" },
  { title: "Checking Accounts", href: "/checking", keywords: "checking account free debit card" },
  { title: "Savings Accounts", href: "/savings", keywords: "savings high yield apy interest" },
  { title: "Credit Cards", href: "/credit-cards", keywords: "credit card rewards cash back visa" },
  { title: "Auto Loans", href: "/loans/auto", keywords: "auto loan car vehicle financing" },
  { title: "Mortgage", href: "/loans/mortgage", keywords: "mortgage home loan purchase refinance" },
  { title: "Personal Loans", href: "/loans/personal", keywords: "personal loan borrow cash" },
  { title: "Membership", href: "/membership", keywords: "join membership eligibility how to join" },
  { title: "Rates", href: "/rates", keywords: "rates apy apr interest current today" },
  { title: "Mobile Banking", href: "/mobile-online-banking", keywords: "mobile app online banking digital" },
  { title: "Contact", href: "/contact", keywords: "contact phone branch location support" },
  { title: "Security Center", href: "/security", keywords: "security fraud alerts identity protection" },
  { title: "Privacy Policy", href: "/legal/privacy", keywords: "privacy data policy" },
  { title: "Terms of Use", href: "/legal/terms", keywords: "terms conditions use" },
  { title: "Accessibility", href: "/legal/accessibility", keywords: "accessibility ada wcag" },
  { title: "Site Map", href: "/site-map", keywords: "sitemap all pages" },
];

export const announcement = {
  active: true,
  text: "Limited-time offer: New members earn a $200 bonus with qualifying direct deposit. ",
  linkText: "Learn More",
  linkHref: "/membership/join",
};

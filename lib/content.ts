/**
 * BLACK CIRCLE — Conteúdo central
 * Edita todo o texto do site aqui. Preparado para futura migração
 * para um CMS headless (Sanity / Strapi / Contentful / Supabase):
 * cada export corresponde a um documento/coleção.
 */

export const site = {
  name: "BLACK CIRCLE",
  title: "Black Circle | Private Business Group",
  description:
    "Black Circle is a privately built business ecosystem operating across talent, automotive, property, fashion and emerging ventures.",
  url: "https://blackcircle.pt",
  tagline: "PRIVATE BY NATURE. GLOBAL BY VISION.",
};

export const intro = {
  wordmark: "BLACK CIRCLE",
  phrase: "NOT EVERYONE GETS IN",
  skip: "SKIP INTRO",
  enterHint: "CLICK OR SCROLL TO ENTER",
  sound: { on: "SOUND ON", off: "SOUND OFF" },
};

export const nav = {
  links: [
    { label: "The Circle", href: "#the-circle" },
    { label: "Companies", href: "#our-world" },
    { label: "Philosophy", href: "#philosophy" },
    { label: "Founders", href: "#founders" },
    { label: "Contact", href: "#contact" },
  ],
  cta: "ENTER THE CIRCLE",
};

export const hero = {
  headline: ["BUILDING", "BEYOND", "INDUSTRIES."],
  sub: "Black Circle is a privately built business ecosystem operating across talent, automotive, property, fashion and emerging ventures.",
  primary: { label: "EXPLORE THE CIRCLE", href: "#the-circle" },
  secondary: { label: "OUR COMPANIES", href: "#our-world" },
};

export const theCircle = {
  eyebrow: "THE CIRCLE",
  lines: [
    "Black Circle is an independent business group built around vision, culture, access and long-term value.",
    "We create, operate and develop brands across industries, while preserving a single standard: distinction.",
  ],
};

export type Sector = {
  id: string;
  name: string;
  description: string;
  brand?: string;
  status?: string;
};

export const ourWorld: { eyebrow: string; sectors: Sector[] } = {
  eyebrow: "OUR WORLD",
  sectors: [
    {
      id: "talent",
      name: "TALENT",
      description: "Representation, management and development of talent and creators.",
      status: "CONTACT",
    },
    {
      id: "automotive",
      name: "AUTOMOTIVE",
      description: "Consulting, import and sale of premium automobiles.",
      status: "CONTACT",
    },
    {
      id: "property",
      name: "PROPERTY",
      description:
        "Interior and exterior design, construction oversight and budgeting. International expansion already underway.",
      status: "CONTACT",
    },
    {
      id: "fashion",
      name: "FASHION",
      description: "Fashion, apparel and lifestyle.",
      status: "CONTACT",
    },
    {
      id: "digital",
      name: "DIGITAL",
      description: "Digital commerce and new online ventures.",
      status: "CONTACT",
    },
    {
      id: "ventures",
      name: "VENTURES",
      description: "New projects, partnerships and strategic opportunities.",
      status: "CONTACT",
    },
  ],
};

export const philosophy = {
  statement: ["WE DO NOT FOLLOW INDUSTRIES.", "WE BUILD INSIDE THEM."],
  intro:
    "Most companies adapt to the market. We build the conditions the market later adapts to.",
  principles: [
    {
      numeral: "I",
      name: "VISION",
      text: "We identify value years before it becomes obvious to everyone else.",
    },
    {
      numeral: "II",
      name: "CULTURE",
      text: "We build brands people choose to belong to, not just buy from.",
    },
    {
      numeral: "III",
      name: "CONTROL",
      text: "We hold every level of the operation, so the standard never slips.",
    },
  ],
};

export const founders = {
  eyebrow: "FOUNDERS",
  people: [
    { name: "FRANCISCO MARQUES", role: "CO-FOUNDER" },
    { name: "YOHANN SILVA", role: "CO-FOUNDER" },
  ],
  phrase: "Built from ambition. Structured for scale.",
};

export const manifesto = {
  lines: [
    "A circle is more than a shape.",
    "It represents access.",
    "Trust.",
    "Movement.",
    "Power.",
    "Black Circle was built for those who understand that the strongest opportunities are rarely found in public.",
    "They are created inside.",
  ],
  closing: "WELCOME TO THE CIRCLE.",
};

export const contact = {
  eyebrow: "ACCESS",
  headline: "REQUEST ACCESS",
  sub: "Black Circle operates by introduction and intent. Tell us who you are and where you belong.",
  fields: {
    name: "Name",
    company: "Company",
    email: "Email",
    area: "Area of interest",
    message: "Message",
  },
  areas: [
    "Talent",
    "Automotive",
    "Property",
    "Fashion",
    "Partnerships",
    "Investments",
    "Other",
  ],
  cta: "REQUEST ACCESS",
  success: "Request received. The Circle will reach you.",
};

export const footer = {
  links: [
    { label: "About", href: "#the-circle" },
    { label: "Companies", href: "#our-world" },
    { label: "Ventures", href: "#our-world" },
    { label: "Contact", href: "#contact" },
    { label: "Instagram", href: "https://instagram.com", external: true },
    { label: "LinkedIn", href: "https://linkedin.com", external: true },
  ],
  tagline: "PRIVATE BY NATURE. GLOBAL BY VISION.",
  copyright: `© ${new Date().getFullYear()} Black Circle. All rights reserved.`,
};

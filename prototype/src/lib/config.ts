import type { KitchenEnquiry, ChatSession } from "./models";
export const OPTIONS = {
  projectType: [
    "Complete kitchen renovation",
    "New custom kitchen",
    "Kitchen facelift",
    "Custom cabinetry",
    "Not sure yet",
  ],
  layout: [
    "L-shaped",
    "U-shaped",
    "Galley",
    "Straight/single-wall",
    "Island kitchen",
    "Not sure",
  ],
  style: [
    "Contemporary",
    "Classic / shaker",
    "Warm minimal",
    "Coastal",
    "Not sure yet",
  ],
  finish: ["Matte", "Satin", "Timber look", "Gloss", "Open to advice"],
  benchtop: [
    "Porcelain",
    "Natural stone",
    "Laminate",
    "Solid surface",
    "Open to advice",
  ],
  colour: [
    "Warm white",
    "Natural oak",
    "Soft grey",
    "Deep charcoal",
    "Open to advice",
  ],
  storage: [
    "Deep drawers",
    "Pull-out pantry",
    "Corner storage",
    "Appliance cupboard",
    "Open shelving",
  ],
  budget: [
    "Under AUD 20,000",
    "AUD 20,000–35,000",
    "AUD 35,000–50,000",
    "Over AUD 50,000",
    "Not sure yet",
  ],
  timeline: [
    "As soon as possible",
    "Within 3 months",
    "3–6 months",
    "More than 6 months",
    "Just exploring",
  ],
  contactMethod: ["Email", "Phone"],
};
export const STEP_TITLES = [
  "Your project",
  "Kitchen layout",
  "Measurements",
  "Style & finishes",
  "Your budget",
  "Your timeline",
  "Photos & inspiration",
  "Contact details",
  "Review your brief",
];
export const PLANNER_SCREENS = [
  { step: 0, title: "Your kitchen", validates: [0, 1] },
  { step: 2, title: "Style & details", validates: [2, 3] },
  { step: 4, title: "Budget & timing", validates: [4, 5] },
  { step: 6, title: "Photos & contact", validates: [6, 7] },
  { step: 8, title: "Review & finish", validates: [] },
] as const;
export function emptyEnquiry(): KitchenEnquiry {
  return {
    projectType: "",
    layout: "",
    length: "",
    width: "",
    unit: "metres",
    measurementNotes: "",
    style: "",
    finish: "Open to advice",
    benchtop: "Open to advice",
    colour: "Open to advice",
    storage: [],
    appliances: "",
    budget: "",
    timeline: "",
    references: [],
    customer: {
      name: "",
      email: "",
      phone: "",
      suburb: "",
      contactMethod: "Email",
    },
    comments: "",
    consent: false,
  };
}
export const SAMPLE: KitchenEnquiry = {
  ...emptyEnquiry(),
  projectType: "Complete kitchen renovation",
  layout: "Island kitchen",
  length: "4.5",
  width: "3.6",
  style: "Warm minimal",
  finish: "Matte",
  benchtop: "Porcelain",
  colour: "Warm white",
  storage: ["Deep drawers", "Pull-out pantry"],
  appliances: "Keep the fridge; allow for a new induction cooktop.",
  budget: "AUD 35,000–50,000",
  timeline: "Within 3 months",
  references: [
    {
      id: "sample-ref",
      name: "Fictional inspiration reference",
      src: "/images/kitchen-hero.jpg",
      kind: "sample",
      size: 0,
    },
  ],
  customer: {
    name: "Alex Morgan (Demo)",
    email: "alex.morgan@example.com",
    phone: "0400 000 000",
    suburb: "Kellyville",
    contactMethod: "Email",
  },
  comments:
    "Fictional enquiry: a welcoming kitchen with room for the family to gather.",
  consent: true,
};
export function newChat(): ChatSession {
  return {
    id:
      "chat-" +
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : "initial"),
    captured: {},
    pending: null,
    messages: [
      {
        id: "welcome",
        role: "assistant",
        text: "Hi, I’m your kitchen planning assistant. Let’s turn your ideas into a clear plan. What would you like help with?",
        actions: [
          "What services are offered?",
          "How does the design process work?",
          "I want to start a kitchen project",
        ],
      },
    ],
  };
}
export const KNOWLEDGE = [
  {
    intent: "services",
    pattern: /service|renovat|cabinet|joinery|facelift|custom/i,
    reply:
      "The public website describes complete kitchen builds, kitchen facelifts, custom joinery, 3D interior design and shop fitting. What kind of project are you considering?",
    actions: [
      "Complete kitchen renovation",
      "Kitchen facelift",
      "Custom cabinetry",
    ],
  },
  {
    intent: "process",
    pattern:
      /process|design process|consult|measure|quote|quotation|information/i,
    reply:
      "It starts with a site discussion, then a 3D design to review before your kitchen is made. Your project brief helps the team understand your layout, style and budget. A site assessment is needed before a quote.",
    actions: ["Plan my kitchen", "What should I upload?"],
  },
  {
    intent: "photos",
    pattern: /photo|upload|image|sketch/i,
    reply:
      "Yes! Add kitchen photos, sketches or inspiration in Photos & contact. They’re optional and stay in your browser for this demo.",
    actions: ["Plan my kitchen"],
  },
  {
    intent: "materials",
    pattern: /material|finish|benchtop|colour|color|style/i,
    reply:
      "The enquiry lets you explore style and finish preferences. Its options are illustrative, and do not confirm the business supplies a particular material. Specific product suitability and availability need confirmation with the team.",
    actions: ["Plan my kitchen", "How does the design process work?"],
  },
  {
    intent: "budget",
    pattern: /cost|price|budget|expensive/i,
    reply:
      "Costs depend on the space and scope. I can record an approximate AUD budget category for the brief; it is not a price or quote. What budget would you like to plan around?",
    actions: OPTIONS.budget,
  },
  {
    intent: "contact",
    pattern: /contact|phone|email|team|warrant|available|booking/i,
    reply:
      "The public contact page lists 1800 500 555 and info@onestopcabinets.com.au. This independent demo cannot book a visit, confirm availability or send a message. You can prepare a local project brief or visit the official contact page.",
    actions: ["Plan my kitchen", "Official contact page"],
  },
] as const;

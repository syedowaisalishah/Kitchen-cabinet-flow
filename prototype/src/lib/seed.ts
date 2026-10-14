import { emptyEnquiry, newChat, SAMPLE } from "./config";
import {
  PROJECT_STAGES,
  type DemoData,
  type Lead,
  type LeadStage,
} from "./models";
export function seedData(): DemoData {
  const people: [string, string, LeadStage, string, string][] = [
    [
      "Emma Wilson",
      "Castle Hill",
      "Qualified",
      "AUD 35,000–50,000",
      "Island kitchen",
    ],
    [
      "Daniel Chen",
      "Parramatta",
      "New enquiry",
      "AUD 20,000–35,000",
      "L-shaped",
    ],
    [
      "Olivia Taylor",
      "Lane Cove",
      "Consultation scheduled",
      "Over AUD 50,000",
      "U-shaped",
    ],
    ["James Patel", "Kellyville", "Won", "AUD 35,000–50,000", "Island kitchen"],
    [
      "Sophie Miller",
      "Ryde",
      "Quotation pending",
      "AUD 20,000–35,000",
      "Galley",
    ],
    [
      "Noah Bennett",
      "St Ives",
      "Design discussion",
      "Over AUD 50,000",
      "L-shaped",
    ],
    [
      "Charlotte Lee",
      "Baulkham Hills",
      "Contact pending",
      "Under AUD 20,000",
      "Straight/single-wall",
    ],
    ["Oliver Hughes", "Hornsby", "Won", "AUD 35,000–50,000", "U-shaped"],
  ];
  const leads: Lead[] = people.map(
    ([name, suburb, stage, budget, layout], i) => ({
      id: "lead-demo-" + (i + 1),
      stage,
      createdAt: `2026-10-${String(14 - i).padStart(2, "0")}T00:00:00Z`,
      source: i % 2 ? "Smart enquiry" : "Kitchen assistant",
      enquiry: {
        ...structuredClone(SAMPLE),
        layout,
        budget,
        customer: {
          name,
          suburb,
          email: name.toLowerCase().replace(" ", ".") + "@example.com",
          phone: "0400 000 000",
          contactMethod: "Email",
        },
      },
      chatSummary:
        i % 2
          ? undefined
          : "Fictional conversation: explored renovation options, selected a layout and requested a design discussion.",
      tasks: [
        {
          id: `follow-${i}`,
          text: "Review project brief and follow up",
          done: stage === "Won",
        },
      ],
      activity: [
        {
          id: `seed-${i}`,
          at: "2026-10-14T00:00:00Z",
          text: "Fictional sample lead added to the demonstration",
        },
      ],
    }),
  );
  return {
    version: 1,
    leads,
    draft: emptyEnquiry(),
    step: 0,
    chat: newChat(),
    projects: [
      {
        id: "OSC-DEMO-101",
        leadId: "lead-demo-4",
        stage: PROJECT_STAGES[9],
        assignee: "Jordan · Production",
        milestoneDates: {
          "Design approved": "2026-10-05",
          Manufacturing: "2026-10-14",
          "Installation scheduled": "2026-11-03",
          "Project handover": "2026-11-10",
        },
        tasks: [
          { id: "p1", text: "Confirm cabinet dimensions", done: true },
          { id: "p2", text: "Review production checklist", done: false },
          { id: "p3", text: "Complete quality inspection", done: false },
        ],
        notes: [
          "Fictional project. Warm white cabinets with an island for family meals.",
        ],
        activity: [
          {
            id: "a1",
            at: "2026-10-14T00:00:00Z",
            text: "Project moved to Manufacturing",
          },
        ],
      },
      {
        id: "OSC-DEMO-102",
        leadId: "lead-demo-8",
        stage: PROJECT_STAGES[11],
        assignee: "Casey · Installation",
        milestoneDates: {
          "Installation scheduled": "2026-10-21",
          "Project handover": "2026-10-28",
        },
        tasks: [
          { id: "p4", text: "Check site access", done: true },
          { id: "p5", text: "Confirm installation checklist", done: false },
        ],
        notes: [],
        activity: [
          {
            id: "a2",
            at: "2026-10-13T00:00:00Z",
            text: "Installation planning started",
          },
        ],
      },
    ],
  };
}

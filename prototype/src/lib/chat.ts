import { KNOWLEDGE, OPTIONS } from "./config";
import type { ChatSession, KitchenEnquiry } from "./models";
export function replyTo(
  input: string,
  session: ChatSession,
): {
  text: string;
  actions: string[];
  captured: Partial<KitchenEnquiry>;
  pending: ChatSession["pending"];
} {
  const captured = structuredClone(session.captured);
  let pending = session.pending;
  const customer = {
    name: "",
    email: "",
    phone: "",
    suburb: "",
    contactMethod: "Email",
    ...captured.customer,
  };
  const name = input.match(
    /(?:my name is|i am|i'm|name:)\s+([a-z][a-z .'-]{1,55}?)(?=\s+(?:and|my|email|phone|i want)|[,;]|$)/i,
  );
  const email = input.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  const phone = input.match(/(?:\+61|0)[\d ()-]{8,15}/);
  if (name) customer.name = name[1].trim();
  if (email) customer.email = email[0];
  if (phone) customer.phone = phone[0].trim();
  if (name || email || phone) captured.customer = customer;
  const layout =
    OPTIONS.layout.find(
      (v) => v !== "Not sure" && input.toLowerCase().includes(v.toLowerCase()),
    ) ||
    (/single.wall|straight/i.test(input)
      ? "Straight/single-wall"
      : /island/i.test(input)
        ? "Island kitchen"
        : undefined);
  if (layout) captured.layout = layout;
  const type = OPTIONS.projectType.find((v) =>
    input.toLowerCase().includes(v.toLowerCase()),
  );
  if (type) captured.projectType = type;
  const budget = OPTIONS.budget.find((v) =>
    input.toLowerCase().includes(v.toLowerCase()),
  );
  if (budget) captured.budget = budget;
  else {
    const amount = input.match(
      /(?:\$|aud\s*|budget(?: is| of)?\s*)(\d[\d,]*)(k)?/i,
    );
    if (amount) {
      const n = Number(amount[1].replaceAll(",", "")) * (amount[2] ? 1000 : 1);
      if (n > 0)
        captured.budget =
          n < 20000
            ? OPTIONS.budget[0]
            : n <= 35000
              ? OPTIONS.budget[1]
              : n <= 50000
                ? OPTIONS.budget[2]
                : OPTIONS.budget[3];
    }
  }
  const timeline = OPTIONS.timeline.find((v) =>
    input.toLowerCase().includes(v.toLowerCase()),
  );
  if (timeline) captured.timeline = timeline;
  if (pending) {
    if (pending === "name" && !customer.name && !email && !phone) {
      if (input.trim().length < 2)
        return {
          text: "Please enter a name, or open the enquiry to continue there.",
          actions: ["Plan my kitchen"],
          captured,
          pending,
        };
      customer.name = input.trim().slice(0, 80);
      captured.customer = customer;
    }
    if (pending === "email" && !customer.email)
      return {
        text: "Please use an email like alex@example.com. Fictional contact details are best for this demo.",
        actions: ["Plan my kitchen"],
        captured,
        pending,
      };
    if (pending === "phone" && !customer.phone)
      return {
        text: "Please enter a phone number, or continue straight to the enquiry form.",
        actions: ["Plan my kitchen"],
        captured,
        pending,
      };
    if (pending === "layout" && !captured.layout) {
      if (/not sure/i.test(input)) captured.layout = "Not sure";
      else
        return {
          text: "Which layout is closest to your space?",
          actions: OPTIONS.layout,
          captured,
          pending,
        };
    }
    if (pending === "budget" && !captured.budget)
      return {
        text: "Choose a budget category below. These are planning ranges, not quotations.",
        actions: OPTIONS.budget,
        captured,
        pending,
      };
    if (pending === "timeline" && !captured.timeline)
      return {
        text: "When would you like to begin?",
        actions: OPTIONS.timeline,
        captured,
        pending,
      };
    pending = null;
    if (!customer.email)
      return {
        text: `Thanks${customer.name ? ", " + customer.name : ""}. What email should be included in your demo brief?`,
        actions: ["Plan my kitchen"],
        captured,
        pending: "email",
      };
    if (!customer.phone)
      return {
        text: "What phone number should be included? Use fictional details, such as 0400 000 000.",
        actions: ["Plan my kitchen"],
        captured,
        pending: "phone",
      };
    if (!captured.layout)
      return {
        text: "Which layout are you thinking of?",
        actions: OPTIONS.layout,
        captured,
        pending: "layout",
      };
    if (!captured.budget)
      return {
        text: "What approximate budget would you like to plan around?",
        actions: OPTIONS.budget,
        captured,
        pending: "budget",
      };
    if (!captured.timeline)
      return {
        text: "When would you like to begin?",
        actions: OPTIONS.timeline,
        captured,
        pending: "timeline",
      };
    return {
      text: "Your starting details are ready. Open the enquiry and I’ll carry them across, so you can focus on measurements, style and inspiration.",
      actions: ["Plan my kitchen"],
      captured,
      pending: null,
    };
  }
  if (
    /start.*project|someone.*contact|help.*plan|i want.*kitchen/i.test(input)
  ) {
    captured.projectType =
      captured.projectType || "Complete kitchen renovation";
    if (customer.name)
      return {
        text: `Thanks, ${customer.name}. What email should be included in the brief?`,
        actions: ["Plan my kitchen"],
        captured,
        pending: "email",
      };
    return {
      text: "Let’s put a useful brief together. What is your name? Please use fictional details while exploring this demo.",
      actions: ["Plan my kitchen"],
      captured,
      pending: "name",
    };
  }
  if (layout)
    return {
      text: `I’ve added ${layout.toLowerCase()} to your brief. A designer would assess your dimensions and how you use the space before recommending a final layout. Would you like to continue planning?`,
      actions: ["Plan my kitchen", "What information do I need for a quote?"],
      captured,
      pending: null,
    };
  if (budget || captured.budget !== session.captured.budget)
    return {
      text: `I’ve recorded ${captured.budget} as your planning category. This is not a price estimate. You can refine it in your enquiry.`,
      actions: ["Plan my kitchen"],
      captured,
      pending: null,
    };
  const knowledge = KNOWLEDGE.find((k) => k.pattern.test(input));
  if (knowledge)
    return {
      text: knowledge.reply,
      actions: [...knowledge.actions],
      captured,
      pending: knowledge.intent === "budget" ? "budget" : null,
    };
  return {
    text: "I can help with kitchen services, layouts, the design process and preparing a project brief. I can’t verify that specific detail in this prototype. The official team can confirm it, or you can add it as a question in your enquiry.",
    actions: ["Plan my kitchen", "Official contact page"],
    captured,
    pending: null,
  };
}

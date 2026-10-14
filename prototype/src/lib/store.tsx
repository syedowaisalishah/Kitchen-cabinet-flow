"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  useState,
  type ReactNode,
} from "react";
import { seedData } from "./seed";
import { emptyEnquiry, newChat } from "./config";
import {
  LEAD_STAGES,
  PROJECT_STAGES,
  type DemoData,
  type KitchenEnquiry,
  type LeadStage,
  type Project,
  type ProjectStage,
} from "./models";
const KEY = "osc-independent-concept-v1";
let snapshot: DemoData | null = null;
let error = "";
const listeners = new Set<() => void>();
function valid(data: unknown): data is DemoData {
  if (!data || typeof data !== "object") return false;
  const d = data as DemoData;
  const strings = (record: object, keys: string[]) =>
    keys.every(
      (key) => typeof (record as Record<string, unknown>)[key] === "string",
    );
  const tasksValid = (tasks: DemoData["leads"][number]["tasks"]) =>
    Array.isArray(tasks) &&
    tasks.every(
      (t) => !!t && strings(t, ["id", "text"]) && typeof t.done === "boolean",
    );
  const activityValid = (activity: DemoData["leads"][number]["activity"]) =>
    Array.isArray(activity) &&
    activity.every(
      (a) =>
        !!a &&
        strings(a, ["id", "at", "text"]) &&
        Number.isFinite(Date.parse(a.at)),
    );
  const enquiryValid = (e: KitchenEnquiry) =>
    !!e &&
    strings(e, [
      "projectType",
      "layout",
      "length",
      "width",
      "unit",
      "measurementNotes",
      "style",
      "finish",
      "benchtop",
      "colour",
      "appliances",
      "budget",
      "timeline",
      "comments",
    ]) &&
    !!e.customer &&
    strings(e.customer, [
      "name",
      "email",
      "phone",
      "suburb",
      "contactMethod",
    ]) &&
    Array.isArray(e.references) &&
    e.references.length <= 5 &&
    e.references.every(
      (r) =>
        !!r &&
        strings(r, ["id", "name", "src"]) &&
        (r.kind === "sample" || r.kind === "local") &&
        typeof r.size === "number" &&
        (/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.src) ||
          /^\/images\/kitchen-(hero|dark)\.jpg$/.test(r.src)),
    ) &&
    Array.isArray(e.storage) &&
    e.storage.every((s) => typeof s === "string") &&
    typeof e.consent === "boolean";
  return (
    d.version === 1 &&
    Array.isArray(d.leads) &&
    Array.isArray(d.projects) &&
    enquiryValid(d.draft) &&
    typeof d.step === "number" &&
    Number.isInteger(d.step) &&
    d.step >= 0 &&
    d.step < 9 &&
    Array.isArray(d.chat?.messages) &&
    d.chat.messages.every(
      (m) =>
        !!m &&
        strings(m, ["id", "text"]) &&
        (m.role === "assistant" || m.role === "user") &&
        (!m.actions ||
          (Array.isArray(m.actions) &&
            m.actions.every((a) => typeof a === "string"))),
    ) &&
    typeof d.chat.id === "string" &&
    !!d.chat.captured &&
    typeof d.chat.captured === "object" &&
    (d.chat.pending === null ||
      ["name", "email", "phone", "layout", "budget", "timeline"].includes(
        d.chat.pending,
      )) &&
    d.leads.every(
      (l) =>
        typeof l.id === "string" &&
        LEAD_STAGES.includes(l.stage) &&
        enquiryValid(l.enquiry) &&
        strings(l, ["source", "createdAt"]) &&
        Number.isFinite(Date.parse(l.createdAt)) &&
        tasksValid(l.tasks) &&
        activityValid(l.activity),
    ) &&
    d.projects.every(
      (p) =>
        typeof p.id === "string" &&
        typeof p.leadId === "string" &&
        PROJECT_STAGES.includes(p.stage) &&
        typeof p.assignee === "string" &&
        tasksValid(p.tasks) &&
        Array.isArray(p.notes) &&
        p.notes.every((n) => typeof n === "string") &&
        activityValid(p.activity) &&
        !!p.milestoneDates &&
        Object.values(p.milestoneDates).every((v) => typeof v === "string") &&
        d.leads.some((l) => l.id === p.leadId),
    )
  );
}
function read() {
  if (snapshot) return snapshot;
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    snapshot = valid(parsed) ? parsed : seedData();
    if (raw && !valid(parsed))
      error = "Stored demo data was unreadable. Sample data has been restored.";
  } catch (cause) {
    snapshot = seedData();
    error =
      cause instanceof SyntaxError
        ? "Stored demo data was unreadable. Sample data has been restored."
        : "Browser storage is unavailable. Changes work for this visit but may not survive a refresh.";
  }
  return snapshot;
}
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      snapshot = null;
      read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
function save(next: DemoData) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    error = "";
  } catch {
    error =
      "Your changes are in memory, but browser storage is full or unavailable. Remove reference images or reset demo data before relying on refresh persistence.";
  }
  emit();
}
const event = (text: string) => ({
  id: crypto.randomUUID(),
  at: new Date().toISOString(),
  text,
});
type DemoUI = {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  tourStep: number | null;
  setTourStep: (step: number | null) => void;
};
const Context = createContext<(ReturnType<typeof useStore> & DemoUI) | null>(
  null,
);
function useStore() {
  const data = useSyncExternalStore(subscribe, read, () => null);
  const update = (fn: (d: DemoData) => DemoData) => save(fn(read()));
  return {
    data,
    storageError: error,
    setDraft: (patch: Partial<KitchenEnquiry>) =>
      update((d) => ({ ...d, draft: { ...d.draft, ...patch } })),
    setStep: (step: number) => update((d) => ({ ...d, step })),
    setChat: (chat: DemoData["chat"]) => update((d) => ({ ...d, chat })),
    useChatDraft: () =>
      update((d) => ({
        ...d,
        draft: {
          ...d.draft,
          ...d.chat.captured,
          customer: { ...d.draft.customer, ...d.chat.captured.customer },
        },
      })),
    restartDraft: () =>
      update((d) => ({ ...d, draft: emptyEnquiry(), step: 0 })),
    restartChat: () => update((d) => ({ ...d, chat: newChat() })),
    submit: () => {
      const id = "lead-" + crypto.randomUUID();
      update((d) => ({
        ...d,
        leads: [
          {
            id,
            enquiry: structuredClone(d.draft),
            stage: "New enquiry",
            createdAt: new Date().toISOString(),
            source: Object.keys(d.chat.captured).length
              ? "Kitchen assistant"
              : "Smart enquiry",
            chatSessionId: Object.keys(d.chat.captured).length
              ? d.chat.id
              : undefined,
            chatSummary: Object.keys(d.chat.captured).length
              ? d.chat.messages
                  .filter((m) => m.role === "user")
                  .map((m) => m.text)
                  .join(" · ")
              : undefined,
            tasks: [
              {
                id: crypto.randomUUID(),
                text: "Review brief and arrange a demonstration follow-up",
                done: false,
              },
            ],
            activity: [event("Demo enquiry submitted locally")],
          },
          ...d.leads,
        ],
        draft: emptyEnquiry(),
        step: 0,
      }));
      return id;
    },
    setLeadStage: (id: string, stage: LeadStage) =>
      update((d) => ({
        ...d,
        leads: d.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                stage,
                activity: [event("Lead moved to " + stage), ...l.activity],
              }
            : l,
        ),
      })),
    toggleLeadTask: (id: string, taskId: string) =>
      update((d) => ({
        ...d,
        leads: d.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                tasks: l.tasks.map((t) =>
                  t.id === taskId ? { ...t, done: !t.done } : t,
                ),
              }
            : l,
        ),
      })),
    addLeadTask: (id: string, text: string) =>
      update((d) => ({
        ...d,
        leads: d.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                tasks: [
                  ...l.tasks,
                  { id: crypto.randomUUID(), text, done: false },
                ],
              }
            : l,
        ),
      })),
    createProject: (leadId: string, qualifyForDemo = false) => {
      const current = read();
      const existing = current.projects.find((p) => p.leadId === leadId);
      if (existing) return existing.id;
      const lead = current.leads.find((l) => l.id === leadId);
      if (
        !lead ||
        (!qualifyForDemo &&
          (LEAD_STAGES.indexOf(lead.stage) < 2 || lead.stage === "Lost"))
      )
        return null;
      const id = "OSC-" + crypto.randomUUID().slice(0, 8).toUpperCase();
      const p: Project = {
        id,
        leadId,
        stage: "Lead qualified",
        assignee: "Jordan · Design",
        milestoneDates: {},
        tasks: [
          {
            id: crypto.randomUUID(),
            text: "Arrange site consultation",
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Verify preliminary measurements",
            done: false,
          },
          {
            id: crypto.randomUUID(),
            text: "Prepare initial design brief",
            done: false,
          },
        ],
        notes: [],
        activity: [event("Project created from qualified demo lead")],
      };
      const needsQualification =
        LEAD_STAGES.indexOf(lead.stage) < 2 || lead.stage === "Lost";
      update((d) => ({
        ...d,
        leads: needsQualification
          ? d.leads.map((item) =>
              item.id === leadId
                ? {
                    ...item,
                    stage: "Qualified",
                    activity: [
                      event(
                        "Pitch demo: enquiry qualified and converted to a project",
                      ),
                      ...item.activity,
                    ],
                  }
                : item,
            )
          : d.leads,
        projects: [p, ...d.projects],
      }));
      return id;
    },
    updateProject: (id: string, patch: Partial<Project>, activity?: string) =>
      update((d) => ({
        ...d,
        projects: d.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                ...patch,
                activity: activity
                  ? [event(activity), ...p.activity]
                  : p.activity,
              }
            : p,
        ),
      })),
    setProjectStage: (id: string, stage: ProjectStage) =>
      update((d) => ({
        ...d,
        projects: d.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                stage,
                activity: [event("Project moved to " + stage), ...p.activity],
              }
            : p,
        ),
      })),
    reset: () => {
      try {
        localStorage.removeItem(KEY);
      } catch {
        /* storage error is surfaced by save */
      }
      save(seedData());
    },
  };
}
export function DemoProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  return (
    <Context.Provider
      value={{ ...store, chatOpen, setChatOpen, tourStep, setTourStep }}
    >
      {children}
      {store.storageError && (
        <div className="storage-alert" role="alert">
          {store.storageError}
        </div>
      )}
    </Context.Provider>
  );
}
export function useDemo() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("DemoProvider missing");
  return ctx;
}
export function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Karachi",
  });
}

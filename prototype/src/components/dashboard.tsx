"use client";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Layers,
  ArrowUpRight,
  ArrowLeft,
  Search,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Circle,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  PenTool,
  Check,
  MessageCircle,
} from "lucide-react";
import { Brand, Empty } from "./ui";
import { useDemo, dateLabel } from "@/lib/store";
import {
  LEAD_STAGES,
  PROJECT_STAGES,
  type Lead,
  type LeadStage,
  type ProjectStage,
  type ActivityEvent,
} from "@/lib/models";
import { BriefSummary } from "./enquiry";
import { SAMPLE } from "@/lib/config";
export function DashboardShell({ children }: { children: ReactNode }) {
  const path = usePathname().replace(/\/$/, "");
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Brand compact />
        <span className="workspace-name">PITCH DEMO</span>
        <nav aria-label="Business dashboard navigation">
          {[
            {
              href: "/dashboard",
              title: "Demo overview",
              icon: LayoutDashboard,
            },
            {
              href: "/dashboard/leads",
              title: "Enquiries",
              icon: Users,
            },
            {
              href: "/dashboard/projects",
              title: "Projects",
              icon: Layers,
            },
          ].map((n) => (
            <Link
              className={path === n.href ? "active" : ""}
              key={n.href}
              href={n.href}
            >
              <n.icon size={19} />
              {n.title}
            </Link>
          ))}
        </nav>
        <Link className="sidebar-demo-link" href="/demo">
          <Sparkles size={18} />
          Start the walkthrough
          <ArrowRight size={16} />
        </Link>
        <Link className="back-website" href="/">
          <ArrowLeft size={15} />
          Back to the website
        </Link>
      </aside>
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <span>
            One Stop Cabinets <ChevronRight size={13} />
            <strong>
              {path.includes("projects")
                ? "Kitchen projects"
                : path.includes("leads")
                  ? "Enquiries & leads"
                  : "Overview"}
            </strong>
          </span>
          <span className="demo-badge">
            <span className="live-dot" />
            Pitch demo · fictional data
          </span>
        </header>
        <main id="main" className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}
export function StageBadge({ stage }: { stage: string }) {
  return (
    <span
      className={`stage-badge ${stage === "New enquiry" ? "new" : stage === "Won" ? "won" : stage === "Lost" ? "lost" : stage === "Qualified" ? "qualified" : ""}`}
    >
      <span />
      {stage}
    </span>
  );
}
function Activity({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="activity-list">
      {events.map((a) => (
        <div key={a.id}>
          <span className="activity-dot" />
          <div>
            <p>{a.text}</p>
            <small>{dateLabel(a.at)}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
function Avatar({ name }: { name: string }) {
  return (
    <span className="avatar">
      {name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")}
    </span>
  );
}
export function LeadsTable({
  leads,
  compact = false,
}: {
  leads: Lead[];
  compact?: boolean;
}) {
  return (
    <>
      <div className="mobile-leads">
        {leads.map((lead) => (
          <Link
            key={lead.id}
            className="mobile-lead-card"
            href={`/dashboard/leads?id=${lead.id}`}
            aria-label={`View lead for ${lead.enquiry.customer.name}`}
          >
            <div className="mobile-lead-heading">
              <Avatar name={lead.enquiry.customer.name} />
              <span>
                <strong>{lead.enquiry.customer.name}</strong>
                <small>{lead.enquiry.customer.suburb}</small>
              </span>
              <ArrowUpRight size={18} />
            </div>
            <p>{lead.enquiry.projectType}</p>
            <div className="mobile-lead-meta">
              <span>{lead.enquiry.budget}</span>
              <StageBadge stage={lead.stage} />
            </div>
            {!compact && (
              <span className="mobile-lead-action">
                {lead.tasks.find((task) => !task.done)?.text ||
                  "Review next stage"}
                <ChevronRight size={15} />
              </span>
            )}
          </Link>
        ))}
        {!leads.length && <Empty>No leads match your search.</Empty>}
      </div>
      <div className="table-scroll">
        <table className={`leads-table ${compact ? "compact" : ""}`}>
          <thead>
            <tr>
              <th>Customer / project</th>
              <th>Budget category</th>
              <th>Location</th>
              {!compact && <th>Timeline</th>}
              <th>Status</th>
              <th>Received</th>
              {!compact && <th>Next action</th>}
              <th>
                <span className="sr-only">Open lead</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>
                  <Link
                    className="table-person"
                    href={`/dashboard/leads?id=${l.id}`}
                  >
                    <Avatar name={l.enquiry.customer.name} />
                    <span>
                      <strong>{l.enquiry.customer.name}</strong>
                      <small>{l.enquiry.projectType}</small>
                    </span>
                  </Link>
                </td>
                <td>{l.enquiry.budget}</td>
                <td>{l.enquiry.customer.suburb}</td>
                {!compact && <td>{l.enquiry.timeline}</td>}
                <td>
                  <StageBadge stage={l.stage} />
                </td>
                <td>{dateLabel(l.createdAt)}</td>
                {!compact && (
                  <td>
                    {l.tasks.find((t) => !t.done)?.text || "Review next stage"}
                  </td>
                )}
                <td>
                  <Link
                    aria-label={`View lead for ${l.enquiry.customer.name}`}
                    href={`/dashboard/leads?id=${l.id}`}
                  >
                    <ArrowUpRight size={17} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads.length && (
          <Empty>
            No leads match your search. Try a different name, suburb or status.
          </Empty>
        )}
      </div>
    </>
  );
}
export function Overview() {
  const demo = useDemo();
  const data = demo.data;
  const router = useRouter();
  if (!data) return <div className="loading">Loading the demo…</div>;
  const latest =
    data.leads.find((lead) => !lead.id.startsWith("lead-demo-")) ||
    data.leads[0];
  const kpis = [
    {
      label: "Total enquiries",
      value: data.leads.length,
      icon: Users,
      caption: "All demo enquiries",
    },
    {
      label: "New enquiries",
      value: data.leads.filter((l) => l.stage === "New enquiry").length,
      icon: MessageCircle,
      caption: "Ready for a first conversation",
    },
    {
      label: "Qualified leads",
      value: data.leads.filter((l) => l.stage === "Qualified").length,
      icon: CheckCircle2,
      caption: "Ready to explore further",
    },
    {
      label: "Consultations scheduled",
      value: data.leads.filter((l) => l.stage === "Consultation scheduled")
        .length,
      icon: CalendarDays,
      caption: "Demonstration appointments",
    },
    {
      label: "Quotes pending",
      value: data.leads.filter((l) => l.stage === "Quotation pending").length,
      icon: PenTool,
      caption: "Briefs ready for pricing",
    },
    {
      label: "Projects in progress",
      value: data.projects.filter((p) => p.stage !== "Project handover").length,
      icon: Layers,
      caption: "From design to installation",
    },
  ];
  return (
    <>
      <div className="pitch-intro">
        <span className="eyebrow">THE IDEA, IN THREE STEPS</span>
        <h1>
          Less chasing.
          <br />
          More kitchens.
        </h1>
        <p>Ask. Capture. Track.</p>
        <button
          className="button"
          onClick={() => {
            demo.setDraft(structuredClone(SAMPLE));
            demo.setStep(8);
            router.push("/kitchen-enquiry");
          }}
        >
          <PlayIcon />
          Try Sample Enquiry
          <ArrowRight size={18} />
        </button>
      </div>
      <div className="pitch-flow">
        <button
          onClick={() => {
            demo.setChatOpen(true);
            router.push("/");
          }}
        >
          <span className="pitch-number">01</span>
          <MessageCircle size={28} />
          <h2>Customer asks</h2>
          <p>Kiki helps them get started.</p>
          <span>
            Try the assistant <ArrowRight size={17} />
          </span>
        </button>
        <Link href={`/dashboard/leads?id=${latest.id}`}>
          <span className="pitch-number">02</span>
          <Users size={28} />
          <h2>Enquiry captured</h2>
          <p>One clear kitchen brief.</p>
          <span>
            Open an enquiry <ArrowRight size={17} />
          </span>
        </Link>
        <Link href="/dashboard/projects">
          <span className="pitch-number">03</span>
          <Layers size={28} />
          <h2>Project tracked</h2>
          <p>Design through installation.</p>
          <span>
            Explore projects <ArrowRight size={17} />
          </span>
        </Link>
      </div>
      <div className="pitch-latest">
        <div>
          <span className="eyebrow">
            {latest.id.startsWith("lead-demo-")
              ? "TRY A FICTIONAL EXAMPLE"
              : "YOUR LATEST DEMO ENQUIRY"}
          </span>
          <h2>{latest.enquiry.customer.name}</h2>
          <p>
            {latest.enquiry.layout} · {latest.enquiry.budget}
          </p>
        </div>
        <Link
          className="button secondary"
          href={`/dashboard/leads?id=${latest.id}`}
        >
          Open enquiry
          <ArrowRight size={17} />
        </Link>
      </div>
      <details className="pitch-details">
        <summary>More demo records</summary>
        <div className="pitch-details-content">
          <div className="kpi-grid">
            {kpis.map((k) => (
              <div key={k.label} className="kpi">
                <div>
                  <span>{k.label}</span>
                  <k.icon size={18} />
                </div>
                <strong>{k.value}</strong>
              </div>
            ))}
          </div>
          <section className="dashboard-panel">
            <div className="panel-heading">
              <h2>Example enquiries</h2>
              <Link href="/dashboard/leads" className="text-link">
                View all
                <ArrowRight size={16} />
              </Link>
            </div>
            <LeadsTable leads={data.leads.slice(0, 5)} compact />
          </section>
        </div>
      </details>
    </>
  );
}
function PlayIcon() {
  return <Sparkles size={17} />;
}
export function Leads() {
  const { data } = useDemo();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(params.get("stage") || "All statuses");
  if (!data) return <div className="loading">Loading fictional leads…</div>;
  const id = params.get("id");
  if (id) return <LeadDetails id={id} />;
  const leads = data.leads.filter(
    (l) =>
      (filter === "All statuses" || l.stage === filter) &&
      (
        l.enquiry.customer.name +
        " " +
        l.enquiry.customer.suburb +
        " " +
        l.enquiry.projectType
      )
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="dashboard-page-title">
        <div>
          <span className="eyebrow">STEP 2 · CAPTURE THE IDEA</span>
          <h1>Enquiries</h1>
          <p>Open a brief. Try converting it to a project.</p>
        </div>
        <Link className="button" href="/kitchen-enquiry">
          <Plus size={16} />
          New demo enquiry
        </Link>
      </div>
      <section className="dashboard-panel">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={17} />
            <input
              aria-label="Search leads"
              placeholder="Search name, suburb or project…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <label className="filter-field">
            <span className="sr-only">Filter lead status</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All statuses</option>
              {LEAD_STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <span className="record-count">
            {leads.length} fictional {leads.length === 1 ? "record" : "records"}
          </span>
        </div>
        <LeadsTable leads={leads} compact />
      </section>
    </>
  );
}
function LeadDetails({ id }: { id: string }) {
  const demo = useDemo();
  const router = useRouter();
  const [task, setTask] = useState("");
  const lead = demo.data?.leads.find((l) => l.id === id);
  const project = demo.data?.projects.find((p) => p.leadId === id);
  if (!lead)
    return (
      <Empty>
        <h2>This lead isn’t in this browser.</h2>
        <p>
          Demo records are local to the browser that created them. Resetting
          removes submitted enquiries.
        </p>
        <Link className="button" href="/dashboard/leads">
          Back to leads
        </Link>
      </Empty>
    );
  return (
    <>
      <Link className="back-link" href="/dashboard/leads">
        <ArrowLeft size={15} />
        All enquiries & leads
      </Link>
      <div className="dashboard-page-title detail-title">
        <div className="detail-person">
          <Avatar name={lead.enquiry.customer.name} />
          <div>
            <span className="eyebrow">SAMPLE ENQUIRY</span>
            <h1>{lead.enquiry.customer.name}</h1>
            <p>
              {lead.enquiry.projectType} · {lead.enquiry.customer.suburb}
            </p>
          </div>
        </div>
        {project ? (
          <Link
            className="button"
            href={`/dashboard/projects?id=${project.id}`}
          >
            View connected project <ArrowUpRight size={16} />
          </Link>
        ) : (
          <button
            className="button"
            onClick={() => {
              const projectId = demo.createProject(id, true);
              if (projectId) router.push(`/dashboard/projects?id=${projectId}`);
            }}
          >
            <Plus size={16} />
            Convert to demo project
          </button>
        )}
      </div>
      <div className="pitch-conversion-path">
        <span className="active">
          <CheckCircle2 size={17} />
          Enquiry captured
        </span>
        <ArrowRight size={18} />
        <span className={project ? "active" : ""}>
          <Layers size={17} />
          Demo project
        </span>
      </div>
      <div className="pitch-brief-grid">
        <section className="dashboard-panel pitch-brief">
          <div className="panel-heading">
            <h2>The kitchen idea</h2>
            <StageBadge stage={lead.stage} />
          </div>
          <dl>
            {[
              ["Project", lead.enquiry.projectType],
              ["Layout", lead.enquiry.layout],
              ["Style", lead.enquiry.style],
              ["Budget", lead.enquiry.budget],
              ["Start", lead.enquiry.timeline],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || "Open to advice"}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="dashboard-panel pitch-contact">
          <div className="panel-heading">
            <h2>Contact</h2>
          </div>
          <div className="contact-details">
            <span>
              <Mail size={17} />
              {lead.enquiry.customer.email}
            </span>
            <span>
              <Phone size={17} />
              {lead.enquiry.customer.phone}
            </span>
            <span>
              <MapPin size={17} />
              {lead.enquiry.customer.suburb}
            </span>
          </div>
        </section>
      </div>
      <details className="pitch-details lead-extra-details">
        <summary>Full brief & follow-up</summary>
        <div className="pitch-details-content">
          <div className="lead-stage-bar">
            <label>
              Lead status
              <select
                aria-label="Lead status"
                value={lead.stage}
                onChange={(e) =>
                  demo.setLeadStage(id, e.target.value as LeadStage)
                }
              >
                {LEAD_STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <span>
              <Clock size={14} />
              Received {dateLabel(lead.createdAt)}
            </span>
            <span>Source: {lead.source}</span>
          </div>
          <div className="details-grid">
            <section className="dashboard-panel project-brief">
              <div className="panel-heading">
                <div>
                  <h2>The kitchen brief</h2>
                  <p>The same details captured in the customer enquiry.</p>
                </div>
                <PanelsIcon />
              </div>
              <BriefSummary enquiry={lead.enquiry} />
            </section>
            <aside>
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Contact information</h2>
                </div>
                <div className="contact-details">
                  <span>
                    <Mail size={16} />
                    {lead.enquiry.customer.email}
                  </span>
                  <span>
                    <Phone size={16} />
                    {lead.enquiry.customer.phone}
                  </span>
                  <span>
                    <MapPin size={16} />
                    {lead.enquiry.customer.suburb}
                  </span>
                  <small>
                    Prefers {lead.enquiry.customer.contactMethod.toLowerCase()}{" "}
                    · no messages are sent
                  </small>
                </div>
              </section>
              {lead.chatSummary && (
                <section className="dashboard-panel">
                  <div className="panel-heading">
                    <h2>
                      <Sparkles size={16} />
                      Assistant context
                    </h2>
                  </div>
                  <p className="panel-body muted">{lead.chatSummary}</p>
                  <small className="panel-body muted">
                    Session: {lead.chatSessionId || "fictional example"}
                  </small>
                </section>
              )}
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Follow-up tasks</h2>
                </div>
                <div className="task-list">
                  {lead.tasks.map((t) => (
                    <label className={t.done ? "done" : ""} key={t.id}>
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => demo.toggleLeadTask(id, t.id)}
                      />
                      <span>{t.text}</span>
                    </label>
                  ))}
                  <form
                    className="add-task"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (task.trim()) {
                        demo.addLeadTask(id, task.trim());
                        setTask("");
                      }
                    }}
                  >
                    <input
                      aria-label="New follow-up task"
                      placeholder="Add a follow-up task…"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      maxLength={200}
                    />
                    <button
                      className="icon-button"
                      disabled={!task.trim()}
                      aria-label="Add follow-up task"
                    >
                      <Plus size={17} />
                    </button>
                  </form>
                </div>
              </section>
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Lead activity</h2>
                </div>
                <Activity events={lead.activity} />
              </section>
            </aside>
          </div>
        </div>
      </details>
    </>
  );
}
function PanelsIcon() {
  return <PenTool size={19} />;
}
export function Projects() {
  const { data } = useDemo();
  const params = useSearchParams();
  if (!data) return <div className="loading">Loading demo projects…</div>;
  const id = params.get("id");
  if (id) return <ProjectDetails id={id} />;
  return (
    <>
      <div className="dashboard-page-title">
        <div>
          <span className="eyebrow">STEP 3 · FOLLOW THE PROJECT</span>
          <h1>Projects</h1>
          <p>From kitchen idea to installation.</p>
        </div>
        <Link className="button" href="/dashboard/leads">
          Choose an enquiry
          <ArrowRight size={17} />
        </Link>
      </div>
      <div className="pitch-project-path">
        {["Design", "Production", "Installation"].map((phase, index) => (
          <div key={phase}>
            <span>{index + 1}</span>
            <strong>{phase}</strong>
            {index < 2 && <ArrowRight size={19} />}
          </div>
        ))}
      </div>
      <div className="pitch-project-grid">
        {data.projects.map((project) => {
          const lead = data.leads.find((l) => l.id === project.leadId);
          const progress = Math.round(
            (PROJECT_STAGES.indexOf(project.stage) / 13) * 100,
          );
          return (
            <Link
              className="pitch-project-card"
              href={`/dashboard/projects?id=${project.id}`}
              key={project.id}
            >
              <div className="pitch-project-card-image">
                <img
                  src={
                    lead?.enquiry.references[0]?.src ||
                    "/images/kitchen-dark.jpg"
                  }
                  alt="Kitchen inspiration for this fictional project"
                />
                <StageBadge stage={project.stage} />
              </div>
              <div className="pitch-project-card-body">
                <h2>{lead?.enquiry.customer.suburb || "Sample"} kitchen</h2>
                <p>{lead?.enquiry.customer.name}</p>
                <div className="project-progress">
                  <span>Progress</span>
                  <strong>{progress}%</strong>
                  <div className="progress-track">
                    <span style={{ width: progress + "%" }} />
                  </div>
                </div>
                <span className="pitch-project-open">
                  Open project
                  <ArrowRight size={17} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {!data.projects.length && (
        <Empty>
          <p>Start with a sample enquiry.</p>
          <Link className="button" href="/dashboard/leads">
            Open enquiries
          </Link>
        </Empty>
      )}
    </>
  );
}
function ProjectDetails({ id }: { id: string }) {
  const demo = useDemo();
  const [note, setNote] = useState("");
  const p = demo.data?.projects.find((p) => p.id === id);
  const lead = demo.data?.leads.find((l) => l.id === p?.leadId);
  if (!p || !lead)
    return (
      <Empty>
        <h2>This project isn’t in this browser.</h2>
        <p>Your demo projects remain in the browser that created them.</p>
        <Link className="button" href="/dashboard/projects">
          Back to projects
        </Link>
      </Empty>
    );
  const n = PROJECT_STAGES.indexOf(p.stage),
    progress = Math.round((n / 13) * 100);
  return (
    <>
      <Link className="back-link" href="/dashboard/projects">
        <ArrowLeft size={15} />
        All kitchen projects
      </Link>
      <div className="dashboard-page-title">
        <div>
          <span className="eyebrow">DEMO PROJECT</span>
          <h1>{lead.enquiry.customer.suburb} kitchen</h1>
          <p>
            {lead.enquiry.customer.name} · {lead.enquiry.projectType}
          </p>
        </div>
        <Link
          className="button secondary"
          href={`/dashboard/leads?id=${lead.id}`}
        >
          View connected lead
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="project-overview-card">
        <div>
          <span className="eyebrow">CURRENT STAGE</span>
          <h2>{p.stage}</h2>
          <p>
            <span className="live-dot" />
            Next: {PROJECT_STAGES[n + 1] || "Handover complete"}
          </p>
        </div>
        <div className="project-overview-progress">
          <strong>
            {progress}
            <span>%</span>
          </strong>
          <small>Progress</small>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button
          className="button"
          disabled={n === 13}
          onClick={() => demo.setProjectStage(id, PROJECT_STAGES[n + 1])}
        >
          {n === 13 ? "Project handed over" : "Advance to next stage"}
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="pitch-phase-buttons">
        {[
          { title: "Design", icon: PenTool, target: 4 },
          { title: "Production", icon: Layers, target: 9 },
          { title: "Installation", icon: CalendarDays, target: 11 },
        ].map((phase, index) => (
          <button
            key={phase.title}
            aria-label={`Try ${phase.title} stage`}
            className={(n < 8 ? 0 : n < 11 ? 1 : 2) === index ? "active" : ""}
            onClick={() =>
              demo.setProjectStage(id, PROJECT_STAGES[phase.target])
            }
          >
            <span>{index + 1}</span>
            <phase.icon size={23} />
            <strong>{phase.title}</strong>
          </button>
        ))}
      </div>
      <section className="dashboard-panel">
        <div className="panel-heading">
          <h2>Project checklist</h2>
          <span className="mini-label">
            {p.tasks.filter((t) => t.done).length}/{p.tasks.length}
          </span>
        </div>
        <div className="task-list">
          {p.tasks.map((t) => (
            <label key={t.id} className={t.done ? "done" : ""}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  demo.updateProject(
                    id,
                    {
                      tasks: p.tasks.map((v) =>
                        v.id === t.id ? { ...v, done: !v.done } : v,
                      ),
                    },
                    `${t.done ? "Reopened" : "Completed"} task: ${t.text}`,
                  )
                }
              />
              <span>{t.text}</span>
            </label>
          ))}
        </div>
      </section>
      <details className="pitch-details project-extra-details">
        <summary>Timeline, notes & settings</summary>
        <div className="pitch-details-content">
          <div className="details-grid project-details">
            <section className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <h2>The project journey</h2>
                  <p>Estimated dates are demonstration milestones.</p>
                </div>
                <span className="mini-label">14 MILESTONES</span>
              </div>
              <ol className="milestone-list">
                {PROJECT_STAGES.map((s, i) => (
                  <li
                    key={s}
                    className={i < n ? "complete" : i === n ? "current" : ""}
                  >
                    <button
                      aria-label={`Set project stage to ${s}`}
                      onClick={() => demo.setProjectStage(id, s)}
                    >
                      <span className="milestone-dot">
                        {i < n ? (
                          <Check size={12} />
                        ) : i === n ? (
                          <Circle size={9} />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <span>
                        <strong>{s}</strong>
                        {i === n && <small>Current stage</small>}
                      </span>
                    </button>
                    <span>
                      {p.milestoneDates[s]
                        ? dateLabel(p.milestoneDates[s])
                        : "—"}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
            <aside>
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Project details</h2>
                </div>
                <div className="project-settings">
                  <label className="field">
                    <span>Assigned team member</span>
                    <select
                      value={p.assignee}
                      onChange={(e) =>
                        demo.updateProject(
                          id,
                          { assignee: e.target.value },
                          "Responsibility assigned to " + e.target.value,
                        )
                      }
                    >
                      {[
                        "Jordan · Design",
                        "Jordan · Production",
                        "Casey · Installation",
                        "Taylor · Project management",
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Project stage</span>
                    <select
                      aria-label="Project stage"
                      value={p.stage}
                      onChange={(e) =>
                        demo.setProjectStage(id, e.target.value as ProjectStage)
                      }
                    >
                      {PROJECT_STAGES.map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Estimated date for current stage</span>
                    <input
                      type="date"
                      value={p.milestoneDates[p.stage] || ""}
                      onChange={(e) =>
                        demo.updateProject(
                          id,
                          {
                            milestoneDates: {
                              ...p.milestoneDates,
                              [p.stage]: e.target.value,
                            },
                          },
                          "Estimated milestone date updated",
                        )
                      }
                    />
                  </label>
                </div>
              </section>
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Project notes</h2>
                </div>
                <div className="notes-list">
                  {p.notes.map((v, i) => (
                    <p key={i}>{v}</p>
                  ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (note.trim()) {
                        demo.updateProject(
                          id,
                          { notes: [...p.notes, note.trim()] },
                          "A demonstration note was added",
                        );
                        setNote("");
                      }
                    }}
                  >
                    <textarea
                      aria-label="New project note"
                      placeholder="Add a note for the demo team…"
                      maxLength={1500}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                      className="button secondary"
                      disabled={!note.trim()}
                    >
                      <Plus size={15} />
                      Add demonstration note
                    </button>
                  </form>
                </div>
              </section>
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <h2>Activity history</h2>
                </div>
                <Activity events={p.activity} />
              </section>
            </aside>
          </div>
        </div>
      </details>
    </>
  );
}

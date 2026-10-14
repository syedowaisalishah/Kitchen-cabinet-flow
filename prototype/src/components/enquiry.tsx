"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Upload,
  X,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Pencil,
  Save,
  PanelsTopLeft,
  PenTool,
  Box,
  HelpCircle,
} from "lucide-react";
import { CustomerHeader, Footer } from "./shell";
import { Dialog, LayoutDiagram } from "./ui";
import { useDemo } from "@/lib/store";
import { OPTIONS, SAMPLE, PLANNER_SCREENS } from "@/lib/config";
import { validateStep } from "@/lib/validation";
import type { KitchenEnquiry, UploadedReference } from "@/lib/models";
function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
export function BriefSummary({
  enquiry: e,
  onEdit,
}: {
  enquiry: KitchenEnquiry;
  onEdit?: (step: number) => void;
}) {
  const groups = [
    {
      title: "Your project",
      step: 0,
      rows: [
        ["Project type", e.projectType],
        ["Layout", e.layout],
      ],
    },
    {
      title: "Space & style",
      step: 2,
      rows: [
        [
          "Measurements",
          e.length ? `${e.length} × ${e.width} ${e.unit}` : "To be measured",
        ],
        ["Measurement notes", e.measurementNotes],
        ["Style", e.style],
        ["Cabinet finish", e.finish],
        ["Benchtop preference", e.benchtop],
        ["Colour", e.colour],
        ["Storage", e.storage.join(", ")],
        ["Appliances", e.appliances],
      ],
    },
    {
      title: "Budget & timing",
      step: 4,
      rows: [
        ["Budget category", e.budget],
        ["Preferred start", e.timeline],
      ],
    },
    {
      title: "Contact details",
      step: 7,
      rows: [
        ["Name", e.customer.name],
        ["Email", e.customer.email],
        ["Phone", e.customer.phone],
        ["Location", e.customer.suburb],
        ["Preferred contact", e.customer.contactMethod],
        ["Additional notes", e.comments],
      ],
    },
  ];
  return (
    <div className="brief-summary">
      {groups.map((g) => (
        <section className="summary-group" key={g.title}>
          <div className="summary-heading">
            <h3>{g.title}</h3>
            {onEdit && (
              <button className="text-button" onClick={() => onEdit(g.step)}>
                <Pencil size={13} />
                Edit
              </button>
            )}
          </div>
          <dl>
            {g.rows
              .filter((r) => r[1])
              .map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
      <section className="summary-group">
        <div className="summary-heading">
          <h3>Photos & inspiration</h3>
          {onEdit && (
            <button className="text-button" onClick={() => onEdit(6)}>
              <Pencil size={13} />
              Edit
            </button>
          )}
        </div>
        {e.references.length ? (
          <div className="reference-grid">
            {e.references.map((r) => (
              <figure key={r.id}>
                <img src={r.src} alt={r.name} />
                <figcaption>
                  {r.name}
                  {r.kind === "sample" ? " · Sample" : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="muted">No reference images added.</p>
        )}
      </section>
    </div>
  );
}
async function previewFile(file: File): Promise<UploadedReference> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error(`${file.name}: use JPG, PNG or WebP images.`);
  if (file.size > 8 * 1024 * 1024)
    throw new Error(`${file.name}: each file must be 8 MB or smaller.`);
  const object = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () =>
        reject(new Error(`${file.name}: this image could not be read.`));
      img.src = object;
    });
    if (img.naturalWidth * img.naturalHeight > 50000000)
      throw new Error(`${file.name}: image dimensions are too large.`);
    const ratio = Math.min(
      1,
      1000 / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * ratio));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Image previews are unavailable in this browser.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return {
      id: crypto.randomUUID(),
      name: file.name.slice(0, 120),
      src: canvas.toDataURL("image/jpeg", 0.72),
      kind: "local",
      size: file.size,
    };
  } finally {
    URL.revokeObjectURL(object);
  }
}
export default function Enquiry() {
  const demo = useDemo();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [restart, setRestart] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const typeApplied = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const type = params.get("type");
    if (demo.data && !typeApplied.current) {
      typeApplied.current = true;
      if (type && OPTIONS.projectType.includes(type))
        demo.setDraft({ projectType: type });
    }
  }, [demo, params]);
  if (!demo.data)
    return (
      <main id="main" className="section loading">
        Preparing your kitchen planner…
      </main>
    );
  const e = demo.data.draft;
  const screenIndex = Math.floor(demo.data.step / 2);
  const screen = PLANNER_SCREENS[screenIndex];
  const step = screen.step;
  const patch = <K extends keyof KitchenEnquiry>(
    key: K,
    value: KitchenEnquiry[K],
  ) => {
    demo.setDraft({ [key]: value });
    setError("");
  };
  const goto = (n: number) => {
    setError("");
    demo.setStep(Math.floor(n / 2) * 2);
    card.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  const next = () => {
    const message = screen.validates
      .map((n) => validateStep(e, n))
      .find(Boolean);
    if (message) {
      setError(message);
      return;
    }
    goto(step + 2);
  };
  const submit = () => {
    for (let i = 0; i < 8; i++) {
      const msg = validateStep(e, i);
      if (msg) {
        goto(i);
        setError(msg);
        return;
      }
    }
    setSubmitted(demo.submit());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const choice = (
    key: "projectType" | "layout" | "style" | "budget" | "timeline",
    description?: string,
  ) => (
    <div
      className={`choice-grid ${key === "layout" ? "layout-choices" : ""} ${key === "budget" || key === "timeline" ? "list-choices" : ""}`}
    >
      {OPTIONS[key].map((v, i) => {
        const Icon =
          key === "projectType"
            ? [PenTool, PanelsTopLeft, Box, PanelsTopLeft, HelpCircle][i]
            : null;
        return (
          <button
            key={v}
            className={`choice-card ${e[key] === v ? "selected" : ""}`}
            aria-pressed={e[key] === v}
            onClick={() => patch(key, v)}
          >
            {key === "layout" ? (
              <LayoutDiagram layout={v} />
            ) : Icon ? (
              <Icon size={27} strokeWidth={1.4} />
            ) : key === "style" ? (
              <span className={`style-swatch style-${i}`} />
            ) : (
              <span className="choice-radio">
                {e[key] === v && <Check size={12} />}
              </span>
            )}
            <span>{v}</span>
            {description && <small>{description}</small>}
            {e[key] === v && (
              <CheckCircle2 className="choice-check" size={18} />
            )}
          </button>
        );
      })}
    </div>
  );
  const select = (key: "finish" | "benchtop" | "colour") => (
    <select value={e[key]} onChange={(ev) => patch(key, ev.target.value)}>
      {OPTIONS[key].map((v) => (
        <option key={v}>{v}</option>
      ))}
    </select>
  );
  const upload = async (files: FileList | null) => {
    if (!files) return;
    if (e.references.length + files.length > 5) {
      setError(
        "Add up to five reference images. Remove one before adding more.",
      );
      return;
    }
    setUploading(true);
    setError("");
    const results = await Promise.allSettled(
      Array.from(files).map(previewFile),
    );
    const good = results
      .filter(
        (r): r is PromiseFulfilledResult<UploadedReference> =>
          r.status === "fulfilled",
      )
      .map((r) => r.value);
    if (good.length) demo.setDraft({ references: [...e.references, ...good] });
    const failures = results
      .filter((r) => r.status === "rejected")
      .map((r) =>
        r.reason instanceof Error
          ? r.reason.message
          : "Unable to preview this image.",
      );
    if (failures.length) setError(failures.join(" "));
    setUploading(false);
  };
  return (
    <>
      <CustomerHeader />
      <main id="main" className="enquiry-page">
        {submitted ? (
          <div className="success-card">
            <span className="success-icon">
              <Check size={32} />
            </span>
            <span className="eyebrow">A CLEARER PICTURE, ALREADY</span>
            <h1>
              Your kitchen brief
              <br />
              is ready.
            </h1>
            <p>
              Saved in this browser. Ready to try the business side.{" "}
              <strong>It was not sent to One Stop Cabinets.</strong>
            </p>
            <div className="success-next">
              <span className="eyebrow">NOW SEE THE BUSINESS SIDE</span>
              <p>Open your enquiry and convert it to a demo project.</p>
              <Link
                href={`/dashboard/leads?id=${submitted}`}
                className="button"
              >
                View your lead in the dashboard
                <ArrowRight size={17} />
              </Link>
            </div>
            <button
              className="text-button"
              onClick={() => {
                setSubmitted(null);
                demo.restartDraft();
              }}
            >
              Start another demo enquiry
            </button>
            <Link className="text-link" href="/">
              Back to the website
            </Link>
          </div>
        ) : (
          <>
            <div className="enquiry-title">
              <div>
                <span className="eyebrow">LET’S MAKE IT YOURS</span>
                <h1>
                  Plan your <em>kitchen.</em>
                </h1>
                <p>
                  Five easy steps. Pick what you know — we’ll help with the
                  rest.
                </p>
              </div>
              <button
                className="sample-button"
                onClick={() => {
                  demo.setDraft(structuredClone(SAMPLE));
                  goto(8);
                }}
              >
                <Sparkles size={16} />
                Try Sample Enquiry
                <ArrowRight size={15} />
              </button>
            </div>
            <div className="enquiry-layout">
              <aside className="enquiry-sidebar">
                <div className="step-count">
                  YOUR PROJECT BRIEF <span>{screenIndex + 1} / 5</span>
                </div>
                <div className="progress-track">
                  <span
                    style={{ width: `${((screenIndex + 1) / 5) * 100}%` }}
                  />
                </div>
                <ol className="step-list">
                  {PLANNER_SCREENS.map(({ title, step: targetStep }, i) => (
                    <li
                      key={title}
                      className={
                        i === screenIndex
                          ? "current"
                          : i < screenIndex
                            ? "complete"
                            : ""
                      }
                    >
                      <button
                        disabled={i > screenIndex}
                        onClick={() => goto(targetStep)}
                        aria-current={i === screenIndex ? "step" : undefined}
                      >
                        <span>
                          {i < screenIndex ? (
                            <Check size={13} />
                          ) : (
                            String(i + 1).padStart(2, "0")
                          )}
                        </span>
                        {title}
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="planner-help">
                  <ShieldCheck size={21} />
                  <h3>A space to explore</h3>
                  <p>
                    Your brief stays in this browser. Use fictional details for
                    this independent demo.
                  </p>
                </div>
              </aside>
              <div ref={card} className="enquiry-card">
                <div className="form-card-top">
                  <span className="eyebrow">
                    STEP {screenIndex + 1} OF 5 · {screen.title.toUpperCase()}
                  </span>
                  <span className="autosave">
                    <Save size={12} />
                    {demo.storageError ? "Saved in memory" : "Saved as you go"}
                  </span>
                </div>
                <div className="step-content" key={step}>
                  {step === 0 && (
                    <>
                      <h2>Tell us about your kitchen.</h2>
                      <p>Choose your project, then a layout.</p>
                      {choice("projectType")}
                    </>
                  )}
                  {step === 0 && e.projectType && (
                    <>
                      <h3 className="planner-question-title">
                        Which layout feels closest?
                      </h3>
                      <p>Still exploring? Choose “Not sure”.</p>
                      {choice("layout")}
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h2>What feels like home?</h2>
                      <p>
                        Choose a direction for your kitchen. There’s room to
                        refine it along the way.
                      </p>
                      {choice("style")}
                      <details className="planner-extras">
                        <summary>
                          Measurements & finishing details <span>Optional</span>
                        </summary>
                        <div className="planner-extras-content">
                          <div className="field-grid">
                            <Field label="Approximate length">
                              <input
                                type="number"
                                inputMode="decimal"
                                min="0.1"
                                max={e.unit === "metres" ? 30 : 30000}
                                step="any"
                                placeholder="e.g. 4.5"
                                value={e.length}
                                onChange={(v) =>
                                  patch("length", v.target.value)
                                }
                              />
                            </Field>
                            <Field label="Approximate width">
                              <input
                                type="number"
                                inputMode="decimal"
                                min="0.1"
                                max={e.unit === "metres" ? 30 : 30000}
                                step="any"
                                placeholder="e.g. 3.6"
                                value={e.width}
                                onChange={(v) => patch("width", v.target.value)}
                              />
                            </Field>
                          </div>
                          <Field label="Measurement unit">
                            <select
                              value={e.unit}
                              onChange={(v) => {
                                const nextUnit = v.target.value;
                                const factor =
                                  nextUnit === "metres" ? 0.001 : 1000;
                                demo.setDraft({
                                  unit: nextUnit,
                                  length: e.length
                                    ? String(Number(e.length) * factor)
                                    : "",
                                  width: e.width
                                    ? String(Number(e.width) * factor)
                                    : "",
                                });
                              }}
                            >
                              <option>metres</option>
                              <option>millimetres</option>
                            </select>
                          </Field>
                          <Field label="Anything else about your space? (optional)">
                            <textarea
                              placeholder="Windows, doorways, ceiling height, or a wall you’d like to move…"
                              value={e.measurementNotes}
                              maxLength={1500}
                              onChange={(v) =>
                                patch("measurementNotes", v.target.value)
                              }
                            />
                          </Field>
                          <div className="info-note">
                            These are preliminary measurements. A professional
                            site measure is needed before a final design or
                            quotation.
                          </div>

                          <div className="field-grid three">
                            <Field label="Cabinet finish">
                              {select("finish")}
                            </Field>
                            <Field label="Benchtop preference">
                              {select("benchtop")}
                            </Field>
                            <Field label="Colour preference">
                              {select("colour")}
                            </Field>
                          </div>
                          <fieldset className="storage-choices">
                            <legend>What would make storage easier?</legend>
                            {OPTIONS.storage.map((v) => (
                              <label key={v}>
                                <input
                                  type="checkbox"
                                  checked={e.storage.includes(v)}
                                  onChange={() =>
                                    patch(
                                      "storage",
                                      e.storage.includes(v)
                                        ? e.storage.filter((x) => x !== v)
                                        : [...e.storage, v],
                                    )
                                  }
                                />
                                {v}
                              </label>
                            ))}
                          </fieldset>
                          <Field
                            label={
                              e.projectType === "Kitchen facelift"
                                ? "Which existing appliances would you keep? (optional)"
                                : "Any appliances to plan around? (optional)"
                            }
                          >
                            <textarea
                              value={e.appliances}
                              placeholder="A new cooktop, an existing fridge, or space for a dishwasher…"
                              maxLength={1500}
                              onChange={(v) =>
                                patch("appliances", v.target.value)
                              }
                            />
                          </Field>
                          <small className="muted">
                            Illustrative preferences only. Product availability
                            and suitability need confirmation.
                          </small>
                        </div>
                      </details>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h2>Budget & timing.</h2>
                      <p>Choose the budget category that’s closest.</p>
                      {choice("budget")}
                      <div className="info-note">
                        Australian-dollar enquiry categories only. These ranges
                        are not prices, estimates or formal quotations.
                      </div>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <h3 className="planner-question-title">
                        When would you like to begin?
                      </h3>
                      <p>
                        Your preferred timing — availability is confirmed later.
                      </p>
                      {choice("timeline")}
                    </>
                  )}
                  {step === 6 && (
                    <details className="planner-extras photo-extras">
                      <summary>
                        Photos & inspiration <span>Optional</span>
                      </summary>
                      <div className="planner-extras-content">
                        <label className="upload-zone">
                          <Upload size={29} />
                          <strong>
                            {uploading
                              ? "Preparing previews…"
                              : "Choose your reference images"}
                          </strong>
                          <span>
                            JPG, PNG or WebP · up to 8 MB each · maximum 5
                          </span>
                          <input
                            aria-label="Upload kitchen reference images"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            disabled={uploading}
                            onChange={(v) => {
                              void upload(v.target.files);
                              v.target.value = "";
                            }}
                          />
                        </label>
                        <button
                          className="text-button"
                          disabled={uploading || e.references.length >= 5}
                          onClick={() =>
                            patch("references", [
                              ...e.references,
                              {
                                id: crypto.randomUUID(),
                                name: "Sample kitchen inspiration",
                                src: "/images/kitchen-dark.jpg",
                                kind: "sample",
                                size: 0,
                              },
                            ])
                          }
                        >
                          <Sparkles size={15} />
                          Add sample inspiration photo
                        </button>
                        <div className="reference-grid">
                          {e.references.map((r) => (
                            <figure key={r.id}>
                              <img src={r.src} alt={r.name} />
                              <button
                                className="icon-button"
                                aria-label={`Remove ${r.name}`}
                                disabled={uploading}
                                onClick={() =>
                                  patch(
                                    "references",
                                    e.references.filter((v) => v.id !== r.id),
                                  )
                                }
                              >
                                <X size={15} />
                              </button>
                              <figcaption>
                                {r.name}
                                {r.kind === "sample" ? " · Sample" : ""}
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                        <div className="info-note">
                          Compressed previews stay in your browser’s local
                          storage. No files are uploaded to a server. Reset Demo
                          Data clears them.
                        </div>
                      </div>
                    </details>
                  )}
                  {step === 6 && (
                    <>
                      <h2>Let’s finish your brief.</h2>
                      <p>Use fictional details while trying the demo.</p>
                      <div className="field-grid">
                        <Field label="Full name">
                          <input
                            autoComplete="name"
                            value={e.customer.name}
                            maxLength={80}
                            onChange={(v) =>
                              patch("customer", {
                                ...e.customer,
                                name: v.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Suburb / location">
                          <input
                            autoComplete="address-level2"
                            value={e.customer.suburb}
                            maxLength={80}
                            onChange={(v) =>
                              patch("customer", {
                                ...e.customer,
                                suburb: v.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Email">
                          <input
                            type="email"
                            autoComplete="email"
                            placeholder="alex@example.com"
                            value={e.customer.email}
                            maxLength={150}
                            onChange={(v) =>
                              patch("customer", {
                                ...e.customer,
                                email: v.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Phone">
                          <input
                            type="tel"
                            autoComplete="tel"
                            placeholder="0400 000 000"
                            value={e.customer.phone}
                            maxLength={25}
                            onChange={(v) =>
                              patch("customer", {
                                ...e.customer,
                                phone: v.target.value,
                              })
                            }
                          />
                        </Field>
                      </div>
                      <Field label="Preferred contact method">
                        <select
                          value={e.customer.contactMethod}
                          onChange={(v) =>
                            patch("customer", {
                              ...e.customer,
                              contactMethod: v.target.value,
                            })
                          }
                        >
                          {OPTIONS.contactMethod.map((v) => (
                            <option key={v}>{v}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Anything else you’d like to share? (optional)">
                        <textarea
                          value={e.comments}
                          maxLength={2000}
                          onChange={(v) => patch("comments", v.target.value)}
                        />
                      </Field>
                      <label className="consent">
                        <input
                          type="checkbox"
                          checked={e.consent}
                          onChange={(v) => patch("consent", v.target.checked)}
                        />
                        <span>
                          I understand this is a demo, my details stay in this
                          browser, and no enquiry or message will be sent to the
                          business.
                        </span>
                      </label>
                    </>
                  )}
                  {step === 8 && (
                    <>
                      <h2>Your vision, in one place.</h2>
                      <p>
                        Review your project brief. You can edit any detail
                        before adding it to the demo dashboard.
                      </p>
                      {e.customer.email.endsWith("@example.com") && (
                        <div className="sample-notice">
                          <Sparkles size={15} />
                          Fictional sample enquiry · ready to explore
                        </div>
                      )}
                      <BriefSummary enquiry={e} onEdit={goto} />
                      <div className="info-note">
                        Submitting creates a local demo lead only. One Stop
                        Cabinets will not receive this enquiry.
                      </div>
                    </>
                  )}
                </div>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-navigation">
                  <button
                    className="text-button"
                    disabled={step === 0 || uploading}
                    onClick={() => goto(step - 2)}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    className="button"
                    disabled={uploading}
                    onClick={step === 8 ? submit : next}
                  >
                    {step === 8 ? "Submit Demo Enquiry" : "Continue"}
                    <ArrowRight size={17} />
                  </button>
                </div>
                <div className="form-bottom">
                  <span>
                    <ShieldCheck size={13} />
                    No enquiry is sent to the business
                  </span>
                  <button
                    className="text-button"
                    onClick={() => setRestart(true)}
                  >
                    <RotateCcw size={12} />
                    Start again
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
      <Dialog
        open={restart}
        onClose={() => setRestart(false)}
        title="Start your brief again?"
      >
        <p>
          Your current draft and reference previews will be cleared. Submitted
          demo leads stay in the dashboard.
        </p>
        <div className="dialog-actions">
          <button
            className="button secondary"
            onClick={() => setRestart(false)}
          >
            Keep my draft
          </button>
          <button
            className="button"
            onClick={() => {
              demo.restartDraft();
              setRestart(false);
              setError("");
            }}
          >
            Start again
          </button>
        </div>
      </Dialog>
    </>
  );
}

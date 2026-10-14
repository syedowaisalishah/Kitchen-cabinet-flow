"use client";
import Link from "next/link";
import {
  PanelTop,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  Play,
} from "lucide-react";
import { CustomerHeader, Footer } from "@/components/shell";
import { useDemo } from "@/lib/store";
import { SAMPLE } from "@/lib/config";
import { useRouter } from "next/navigation";
export default function DemoPage() {
  const demo = useDemo();
  const router = useRouter();
  return (
    <>
      <CustomerHeader />
      <main id="main" className="demo-page section">
        <span className="eyebrow">A SIMPLE IDEA FOR ONE STOP CABINETS</span>
        <h1>
          See the idea.
          <br />
          <em>Try the flow.</em>
        </h1>
        <p className="page-intro">A short pitch demo. Ask → Enquire → Track.</p>
        <div className="journey-cards">
          {[
            {
              icon: PanelTop,
              title: "Ask Kiki",
              step: "01",
              desc: "See how the kitchen assistant helps.",
              href: "/",
              action: "Try the customer view",
            },
            {
              icon: Users,
              title: "Capture an enquiry",
              step: "02",
              desc: "See a ready-to-review kitchen brief.",
              href: "/dashboard",
              action: "Open the demo overview",
            },
            {
              icon: Layers,
              title: "Track a project",
              step: "03",
              desc: "Move from design to installation.",
              href: "/dashboard/projects",
              action: "Open projects",
            },
          ].map((j) => (
            <Link className="journey-card" key={j.step} href={j.href}>
              <div>
                <j.icon size={28} />
                <span>{j.step}</span>
              </div>
              <h2>{j.title}</h2>
              <p>{j.desc}</p>
              <span>
                {j.action}
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
        <div className="demo-shortcuts">
          <button
            className="button"
            onClick={() => {
              demo.setDraft(structuredClone(SAMPLE));
              demo.setStep(8);
              router.push("/kitchen-enquiry");
            }}
          >
            <Sparkles size={17} />
            Try Sample Enquiry
          </button>
          <button
            className="button secondary"
            onClick={() => {
              demo.setTourStep(0);
              router.push("/");
            }}
          >
            <Play size={16} />
            Start Guided Tour
          </button>
          <Link href="/dashboard/leads?id=lead-demo-1" className="text-link">
            View Example Lead <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard/projects?id=OSC-DEMO-101"
            className="text-link"
          >
            View Example Project <ArrowRight size={16} />
          </Link>
        </div>
        <details className="pitch-details">
          <summary>About this concept</summary>
          <div className="pitch-details-content">
            <p>
              Independent proposal, not commissioned by the business. All
              records are fictional. Your demo changes stay in this browser;
              nothing is sent.
            </p>
          </div>
        </details>
      </main>
      <Footer />
    </>
  );
}

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  PanelTop,
  Users,
  Layers,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Brand, Dialog } from "./ui";
import { useDemo } from "@/lib/store";
import { SAMPLE } from "@/lib/config";
import { Chatbot } from "./chatbot";
const subscribeToMount = () => () => {};
export function CustomerHeader() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <div className="concept-strip">
        <span>
          <span className="live-dot" /> Independent concept demonstration
        </span>
        <Link href="/demo">
          Explore the connected experience <ArrowRight size={13} />
        </Link>
      </div>
      <header className="customer-header">
        <Brand />
        <nav
          className={menu ? "customer-nav expanded" : "customer-nav"}
          aria-label="Main navigation"
        >
          <Link onClick={() => setMenu(false)} href="/#services">
            Our services
          </Link>
          <Link onClick={() => setMenu(false)} href="/#inspiration">
            Kitchen inspiration
          </Link>
          <Link onClick={() => setMenu(false)} href="/#process">
            Our approach
          </Link>
          <Link
            onClick={() => setMenu(false)}
            href="/kitchen-enquiry"
            className="nav-cta"
          >
            Plan your kitchen <ArrowRight size={16} />
          </Link>
        </nav>
        <button
          className="icon-button mobile-menu"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Brand />
        <p>Thoughtful design. Beautifully made spaces.</p>
        <small>
          Independent concept for One Stop Cabinets.
          <br />
          Not commissioned or endorsed by the business.
        </small>
      </div>
      <div>
        <h3>Explore</h3>
        <Link href="/#services">Our services</Link>
        <Link href="/#inspiration">Kitchen inspiration</Link>
        <Link href="/kitchen-enquiry">Plan your kitchen</Link>
      </div>
      <div>
        <h3>The demonstration</h3>
        <Link href="/demo">How it connects</Link>
        <Link href="/dashboard">View Business Dashboard</Link>
        <a
          href="https://www.onestopcabinets.com.au/contact-us/"
          target="_blank"
          rel="noreferrer"
        >
          Official contact page ↗
        </a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 · Independent interactive concept</span>
        <span>All enquiries stay in this browser. Nothing is sent.</span>
      </div>
    </footer>
  );
}
const TOUR = [
  {
    title: "A better first conversation",
    text: "Start on the customer website. The kitchen assistant answers preliminary questions and helps turn an idea into a useful project brief.",
    href: "/",
    label: "Customer website",
  },
  {
    title: "A brief worth talking about",
    text: "Five easy steps collect your kitchen ideas, budget, photos and contact details. Optional details stay tucked away until you need them.",
    href: "/kitchen-enquiry",
    label: "Smart kitchen enquiry",
  },
  {
    title: "Every enquiry, ready to follow up",
    text: "The brief appears as an enquiry. One click converts it into a demo project.",
    href: "/dashboard/leads",
    label: "Sales dashboard",
  },
  {
    title: "One connected project journey",
    text: "Try Design, Production and Installation. The detailed timeline is there when you want it.",
    href: "/dashboard/projects",
    label: "Operations dashboard",
  },
];
export function GlobalControls() {
  const mounted = useSyncExternalStore(
    subscribeToMount,
    () => true,
    () => false,
  );
  const path = usePathname();
  const router = useRouter();
  const demo = useDemo();
  const [open, setOpen] = useState(false);
  const {
    tourStep: tour,
    setTourStep: setTour,
    chatOpen: chat,
    setChatOpen: setChat,
  } = demo;
  const [reset, setReset] = useState(false);
  const active = path.startsWith("/dashboard/projects")
    ? 2
    : path.startsWith("/dashboard")
      ? 1
      : 0;
  return (
    <>
      <div className="demo-dock">
        <button
          className="dock-label"
          aria-label="Interactive Demo"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          <Sparkles size={15} />
          <span>Explore demo</span>
          <ChevronDown size={14} />
        </button>
      </div>
      {open && (
        <div className="demo-menu">
          <div className="demo-menu-title">
            <span>Explore the possibilities</span>
            <button
              aria-label="Close demo menu"
              className="icon-button"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <nav className="demo-switcher" aria-label="Choose a demo journey">
            {[
              {
                label: "Customer",
                description: "Plan a kitchen",
                href: "/",
                icon: PanelTop,
              },
              {
                label: "Sales",
                description: "Review enquiries",
                href: "/dashboard",
                icon: Users,
              },
              {
                label: "Operations",
                description: "Follow projects",
                href: "/dashboard/projects",
                icon: Layers,
              },
            ].map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={active === index ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                <item.icon size={20} />
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </nav>
          <button
            onClick={() => {
              setTour(0);
              setOpen(false);
              router.push("/");
            }}
          >
            <Play size={16} />
            Start Guided Tour
          </button>
          <button
            onClick={() => {
              demo.setDraft(structuredClone(SAMPLE));
              demo.setStep(8);
              router.push("/kitchen-enquiry");
              setOpen(false);
            }}
          >
            <Sparkles size={16} />
            Try Sample Enquiry
          </button>
          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/leads?id=lead-demo-1"
          >
            <Users size={16} />
            View Example Lead
          </Link>
          <Link
            onClick={() => setOpen(false)}
            href="/dashboard/projects?id=OSC-DEMO-101"
          >
            <Layers size={16} />
            View Example Project
          </Link>
          <button
            onClick={() => {
              setReset(true);
              setOpen(false);
            }}
          >
            <RotateCcw size={16} />
            Reset Demo Data
          </button>
          <small>Fictional records. Stored only in your browser.</small>
        </div>
      )}
      {mounted && !path.startsWith("/dashboard") && (
        <Chatbot open={chat} setOpen={setChat} />
      )}
      <Dialog
        open={tour !== null}
        onClose={() => setTour(null)}
        title="A kitchen journey, connected"
        className="tour-dialog"
      >
        {tour !== null && (
          <>
            <span className="eyebrow">GUIDED TOUR · {tour + 1} OF 4</span>
            <h3>{TOUR[tour].title}</h3>
            <p>{TOUR[tour].text}</p>
            <div className="tour-path">
              <PanelTop />
              <ArrowRight />
              <Users />
              <ArrowRight />
              <Layers />
            </div>
            <div className="dialog-actions">
              <button className="text-button" onClick={() => setTour(null)}>
                Explore this screen
              </button>
              <button
                className="button"
                onClick={() => {
                  if (tour < 3) {
                    setTour(tour + 1);
                    router.push(TOUR[tour + 1].href);
                  } else {
                    setTour(null);
                    setOpen(true);
                  }
                }}
              >
                {tour < 3 ? "Next experience" : "Finish tour"}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        )}
      </Dialog>
      <Dialog
        open={reset}
        onClose={() => setReset(false)}
        title="Reset the demonstration?"
      >
        <p>
          This clears your local conversations, enquiries, uploaded previews and
          project changes, then restores the fictional examples.
        </p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={() => setReset(false)}>
            Keep my changes
          </button>
          <button
            className="button"
            onClick={() => {
              demo.reset();
              setReset(false);
              router.push("/");
            }}
          >
            Reset Demo Data
          </button>
        </div>
      </Dialog>
    </>
  );
}

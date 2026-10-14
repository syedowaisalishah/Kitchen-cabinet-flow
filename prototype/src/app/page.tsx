"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  PenTool,
  Ruler,
  Check,
  MessageCircle,
  Sparkles,
  PanelsTopLeft,
} from "lucide-react";
import { CustomerHeader, Footer } from "@/components/shell";
import { ButtonLink } from "@/components/ui";
import { useDemo } from "@/lib/store";
export default function Home() {
  const demo = useDemo();
  const [inspiration, setInspiration] = useState(0);
  return (
    <>
      <CustomerHeader />
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="small-line" /> CUSTOM KITCHENS & JOINERY · SYDNEY
            </span>
            <h1>
              A kitchen that
              <br />
              feels like <em>you.</em>
            </h1>
            <p>
              Custom kitchens, designed around your life.
              <br />
              Let’s bring your ideas together.
            </p>
            <ButtonLink href="/kitchen-enquiry">Plan Your Kitchen</ButtonLink>
            <button
              className="hero-chat"
              onClick={() => demo.setChatOpen(true)}
            >
              <MessageCircle size={18} />
              Ask Our Kitchen Assistant
              <ArrowUpRight size={15} />
            </button>
            <div className="hero-note">
              <Check size={17} />
              <span>Five easy steps. Your ideas, all in one place.</span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src={
                inspiration === 0
                  ? "/images/kitchen-hero.jpg"
                  : "/images/kitchen-dark.jpg"
              }
              alt={
                inspiration === 0
                  ? "Light-filled white kitchen with an island and warm timber stools"
                  : "Contemporary kitchen with a black island and warm cabinetry"
              }
              fetchPriority="high"
            />
            <div className="hero-image-label">
              <span>A LITTLE INSPIRATION</span>
              <strong>
                {inspiration === 0
                  ? "Space to make memories."
                  : "A fresh point of view."}
              </strong>
              <small>Independent inspiration imagery</small>
            </div>
            <div className="image-number">
              <span className="current-image">0{inspiration + 1} / 02</span>
              <button
                className="image-next"
                aria-label="Show next kitchen inspiration"
                onClick={() => setInspiration((value) => (value === 0 ? 1 : 0))}
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
          <div className="hero-vertical">DESIGNED AROUND YOU</div>
        </section>
        <section className="promise-bar">
          <span>
            <PenTool />
            Thoughtful 3D design
          </span>
          <span>
            <PanelsTopLeft />
            Custom-made joinery
          </span>
          <span>
            <Box />
            Made in-house
          </span>
          <span>
            <Ruler />
            From concept to completion
          </span>
        </section>
        <section className="intro section" id="services">
          <div className="section-top">
            <div>
              <span className="eyebrow">THE POSSIBILITIES</span>
              <h2>
                Your space.
                <br />
                Our craftsmanship.
              </h2>
            </div>
            <p>
              Whether you’re starting fresh or reimagining what’s already there,
              explore the right approach for your home.
            </p>
          </div>
          <div className="service-grid">
            {[
              {
                num: "01",
                title: "Custom kitchens",
                description:
                  "A place for everything. A kitchen shaped around your home, your habits and your ideas.",
                icon: PanelsTopLeft,
                type: "New custom kitchen",
              },
              {
                num: "02",
                title: "Kitchen renovations",
                description:
                  "Reimagine the heart of your home, from the first design discussion to the finishing touches.",
                icon: PenTool,
                type: "Complete kitchen renovation",
              },
              {
                num: "03",
                title: "Kitchen facelifts",
                description:
                  "A fresh perspective on your existing space. Explore a considered update to your cabinetry.",
                icon: Box,
                type: "Kitchen facelift",
              },
            ].map((s) => (
              <Link
                key={s.num}
                className="service-card"
                href={`/kitchen-enquiry?type=${encodeURIComponent(s.type)}`}
              >
                <div className="service-top">
                  <span>{s.num}</span>
                  <s.icon size={29} strokeWidth={1} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <span className="service-action">
                  Explore your options <ArrowUpRight size={19} />
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section className="inspiration section" id="inspiration">
          <div className="inspiration-photo">
            <img
              src="/images/kitchen-dark.jpg"
              alt="Contemporary kitchen with contrasting cabinets and a central island"
              loading="lazy"
            />
            <span className="photo-label">
              DESIGN INSPIRATION · NOT A CLIENT PROJECT
            </span>
          </div>
          <div className="inspiration-copy">
            <span className="eyebrow">A PLACE TO COME TOGETHER</span>
            <h2>
              Good design.
              <br />
              Great everyday living.
            </h2>
            <p>
              The morning coffee. The weeknight dinner. The conversations that
              carry on long after dessert. Your kitchen should make room for all
              of it.
            </p>
            <ul>
              <li>
                <Check size={17} />
                Layouts that work for your everyday
              </li>
              <li>
                <Check size={17} />
                Storage with a place for everything
              </li>
              <li>
                <Check size={17} />A look that feels at home
              </li>
            </ul>
            <ButtonLink href="/kitchen-enquiry" secondary>
              Let’s explore your kitchen
            </ButtonLink>
          </div>
        </section>
        <section className="process section" id="process">
          <span className="eyebrow">FROM AN IDEA TO A REAL SPACE</span>
          <div className="section-top">
            <h2>
              A little clarity.
              <br />A lot of possibility.
            </h2>
            <p>
              Start with your ideas. A site discussion and 3D design help bring
              the details together before your kitchen is made.
            </p>
          </div>
          <div className="process-grid">
            {[
              {
                n: "01",
                title: "Tell us your vision",
                text: "Explore your layout, style and what you need from your kitchen.",
              },
              {
                n: "02",
                title: "See it take shape",
                text: "Review your ideas through a design discussion and 3D visualisation.",
              },
              {
                n: "03",
                title: "Bring it to life",
                text: "Follow the journey through making, installation and handover.",
              },
            ].map((s) => (
              <div key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="planning-cta">
          <div>
            <span className="eyebrow">
              <Sparkles size={15} /> LET’S MAKE A START
            </span>
            <h2>
              Your new kitchen
              <br />
              starts with a conversation.
            </h2>
            <p>A few simple questions. A clearer picture of your project.</p>
          </div>
          <ButtonLink href="/kitchen-enquiry">Plan Your Kitchen</ButtonLink>
        </section>
        <section className="business-preview section">
          <span className="eyebrow">BEHIND THE EXPERIENCE</span>
          <h2>One enquiry. A connected journey.</h2>
          <p>
            See how the same project brief can flow from a customer conversation
            to sales, design and installation.
          </p>
          <Link className="text-link" href="/dashboard">
            View Business Dashboard <ArrowRight size={17} />
          </Link>
          <small>Proposed functionality · fictional customer records</small>
        </section>
      </main>
      <Footer />
    </>
  );
}

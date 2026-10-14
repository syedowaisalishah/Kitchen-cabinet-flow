"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ArrowUpRight, X, PanelsTopLeft } from "lucide-react";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      className="brand"
      href="/"
      aria-label="One Stop Cabinets concept home"
    >
      <span className="brand-symbol">
        <PanelsTopLeft size={27} />
      </span>
      <span>
        ONE STOP
        <span className="brand-sub">
          CABINETS{!compact && <span className="brand-dot"> · </span>}
          {!compact && <span className="brand-place">SYDNEY</span>}
        </span>
      </span>
    </Link>
  );
}
export function ButtonLink({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "secondary" : ""} ${className}`}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
  className = "",
  heading,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  heading?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (open && el && !el.open) el.showModal();
    else if (!open && el?.open) el.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
    >
      <div className="dialog-inner">
        <div className="dialog-heading">
          {heading || <h2>{title}</h2>}
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
export function AssistantAvatar({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={`assistant-avatar ${small ? "small" : ""}`}
      width={small ? 38 : 54}
      height={small ? 38 : 54}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="31" fill="#fff2d4" />
      <path
        d="M32 13V8"
        stroke="#263d33"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="8" r="3" fill="#f4a926" />
      <rect
        x="13"
        y="18"
        width="38"
        height="31"
        rx="11"
        fill="#f6bb48"
        stroke="#263d33"
        strokeWidth="2.5"
      />
      <path
        d="M12 30H8v8h5M52 30h4v8h-5"
        fill="#f6bb48"
        stroke="#263d33"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="31" r="2.6" fill="#263d33" />
      <circle cx="40" cy="31" r="2.6" fill="#263d33" />
      <path
        d="M25 40q7 7 14 0"
        fill="none"
        stroke="#263d33"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="37" r="2.5" fill="#e78929" />
      <circle cx="44" cy="37" r="2.5" fill="#e78929" />
      <path
        d="M24 53h16"
        stroke="#263d33"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}
export function LayoutDiagram({ layout }: { layout: string }) {
  const paths: Record<string, string> = {
    "L-shaped": "M20 16 V65 H78",
    "U-shaped": "M18 16 V65 H80 V16",
    Galley: "M18 20 H80 M18 62 H80",
    "Straight/single-wall": "M18 25 H80",
    "Island kitchen": "M18 18 V65 H80 M48 40 H75",
  };
  return (
    <svg width="100" height="80" viewBox="0 0 100 80" aria-hidden="true">
      <rect
        x="8"
        y="6"
        width="84"
        height="68"
        rx="3"
        fill="none"
        stroke="currentColor"
        opacity=".15"
        strokeWidth="1"
      />
      {paths[layout] ? (
        <path
          d={paths[layout]}
          stroke="currentColor"
          fill="none"
          strokeWidth="10"
          strokeLinejoin="round"
        />
      ) : (
        <text
          x="50"
          y="51"
          textAnchor="middle"
          fontSize="34"
          fill="currentColor"
        >
          ?
        </text>
      )}
    </svg>
  );
}

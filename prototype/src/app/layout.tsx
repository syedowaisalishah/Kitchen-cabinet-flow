import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoProvider } from "@/lib/store";
import { GlobalControls } from "@/components/shell";
import "./globals.css";
import "./pitch-theme.css";
export const metadata: Metadata = {
  title: "One Stop Cabinets · A kitchen journey, connected",
  description:
    "An independent interactive concept: explore a kitchen assistant, smart enquiry, sales dashboard and kitchen project workflow. Fictional records, browser-local data.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <DemoProvider>
          {children}
          <Suspense>
            <GlobalControls />
          </Suspense>
        </DemoProvider>
      </body>
    </html>
  );
}

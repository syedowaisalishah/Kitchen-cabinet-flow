import { Suspense } from "react";
import { Projects } from "@/components/dashboard";
export default function Page() {
  return (
    <Suspense fallback={<div className="loading">Loading demo projects…</div>}>
      <Projects />
    </Suspense>
  );
}

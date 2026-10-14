import { Suspense } from "react";
import { Leads } from "@/components/dashboard";
export default function Page() {
  return (
    <Suspense fallback={<div className="loading">Loading demo leads…</div>}>
      <Leads />
    </Suspense>
  );
}

import { Suspense } from "react";
import Enquiry from "@/components/enquiry";
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="section loading">
          Preparing your kitchen planner…
        </main>
      }
    >
      <Enquiry />
    </Suspense>
  );
}

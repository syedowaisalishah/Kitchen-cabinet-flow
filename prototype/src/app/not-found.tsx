import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="section empty-state">
      <h1>Let’s get you back on track.</h1>
      <p>This page is not part of the kitchen concept.</p>
      <Link href="/" className="button">
        Back to the website
      </Link>
    </main>
  );
}

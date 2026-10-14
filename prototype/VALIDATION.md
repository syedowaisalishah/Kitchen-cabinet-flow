# Verification record · 14 October 2026

Checked against the exported production website, served over HTTP with Chrome and Playwright.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed, strict TypeScript |
| `npm run lint` | Passed, no errors or warnings |
| `npm run build` | Passed, eight static entries including the icon and not-found page |
| `npm run test` | 11 passed in 32.0 seconds |
| `npm audit --omit=dev` | Zero reported production dependency vulnerabilities |

Browser scenarios:

1. Homepage → assistant services answer → capture fictional name/email/phone/layout/budget/timeline → prefilled five-step questionnaire → local submission → full CRM record → qualification → linked project → next stage → checklist/note → refresh → connected lead → reset to eight leads/two projects.
2. Required choice and negative dimension validation, metres-to-millimetres conversion, draft persistence through navigation and reload.
3. SVG rejection, over-8-MB rejection, valid image compression and preview persistence after refresh.
4. Sample enquiry shortcut, lead creation, follow-up task creation/completion/persistence, name search and stage filtering.
5. Guided tour across customer/enquiry/sales/operations, plus helpful recovery for unknown lead and project IDs.
6. Malformed localStorage recovery to fictional examples.
7–9. All eight principal routes/detail states at 375, 768 and 1440 pixels; document width equals the viewport width; assistant dialog stays within the viewport; no uncaught browser page errors.

Full-page screenshots were generated for each responsive route and visually reviewed for representative desktop and mobile screens. The primary workflow was exercised at the browser's desktop viewport; the form's initial screen and all internal detail screens were also checked at all three widths. This does not constitute an exhaustive audit across browsers, screen readers or every possible input combination.

Issues found during development were corrected before the final passing run: an incomplete JSX attribute, ambiguous test selectors, inconsistent sample shortcut destination, overflow caused by an absolutely positioned screen-reader label in a scrollable table, a fractional tablet-edge overflow, and a hydration race in the assistant panel. Public-page assistant/tour entry points use shared React context rather than simulated DOM clicks. The visual refresh increases text sizes and contrast, groups the planner into five screens, collapses optional details, and gives Kiki a visible avatar and readable chat bubbles.

The development-only lint dependency chain still carries an upstream braces advisory without a patched registry release. This is recorded in the README; these tools are absent from the deployed static runtime.

## Live verification

The deployed public Sites URL was opened in a fresh, unauthenticated Chrome context. Homepage, demo, enquiry, dashboard and seeded lead/project detail pages returned HTTP 200. Both local kitchen photographs loaded. A fictional enquiry was submitted in that browser, qualified, converted to a project, advanced to Site consultation and refreshed; the stage persisted. No browser console errors or uncaught page errors were observed. These actions changed only that test browser's local storage.

The tenth browser scenario verifies main-copy size and a contrast ratio of at least 4.5:1, the inspiration switcher, visible Kiki identity, and optional measurements staying collapsed while the five-step flow continues. Mobile leads are presented as complete cards rather than a horizontally clipped table.

The pitch refresh uses a navy-and-amber theme, short summary screens and expandable advanced controls. The conversion scenario verifies that a New enquiry converts in one click, stays Qualified rather than Won, creates exactly one linked project, supports direct Production/Installation navigation and survives refresh.

## Vercel preparation

Verified from a separate clean repository-root checkout with Node.js 22.23.3: `npm ci --include=dev`, root typecheck/lint/build scripts and all 11 browser tests passed (32.5 seconds). The root Vercel config publishes `prototype/out`; the application-directory config publishes `out`. No environment variables are required. This is a deployment-readiness check, not a Vercel publication.

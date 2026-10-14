# One Stop Cabinets · A kitchen journey, connected

A working, independent sales demonstration for Ali Khodadad. It connects a customer website, scripted kitchen assistant Kiki, smart kitchen questionnaire, conceptual CRM, and kitchen project workflow. It is **not commissioned, endorsed or operated by One Stop Cabinets or FAMS Renovations**.

**[Open the verified public demo](https://one-stop-kitchen-concept-ali.quietcrab12.chatgpt.site)** · [Demo introduction](https://one-stop-kitchen-concept-ali.quietcrab12.chatgpt.site/demo/)

## Run locally

Requires Node.js 22.x and npm (pinned in package engines and `.nvmrc`). No environment variables, database, API keys or paid services are required.

```bash
cd prototype # from the parent repository
npm ci
npm run dev
```

Open http://localhost:3000. Production and checks:

```bash
npm run typecheck
npm run lint
npm run build
npm run test
```

The build writes a complete static website to `out/`. Browser tests start a local Python 3 HTTP server on port 4173 and use the installed Chrome at `/opt/google/chrome/chrome`. Set `CHROME_PATH` to another Chrome/Chromium executable if necessary. The dev server is not required for these tests. On systems using Playwright-managed Chromium, install it with `npx playwright install chromium` and set `CHROME_PATH` to its executable. Tests retain traces on failure and generate desktop, tablet and mobile screenshots under `test-results/`.

## Research, 14 October 2026

Public sources inspected:

- [One Stop Cabinets homepage](https://www.onestopcabinets.com.au/): service-oriented navigation, kitchen photographs, services, enquiry calls to action, gallery, contact and multi-column footer. Published service descriptions include complete kitchens, kitchen facelifts, custom joinery, shop fitting and 3D design.
- [About](https://www.onestopcabinets.com.au/about-us/): a site discussion followed by a 3D design before manufacturing; joinery made in-house.
- [Renovations & Custom Kitchens](https://www.onestopcabinets.com.au/renovations-customs-kitchens/): consultation, 3D imaging and making/installing custom spaces.
- [Contact](https://www.onestopcabinets.com.au/contact-us/): an embedded `forms.monday.com` form, Sydney location, public phone and email. We did not submit the form. Its embedded fields, validation, downstream automations and CRM configuration were not inspected, so no claims are made about them.
- [Gallery](https://www.onestopcabinets.com.au/gallery/): page and navigation inspected; its dynamic gallery was not exposed in the textual browser response. Homepage/about photographs were available as references. No business photographs were copied into this app.
- [FAMS homepage](https://www.famsrenovations.com.au/) and [About](https://www.famsrenovations.com.au/about-us/): kitchen, bathroom, laundry, wardrobes, custom joinery and broader home renovations, with enquiry/contact calls to action. The homepage has name, phone, email and suburb inputs. The Projects link resolved to the homepage. The dedicated kitchen renovations page timed out; its content was not used as evidence.

The OSC homepage HTML and its public theme/header/footer CSS were inspected locally after a browser-agent request initially returned 403. A normal browser user-agent fetched them successfully. Verified design characteristics: amber `#faa51a`, dark navy `#002d59`, black/white surfaces, Montserrat text, PT Serif heading styling, left-hand branding, enquiry buttons, numbered service cards, prominent kitchen imagery and a multi-column footer. Responsive CSS exists in the source; we did not complete a separate visual audit of the original site's mobile layout.

This concept preserves the amber emphasis, typography family, services/navigation structure, kitchen imagery and enquiry focus. Cream, olive and sage surfaces, fewer navigation items, a textual concept wordmark and a modern workspace are deliberate design choices. They are not asserted to be identical to the original brand.

An opportunity inferred from the visible journey is to carry structured project information from the first conversation into a sales brief and onward to operations. We do not know the client's actual back-office process or claim its existing systems lack automation.

## What works

- Customer homepage with services, design inspiration, approach, consultation/enquiry entry points and official contact link.
- Floating kitchen assistant with editable knowledge, deterministic intent matching, typing state, follow-up suggestions, restart and capture of name, email, phone, project type, layout, budget and start preference. Collected answers transfer into the form.
- Five-step enquiry with SVG layout diagrams, project/finish preferences, storage and appliance details, preliminary measurements and unit conversion, budget/timeline categories, local photo previews, contact/consent validation, review/edit and demo submission.
- Draft/step autosave, optional photos/measurements, fictional sample shortcut and draft restart with discard protection.
- Submission creates a stable lead ID visible immediately in the same browser's CRM. Confirmation links directly to that record.
- Pitch overview shows Customer asks → Enquiry captured → Project tracked. KPIs and extra records are available under More demo records. Enquiries show a short brief first; full details, stages, tasks and activity remain available on demand.
- Convert to demo project is a one-click presentation shortcut. It marks the local fictional enquiry Qualified and creates its linked project atomically. It never marks a customer Won, sends an enquiry or changes a real CRM. Reopening the enquiry shows the existing project, preventing duplicates. A future production workflow must use the client’s approved qualification rules.
- Project cards and three clear Design / Production / Installation controls replace the empty Kanban columns. All 14 milestones, assignments, dates, notes and history remain behind an expandable details section. The checklist and current progress stay visible.
- Persistent Interactive Demo control with Customer, Sales and Operations journeys, a four-part guided tour, example record links, sample enquiry and full reset.
- Accessible labelled controls, keyboard focus, native dialogs with focus containment and Escape handling, reduced-motion styling and responsive layouts.

## Routes

| Route | Experience |
| --- | --- |
| `/` | Customer website |
| `/demo/` | Demonstration introduction and shortcuts |
| `/kitchen-enquiry/` | Enquiry planner and submission confirmation |
| `/dashboard/` | Record-derived sales overview |
| `/dashboard/leads/` | Lead table, search and status filter |
| `/dashboard/leads/?id=<leadId>` | Full lead record |
| `/dashboard/projects/` | Project board |
| `/dashboard/projects/?id=<projectId>` | Project workflow |

Detail IDs use query parameters rather than dynamic path segments so **new locally generated IDs work after a refresh on any static host**. Missing/reset IDs show a useful recovery page.

## Architecture

Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4/PostCSS, custom responsive CSS and Lucide icons. Everything is statically exported; the app has no API routes or backend.

| File / directory | Responsibility |
| --- | --- |
| `src/app/` | Routes, layout, metadata, styles and icon |
| `src/components/shell.tsx` | Customer navigation/footer, demo controls and tour |
| `src/components/chatbot.tsx` | Assistant interaction and handoff |
| `src/components/enquiry.tsx` | Questionnaire, file validation/previews and shared brief summary |
| `src/components/dashboard.tsx` | Workspace, overview, leads and projects |
| `src/components/ui.tsx` | Shared buttons, brand, dialog and layout SVGs |
| `src/lib/models.ts` | Typed Customer, KitchenEnquiry, Lead, ChatMessage, Project, Stage, Task, ActivityEvent and UploadedReference models; proposed adapter contract |
| `src/lib/config.ts` | Configurable options, sample brief, welcome message and knowledge base |
| `src/lib/chat.ts` | Contextual deterministic reply logic and capture |
| `src/lib/store.tsx` | Shared external store, browser persistence, state changes and UI context |
| `src/lib/seed.ts` | Eight fictional leads and two linked demo projects |
| `src/lib/validation.ts` | Shared enquiry validation |
| `tests/journey.spec.ts` | Production-output end-to-end and responsive tests |
| `public/` | Local licensed imagery/fonts |

The shared external store uses `useSyncExternalStore`, exposes business actions through context, hydrates safely after static rendering, and synchronises same-origin tabs with storage events. Lead and project IDs are stable UUID-based identifiers. Project references retain a `leadId`; assistant-generated leads retain a session ID and conversation summary. Activities have timestamps. Dates display with the user's Asia/Karachi timezone and Australian formatting.

## Data and privacy

- All records, questionnaire drafts, compressed image previews and chat messages live under localStorage key `osc-independent-concept-v1` on the current origin.
- Every browser/profile/domain has its own data. A URL does not share entered records with other visitors. Incognito, browser clearing or reset can remove the data.
- Images are decoded locally, resized to at most 1000 pixels on their longest edge, and saved as JPEG data URLs. Only JPG, PNG and WebP are accepted, at most five references and 8 MB per original image. Invalid, oversized or unreadable images produce visible errors. No original files are uploaded or preserved.
- Browser storage failures show a visible warning; the current visit can continue in memory, but refresh persistence is not promised.
- Stored shapes are validated; corrupt or incompatible data falls back to fictional examples. Saved references accept local sample paths or JPEG data URLs. User text renders as React text, never injected HTML.
- Reset clears local records, drafts, conversations, reference previews and project changes and restores samples. Restarting only the draft preserves submitted leads.
- Static resources are local. The product makes no CRM, AI, analytics, email, upload or booking requests. The official contact link is an explicit external navigation.

## Simulated functionality and limitations

The assistant is a scripted prototype, not a live generative AI model. CRM stages, tasks and project workflows are browser-only demonstrations, not live integrations with Monday.com, Pipedrive, an ERP or production business records. The sample customer names, contact details, assignments, milestones and dates are fictional. Budgets are enquiry categories, not quotes. Finish/material options are configurable preferences, not an assertion of the client's product catalogue. Progress represents the position in the conceptual sequence, not measured completion or an estimate of work effort.

This is not a secure customer record system: there is no staff authentication, cross-device persistence, collaborative conflict resolution, authoritative quotation logic or production file storage. It is intentionally usable without login. Stage changes and one-click demo conversions are freely reversible presentation actions. The tour uses an explanatory overlay and navigates among four experiences; it is not an automated task runner. Material procurement, inventory, accounting, payroll and manufacturing planning are outside scope.

The package audit reported a high-severity stack-exhaustion advisory through `braces` in the **development-only ESLint dependency chain**. The registry had no patched braces release at implementation time. No advisory was reported for production dependencies with `npm audit --omit=dev`. This static deployment contains no ESLint runtime. Review the lockfile and update the lint tooling when a patch is available.

## Assets

Photography is downloaded locally under the [Unsplash licence](https://unsplash.com/license), not hotlinked, and shown as independent inspiration rather than business projects:

- `kitchen-hero.jpg`: [Clay Banks — Modern white kitchen with island and bar stools](https://unsplash.com/photos/modern-white-kitchen-with-island-and-bar-stools-zAvzWN6CE5w).
- `kitchen-dark.jpg`: [Tile Merchant Ireland — A kitchen with white cabinets and a black island](https://unsplash.com/photos/a-kitchen-with-white-cabinets-and-a-black-island-1voJQ66DIDM).

Montserrat and PT Serif are locally hosted Google Fonts with their SIL Open Font Licence texts in `public/fonts/`. The concept wordmark and layout illustrations are code-native SVG/icons; the business's actual logo is not reproduced.

## Deployment

No secrets or environment configuration are needed. Never add CRM credentials to frontend variables. The checked-in `.openai/hosting.json` associates this concept with its Sites hosting project and exports `out/`; it is not a credential. Publication status is recorded in `DEPLOYMENT.md` after verification.

The prototype was published publicly with Sites and verified without authentication on 14 October 2026. Vercel and Netlify are documented alternatives; no deployment to either was performed.

**Vercel:** The repository now includes root and application `vercel.json` files. Import the repository with Root Directory `.`; the config uses the Other/static preset, installs with `npm ci --include=dev`, builds with `npm run build`, and publishes `prototype/out` on Node.js 22.x. If the Vercel project is already rooted at `prototype`, its local config publishes `out` instead. No environment variables are required. See [exact Vercel deployment steps](../VERCEL_DEPLOYMENT.md). This prepares the project; no Vercel deployment has been performed.

**Netlify:** Import the repository, base directory `prototype`, build command `npm run build`, publish directory `out`. A `netlify.toml` is supplied. Trailing-slash directory routes work directly; no SPA catch-all redirect is needed.

**Any static host:** Run `npm ci && npm run build`, then upload the complete `out/` directory. For a local production preview use `python3 -m http.server 4173 --directory out` and open http://localhost:4173. Serve via HTTP, not by opening `index.html` with a `file://` URL.

## Future integration boundaries

`IntegrationAdapter` in `models.ts` sketches a future server-backed boundary; it is not called in this prototype. Store actions such as `submit`, `setLeadStage` and `createProject` are the places to connect real application services, while keeping the UI and models stable. Read [FUTURE_INTEGRATIONS.md](FUTURE_INTEGRATIONS.md) before planning a live implementation, and [DEMO_GUIDE.md](DEMO_GUIDE.md) for the five-minute walkthrough.

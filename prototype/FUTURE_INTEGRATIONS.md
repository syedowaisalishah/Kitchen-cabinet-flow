# Moving from a concept to a client system

## Implemented today

Customer website, deterministic assistant Kiki, enquiry capture and review, browser-local lead creation, sales stages/tasks, linked project creation, 14-stage workflow, assignments, dates, checklists, notes, activity, guided tour and reset. These use one local data model. There is no external service connection, production authentication or server-side collection.

## Proposed integrations — none are live

| Boundary | Proposed implementation | Required discovery |
| --- | --- | --- |
| Existing website enquiries | Embed the assistant/planner in the authorised WordPress site or link to an approved hosted flow. Accept its structured brief on a validated server endpoint. Map the existing contact form into the same enquiry schema. | Ownership/access, theme constraints, field mapping, current Monday form behaviour, consent and brand approval. The observed Monday embed does not establish the client's actual CRM choice. |
| CRM | Implement a server-side adapter for the client's chosen platform. Create contacts/opportunities, attach the brief, map stage values, deduplicate and write external IDs back to records. Add webhook processing with idempotency and retries. | Platform, tenant, field definitions, qualification rules, access permissions, record retention and staff ownership. Do not assume Pipedrive or Monday is the required CRM. |
| Production AI assistant | Retain the UI and handoff model, replace `replyTo` with a server-side model service. Retrieve from a business-approved knowledge base and preserve evidence for factual answers. Use structured extraction with schema validation and customer confirmation. | Approved services/products/process information, costs, warranty wording, tone, handoff rules, evaluation examples and spending limits. Keys stay on the server. |
| Notifications | Send approved transactional notifications only after an authenticated/validated enquiry submission. Use an outbox and idempotent delivery; track delivery status separately from lead creation. | Recipients, consent, templates, provider and retry/failure handling. No email is sent by this prototype. |
| Appointments | Connect an approved booking provider and check real availability before offering slots. Tie the booking to its lead; handle timezone, cancellation and rescheduling. | Team calendars, service areas, duration, operating hours, lead time, travel and confirmation ownership. Current timeline choices are preferences only. |
| Projects / ERP | Add a server-side project adapter, a durable event history and team permissions. Map accepted lead/quote transitions to the client's operational milestones and responsibilities. | Existing software/API, process owners, stage definitions, lead-to-job conversion trigger, quote acceptance and production/installation rules. This is not a full ERP. |
| Photos and references | Replace JPEG data URLs with validated object-storage uploads and stable attachment IDs. Introduce limits, retention/deletion, file scanning, access control and signed reads. | Authorised provider, location, retention, privacy obligations and upload review process. Local demo previews are not production storage. |

## Architecture transition

1. Confirm actual customer and staff workflows with the client before integrating. Obtain permission to use their site and branding in a commissioned implementation.
2. Keep the reusable UI and TypeScript models, introduce stable server-generated IDs and versioned validation schemas, and replace local store mutations with a service/repository layer. The unused `IntegrationAdapter` type is a starting contract, not a completed connector.
3. Add staff sign-in, roles, authorised record access, server-side persistence and separate public enquiry endpoints. Never expose the production staff dashboard as the unauthenticated demo is exposed.
4. Preserve `leadId` relationships and map external contact/opportunity/job IDs. Use idempotency keys for submissions and webhook handlers so retries cannot create duplicate projects.
5. Publish an approved privacy notice, implement consent/retention/deletion and configure notification recipients explicitly. Replace fictional data only after access controls are verified.
6. Validate the approved knowledge base, file handling, integration retries, stage mapping and staff permissions in a staging environment. Pilot with test enquiries, then enable live capture deliberately.

No inventory valuation, accounting, payroll, procurement engine, production capacity planner or manufacturing resource planning is proposed as part of this initial system. A useful first client release would be enquiry capture, a confirmed CRM adapter, reliable follow-up and simple project visibility.

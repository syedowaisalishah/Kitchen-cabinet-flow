# Deploy to Vercel

The repository is configured for a static Vercel deployment. No environment variables, database, API keys or server are required.

Verified in a clean checkout on Node.js 22.23.3: root install, TypeScript, ESLint and production build passed; all 11 browser tests passed. The exported pages, detail route shells and local assets exist in `prototype/out`. No Vercel account deployment was performed.

## Git deployment — recommended

1. Commit and push these files to your Git repository, including both `package-lock.json` files.
2. In Vercel, choose **Add New → Project**, then import the repository.
3. Keep **Root Directory** at the repository root (`.`). The checked-in `vercel.json` supplies these settings:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Other |
   | Install Command | `npm ci --include=dev` |
   | Build Command | `npm run build` |
   | Output Directory | `prototype/out` |
   | Node.js | `22.x` |
   | Environment variables | None |

4. Click **Deploy**. Vercel returns the deployment URL when the build succeeds.
5. To share the production demo publicly, check that production Deployment Protection permits visitors without a Vercel login.

The app is built with Next.js, but the **Other** preset is intentional: Vercel serves the already exported HTML, CSS, JavaScript and assets. No Next.js server or functions are needed. Do not add a catch-all rewrite to `/index.html`; each route has its own exported page.

The root package's `postinstall` installs the application from the committed `prototype/package-lock.json`. Root scripts run the application inside `prototype/`.

If your existing Vercel project already uses **Root Directory `prototype`**, keep it there. `prototype/vercel.json` supports that setup with the same commands and output directory `out`. Do not mix the root's `prototype/out` output setting with the `prototype` root directory.

## CLI deployment

From the repository root:

```bash
nvm use
npm ci
npm run typecheck
npm run lint
npm run build
npx vercel login
npx vercel --prod
```

When prompted, select the intended Vercel account/project and keep the project directory as `.`. For an existing project, use `npx vercel link` before `npx vercel --prod`. The same CLI workflow works from `prototype/` using its own configuration.

Vercel authentication is required to publish. It is not required to run or build the application locally. This preparation does not create a Vercel deployment or change the current Sites URL.

## Verify the deployed site

- Open `/`, `/demo/`, and `/dashboard/`.
- Refresh `/dashboard/leads/?id=lead-demo-2` and `/dashboard/projects/?id=OSC-DEMO-101` directly.
- Check that kitchen photographs, fonts and Kiki load.
- Submit a fictional sample, convert it to a demo project, then refresh.
- Share `/dashboard/` for the pitch overview.

All entered records remain in browser-local storage on the Vercel domain. Records entered on the existing Sites domain will not transfer to a new Vercel domain. Every visitor starts with fictional samples.

## Troubleshooting

- **Output directory missing:** match the output path to the selected Root Directory: repository root → `prototype/out`; `prototype` → `out`.
- **Application dependencies missing:** use `npm ci`; the root's postinstall installs the application. Commit both lockfiles.
- **Node version mismatch:** use Node.js `22.x`, as specified in the package engines and `.nvmrc` files.
- **Refresh gives a 404:** retain trailing slashes and remove any legacy SPA catch-all rewrites.
- **Visitors see a Vercel login:** review production Deployment Protection in your Vercel project settings.

Configuration references: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

# Promptless.ai Cutover Runbook (Phase 2)

This runbook is for the preview-to-production switch after Phase 2 website+docs unification is approved.

## 1. Preconditions

- Main branch is green on:
  - `npm run check`
  - `npm run test:smoke`
- Manual QA complete on preview for:
  - `/`
  - `/demo`
  - `/pricing`
  - `/docs/getting-started/welcome`
  - one docs detail page
  - `/blog`
  - one blog detail page
  - `/changelog`
  - one changelog detail page
  - `/llms.txt`
  - `/llms-full.txt`
- Visual sign-off complete against Frances baseline:
  - `/Users/prithvi/promptless/docs/migration/visual-comparison/checklists/milestone-gates.md`
  - `/Users/prithvi/promptless/docs/migration/visual-comparison/checklists/no-clobbering.md`

## 2. Environment + Canonical URL

- Set `SITE_URL` in production to `https://promptless.ai`.
- Set:
  - `PUBLIC_FREE_TOOLS_API_BASE_URL=https://api.gopromptless.ai`
  - `PUBLIC_TURNSTILE_SITE_KEY=<production site key>`
- Confirm preview environments still use non-production `SITE_URL` values or default behavior.

## 3. Routing/DNS switch

- Point production deployment target to this unified Astro/Starlight app.
- Keep docs compatibility hosts attached with host-level redirects:
  - `docs.promptless.ai/*` -> `https://promptless.ai/*` (`301`)
  - `docs.gopromptless.ai/*` -> `https://promptless.ai/*` (`301`, if attached to the same Vercel project)
- Ensure domain routes resolve as expected:
  - website: `/`, `/demo`, `/pricing`, `/meet`
  - docs: `/docs/*`
  - blog/changelog: `/blog/*`, `/changelog/*`
  - free tools: `/free-tools/*`

## 4. Post-cutover smoke checks

- Verify live responses:
  - `/` -> `200`
  - `/demo` -> `200`
  - `/pricing` -> `200`
  - `/meet` -> `200`
  - `/free-tools` -> `200`
  - `/free-tools/broken-link-report` -> `200`
  - `/privacy` -> `200`
  - `/terms` -> `200`
  - `/home` -> redirect to `/`
  - `/page` -> redirect to `/`
  - `/wtd` -> redirect to `/`
  - `/hn` -> redirect to `/`
  - `/site` -> redirect to `/demo`
  - `/site/demo` -> redirect to `/demo`
  - `/video-demo` -> redirect to `/demo`
  - `/blog/customer-stories-vellum` -> redirect to `/blog/customer-stories/vellum`
  - `/use-cases` -> redirect to `/`
  - `/faq` -> redirect to `/`
  - `/api-reference` -> redirect to `/`
- Confirm header tabs and active states on website/docs/blog/changelog.
- Confirm website and docs visual consistency (logo scale, nav spacing, sidebar width).
- Confirm `llms.txt`, `llms-full.txt`, and sitemap are reachable.

## 5. 24-hour monitoring

- Watch for:
  - 404 spikes
  - redirect loops/mismatches
  - broken internal links
  - search regressions
- If blocking regressions appear, rollback by redeploying prior stable production artifact.

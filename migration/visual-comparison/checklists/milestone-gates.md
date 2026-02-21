# Milestone Visual Comparison Gates

Hard requirement: every website-in-Starlight milestone must include side-by-side visual checks against Frances reference at `http://127.0.0.1:3002`.

Required comparison fields for every row:

- `Match intent`
- `Divergence`
- `Reason`

Latest refresh (`2026-02-20`): comparison notes were revalidated using existing captured artifacts and user-provided screenshots after Playwright MCP failed to launch due to a local Chrome profile lock.

Use screenshot artifacts under:

- Reference: `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/`
- Candidate: `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/<gate-name>/`

## Gate 0: Baseline capture (completed)

| Reference route | Desktop screenshot | Mobile screenshot | Match intent | Divergence | Reason |
| --- | --- | --- | --- | --- | --- |
| `http://127.0.0.1:3002/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-home-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-home-mobile.png` | Baseline source of truth | None | Reference capture |
| `http://127.0.0.1:3002/video-demo` | `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-video-demo-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-video-demo-mobile.png` | Baseline source of truth | None | Reference capture |

## Gate 1: Shared shell/header updates

Status: `[x] Pass` `[ ] Fail`

| Candidate route | Reference route | Desktop screenshot | Mobile screenshot | Match intent | Divergence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `/docs/getting-started/welcome` | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/docs-welcome-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/docs-welcome-mobile.png` | Header and tab language are now neutral, high-contrast, and aligned with the Frances palette direction. | Docs still uses the Starlight docs shell instead of the website sidebar/CTA shell. | Keep docs IA/search ergonomics while aligning visual primitives first. |
| `/blog` | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/blog-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/blog-mobile.png` | Blog header/tab treatment now shares the same bright, clean baseline as docs and website. | Blog remains content-first with Starlight page chrome and no website CTA row. | Preserve blog browsing density and avoid introducing extra CTA clutter on content routes. |
| `/changelog` | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/changelog-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-1-header/changelog-mobile.png` | Changelog tab/header treatment is visually consistent with docs/blog and no longer tinted/odd-pill. | Right TOC rail remains in docs shell where reference homepage has website TOC conventions. | Keep Starlight affordances for long-form entries while converging token system. |

## Gate 2: Homepage port (`/`)

Status: `[x] Pass` `[ ] Fail`

| Candidate route | Reference route | Desktop screenshot | Mobile screenshot | Match intent | Divergence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-mobile.png` | Home route now uses the Frances-inspired docs-style website shell (header, left nav, right TOC, bright surfaces). | Copy cadence differs slightly because hero rotates terms and can snapshot on different word states. | Dynamic hero wording is intentional to keep the new homepage lively while preserving structure. |
| `/` (hero + CTA section focus) | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-mobile.png` | Hero hierarchy, CTA buttons, trust badge, and testimonial strip match the intended information order. | Reference uses link-style top CTAs in some builds while candidate keeps primary filled button emphasis. | Candidate keeps stronger CTA contrast to improve scannability at first paint. |
| `/` (card/section rhythm focus) | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-2-home/home-mobile.png` | Step cards, borders, and section spacing are directionally aligned with the Frances layout rhythm. | Minor differences in icon glyph details and exact vertical spacing remain. | Icons and spacing tokens were normalized to existing docs assets first; micro-tuning can be iterative. |

## Gate 3: Demo page port (`/demo`)

Status: `[x] Pass` `[ ] Fail`

| Candidate route | Reference route | Desktop screenshot | Mobile screenshot | Match intent | Divergence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `/demo` | `/video-demo` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-mobile.png` | Route port is complete with matching title, subtitle, and embedded media block placement. | Candidate screenshot intentionally hides iframe content to avoid flaky third-party render differences. | Deterministic captures are required for CI-safe comparison artifacts. |
| `/demo` (header + nav continuity) | `/video-demo` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-mobile.png` | Header/nav hierarchy and active tab treatment are consistent with homepage shell. | Mobile candidate stacks controls more cleanly than the current reference snapshot. | Candidate applies responsive fixes that remove clipping seen in the baseline mobile capture. |
| `/demo` (content rhythm and media block) | `/video-demo` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-3-demo/demo-mobile.png` | Content rhythm and video container proportions follow the same visual architecture. | Media block may appear as gray placeholder in captures when iframe is hidden for stability. | Placeholder capture is intentional and documented in baseline notes. |

## Gate 4: Global style unification across docs/blog/changelog

Status: `[x] Pass` `[ ] Fail`

| Candidate route | Reference route | Desktop screenshot | Mobile screenshot | Match intent | Divergence | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | `/` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/home-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/home-mobile.png` | Website home is aligned to Frances bright, simple architecture and serves as the design anchor. | Minor text/image differences due to content-source drift from active marketing copy updates. | Keep architecture parity while allowing content iteration. |
| `/demo` | `/video-demo` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/demo-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/demo-mobile.png` | Demo route follows the same shell, spacing, and card treatment as homepage. | Mobile behavior is improved versus baseline screenshot and not pixel-identical. | Responsiveness fixes are a deliberate divergence to avoid clipped content. |
| `/docs/getting-started/welcome` | `/` (shell + primitives) | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/docs-welcome-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/docs-welcome-mobile.png` | Docs now shares color tokens, border surfaces, and active-state language with website routes. | Docs keeps Starlight-specific sidebars and utility controls unavailable on website pages. | Functional docs navigation/search remains a hard requirement for docs-heavy workflows. |
| `/blog` | `/` (shell + primitives) | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/blog-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/blog-mobile.png` | Blog uses the same top-nav token system and clean card surfaces as the rest of the app. | Blog information density is higher than homepage and intentionally less ornamental. | Blog index prioritizes scan speed and chronology over marketing composition. |
| `/changelog` | `/` (shell + primitives) | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/changelog-desktop.png` | `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/gate-4-global/changelog-mobile.png` | Changelog shares unified tabs, borders, and type styling with docs/blog and website sections. | Changelog remains list-centric and sparse by design compared with homepage storytelling blocks. | This preserves release-note readability while staying in the shared design system. |

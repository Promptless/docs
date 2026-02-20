# Visual Architecture Baseline (Frances Reference)

This folder is the mandatory visual architecture baseline for website-in-Starlight work.

All milestone reviews must compare against Frances's reference site running at `http://127.0.0.1:3002`.

## Required baseline captures

Reference screenshots (desktop + mobile):

- `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-home-desktop.png` for `http://127.0.0.1:3002/`
- `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-home-mobile.png` for `http://127.0.0.1:3002/`
- `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-video-demo-desktop.png` for `http://127.0.0.1:3002/video-demo`
- `/Users/prithvi/promptless/docs/migration/visual-comparison/reference/frances-video-demo-mobile.png` for `http://127.0.0.1:3002/video-demo`

## Baseline metrics and primitives

- `/Users/prithvi/promptless/docs/migration/visual-comparison/metrics/frances-layout-primitives.json`
- `/Users/prithvi/promptless/docs/migration/visual-comparison/metrics/frances-layout-primitives.md`

These files record:

- Header height + surface treatment
- Nav/tab active treatment
- Content width and sidebar/toc proportions
- Section spacing rhythm
- Card/border style
- CTA styling
- Color tokens

## Milestone gating workflow

Use `/Users/prithvi/promptless/docs/migration/visual-comparison/checklists/milestone-gates.md` at every milestone:

1. Capture candidate screenshots for desktop and mobile.
2. Store them under `/Users/prithvi/promptless/docs/migration/visual-comparison/candidate/<gate-name>/`.
3. Fill `Match intent`, `Divergence`, and `Reason` for each major section.
4. Do not mark a milestone complete until all rows are filled.

`/demo` is always compared against Frances `/video-demo`.

## Fallback when browser tooling is unavailable

If Playwright/browser tooling is unavailable:

1. Use user-provided screenshots for candidate pages.
2. Keep the same milestone checklist structure.
3. Still provide `Match intent`, `Divergence`, and `Reason` notes.
4. Mark the capture source as `user-provided` in the checklist row.

## Capture notes

- `video-demo` screenshots were captured with the embedded iframe hidden to avoid screenshot timeouts from third-party font loading.

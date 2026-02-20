# Frances Reference Layout Primitives

Source: `http://127.0.0.1:3002`  
Captured: `2026-02-20`

## Header + nav

- Header is two-tiered and totals `95px` on desktop/mobile.
- Top row is `48px` tall with left logo and right CTA pair (`Sign up`, `Book demo`).
- Second row is `36px` tall with tabs (`Documentation`, `Website`, `Dashboard`).
- Header surface is neutral (`bg-white`, `border-gray-200`) with no tint and no drop shadow.

## Tab treatment

- Active tab is text-color emphasis (`#506AEA`) plus a `2px` bottom underline.
- Inactive tabs are muted (`gray-600`) with a simple hover to darker text.
- No active pill/chip background in top tabs.

## Layout widths

- Desktop shell uses a fixed left sidebar of `256px`.
- Main content measured at `1184px` wide with `40px` inline padding.
- Home page desktop TOC rail is `224px`.

## Section spacing rhythm

- Home spacing sequence is approximately: `8px`, `24px`, `24px`, `40px`, `64px`.
- Video demo starts with `8px` then `24px` between intro blocks.

## Card + border style

- Testimonial card surface is white with `1px` soft border and `8px` radius.
- Card padding is `16px 20px`.
- Shadow depth is subtle (`shadow-sm` equivalent).

## CTA style

- Header CTAs are compact dark buttons (`gray-900`) with white text.
- Radius is `8px`, padding roughly `12px` horizontal and `8px` vertical.
- Typography is `14px` / medium weight.

## Color token set

- `--background: #ffffff`
- `--foreground: #171717`
- `--docs-sidebar-bg: #ffffff`
- `--docs-sidebar-active-bg: #f3f4f6`
- `--docs-sidebar-active-border: #506AEA`
- `--docs-card-bg: #f9fafb`
- `--docs-code-bg: #1e293b`
- `--docs-border: #e5e7eb`

## Major section intent notes

| Major section | Match intent target | Common divergence to flag | Reason to document |
| --- | --- | --- | --- |
| Header shell | Neutral white surface, compact two-row structure | Tinted top bar, oversized height, weak CTA hierarchy | Shell drift breaks cross-page coherence first |
| Primary tabs | Text + underline active state | Pill/chip active treatment, heavy backgrounds | Reference uses restraint, not ornament |
| Sidebar rail | Narrow docs-style navigation with soft active background | Over-dense spacing or oversized icons | Navigation should stay lightweight |
| Hero block | Clear type hierarchy, simple form CTA row | Excess decorative effects, cramped mobile text | Readability and scanning speed |
| Cards | Light surface, soft border, low shadow | Mixed card systems across pages | Cards should feel from one design system |
| Global rhythm | Predictable spacing progression (`8/24/40/64`) | Inconsistent gaps per route | Inconsistent rhythm creates clobbered feel |

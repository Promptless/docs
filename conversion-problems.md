# Website Conversion Problems Log

This is a running log of identified conversion rate problems on the Promptless marketing site. Each entry includes a hypothesis, supporting evidence, a testable prediction, and research on how to fix it. Problems are never deleted from this log -- only appended.

---

## Problem #1: Homepage has no CTA below the fold -- visitors who scroll the full page have no way to convert without scrolling back to the top

**Date identified**: 2026-03-24

**Category**: CTA

**Hypothesis**: The homepage has only one CTA (the hero email form at the very top). After the hero, the page presents Testimonials, How It Works (4 steps with screenshots), platform logos, and Why Promptless (6 capability cards) -- but none of these sections include a call-to-action. Visitors who scroll the full page and become convinced have no conversion mechanism at the decision point; they must scroll back to the top. This violates a core SaaS landing page best practice (repeating CTAs throughout the page, especially at the bottom) and is likely depressing the homepage conversion rate.

**Evidence**:
- PostHog funnel (last 30 days): 173 unique homepage visitors, only 3 converted to `demo_requested` -- a 1.73% conversion rate with 98.27% drop-off. This is below the SaaS median of 3.0-3.8%.
- PostHog breakdown of `demo_requested` by `location`: All 7 demo requests in the last 30 days came from "hero" -- zero from any other location, because no other location exists.
- Code inspection of `Testimonials.astro`, `HowItWorks.astro`, and `WhyPromptless.astro` confirms zero CTA elements (no forms, buttons, or links to /demo or cal.com) in any below-the-fold section.
- Full-page screenshot (1440x5000px) visually confirms the hero email form is the sole conversion element on the entire homepage.
- The homepage content flow (Hero -> Testimonials -> How It Works -> Why Promptless -> Footer) is designed to build conviction progressively, yet the conversion action is only available at the START of this journey, not at the END when conviction peaks.

**Testable prediction**: I predict that adding a repeated email capture CTA (matching the hero form) at the bottom of the homepage -- specifically after the WhyPromptless section -- will increase the homepage-to-demo conversion rate from 1.73% to at least 3.5% (the SaaS median) within 30 days of deployment. This is because visitors who scroll through the full page represent the most engaged segment, and providing a conversion mechanism at their point of maximum conviction will capture conversions currently lost to scroll fatigue. Industry research shows personalized, repeated CTAs convert up to 202% better than single-placement CTAs.

**Recommended fix**:
- Add a new "bottom CTA" section component (e.g., `BottomCTA.astro`) with a headline like "Ready to eliminate docs drift?" and the same email capture form used in the hero
- Place it after `<WhyPromptless />` in `src/content/website/home.mdx`
- Track submissions with `demo_requested` event using `location: "bottom_cta"` to measure incremental conversions from this placement
- Ensure the CTA is visually prominent with contrasting background to distinguish it from the capability cards above
- Consider A/B testing the bottom CTA copy (e.g., "Book demo" vs. "See it in action" vs. "Start your free trial") once feature flags are configured in PostHog

**Research sources**:
- Unbounce Conversion Benchmark Report: SaaS landing pages average 9.5% conversion, median 3.0%. Repeating CTAs throughout the page is a top recommendation. (https://unbounce.com/conversion-rate-optimization/the-state-of-saas-landing-pages/)
- Heyflow SaaS Landing Page Best Practices: "Ensure your CTA is prominent and repeated throughout the page... place it in multiple locations to increase the chances of conversion." (https://heyflow.com/blog/saas-landing-page-best-practices/)
- Webstacks 2026 SaaS Conversion Guide: personalized CTAs convert 202% better than generic ones; the bottom CTA should serve as the "final close" backed by social proof. (https://www.webstacks.com/blog/website-conversions-for-saas-businesses)
- Landingi SaaS Best Practices: "Keep all CTAs consistent" -- multiple CTAs on a single page are fine as long as they point to the same destination. (https://landingi.com/landing-page/saas-best-practices/)

**Applies to**: Homepage (`/`), specifically `src/content/website/home.mdx`, and requires a new component or reuse of the hero form pattern

---

<!-- New problems go above this line, most recent first -->

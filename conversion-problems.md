# Website Conversion Problems Log

This is a running log of identified conversion rate problems on the Promptless marketing site. Each entry includes a hypothesis, supporting evidence, a testable prediction, and research on how to fix it. Problems are never deleted from this log -- only appended.

---

## Problem #2: Pricing page "Book demo" CTAs link directly to external Cal.com, bypassing email capture and making pricing-page conversions invisible

**Date identified**: 2026-03-24

**Category**: Funnel / Tracking gap

**Hypothesis**: The Growth and Enterprise pricing plan CTAs (`<a href="https://cal.com/team/promptless/15m-discovery-call">Book demo</a>`) navigate visitors directly to an external Cal.com URL, completely bypassing the `/demo` page funnel. This creates two compounding problems: (1) a conversion problem -- the visitor leaves the Promptless domain without providing their email, so the lead is not captured by Formspark or PostHog before the Cal.com step, and (2) a measurement problem -- no `demo_requested` event fires, no `cta_clicked` event is reliably recorded (the browser navigates away before the beacon completes), and there is no way to attribute bookings back to the pricing page. Pricing visitors are the highest-intent segment on any B2B SaaS site -- they are actively evaluating cost and fit -- yet the current CTA design sends them into a tracking black hole. The homepage hero and blog CTAs correctly route through `/demo` (which captures email, fires `demo_requested`, and then mounts Cal.com with the email prefilled), but the pricing page skips this critical step entirely.

**Evidence**:
- PostHog funnel (last 30 days): 34 unique visitors viewed `/pricing`, but **0 converted to `demo_requested`** -- a 0.0% measured conversion rate with 100% drop-off. This is the worst-performing page in the funnel despite being the 5th most-trafficked page on the site.
- PostHog `cta_clicked` breakdown by location (last 30 days): Only 1 click from `pricing_startup`. Zero clicks from `pricing_growth` or `pricing_enterprise` were recorded, despite those plans having prominent "Book demo" buttons. This strongly suggests either (a) no one clicked them, or (b) the browser navigates to Cal.com before the sendBeacon completes.
- PostHog `demo_requested` breakdown by location (last 30 days): All 7 demo requests came from location `"hero"`. Zero from `"demo_page"`, zero from any pricing location. The pricing page is a conversion dead end.
- PostHog funnel: pricing -> /demo page (last 30 days): 34 pricing visitors, 11 (32.35%) eventually visited `/demo` -- but via other navigation (e.g., the header "Book demo" link which correctly routes to `/demo`), not via the pricing CTAs. This proves pricing visitors have conversion intent, but the pricing CTAs fail to capture it.
- Code inspection of `PricingCard.astro` line 110: Growth and Enterprise CTAs render as `<a href={ctaHref}>` where `ctaHref` is `"https://cal.com/team/promptless/15m-discovery-call"` -- an external URL with no email gate, no PostHog event, and no Formspark submission. Compare this to Hero.astro (lines 60-81) which intercepts form submission, stores email in sessionStorage, fires `demo_requested` to PostHog, and redirects to `/demo`.
- Screenshot of pricing page confirms the Growth and Enterprise "Book demo" buttons are standard `<a>` links that navigate immediately off-site.

**Testable prediction**: I predict that changing the Growth and Enterprise pricing CTAs to route through `/demo` (matching the hero and blog CTA flow) will: (1) make pricing page conversions measurable by firing `demo_requested` with `location: "pricing_growth"` or `location: "pricing_enterprise"`, (2) increase the pricing-page-to-demo-booked conversion rate from the current unmeasurable 0% to at least 5-8% within 30 days (pricing pages with transparent pricing convert 4.6% on average per Chili Piper benchmarks, and top performers hit 7-10% per industry data), and (3) capture an estimated 1-3 additional leads per month from pricing visitors who currently leave the site without any email capture. Given that 11 of 34 pricing visitors (32%) already find their way to `/demo` through other navigation, routing the CTAs properly should convert a meaningful share of the remaining 23 visitors who currently bounce off-site.

**Recommended fix**:
- Change `GROWTH_PLAN.ctaHref` and `ENTERPRISE_PLAN.ctaHref` in `src/components/site/pricing/pricing.config.ts` from `"https://cal.com/team/promptless/15m-discovery-call"` to `"/demo"` so they route through the email-gated demo booking flow like every other CTA on the site
- Alternatively, if the team wants to keep the pricing CTA click as a distinct conversion event, add an intermediate step: make the pricing "Book demo" buttons open the same email gate used on `/demo` (either inline on the pricing page, or by navigating to `/demo` with a query parameter like `?ref=pricing_growth` that can be tracked)
- Update the `data-track-location` values on the pricing CTAs to include the plan tier (already done: `pricing_growth`, `pricing_enterprise`) so that once routed through `/demo`, the `demo_requested` event can distinguish pricing-sourced leads
- Consider storing the selected plan tier in sessionStorage (alongside the email) so the Cal.com booking page or the sales team can see which plan the visitor was evaluating -- this adds valuable context to the discovery call
- Long-term: embed the Cal.com calendar directly on the pricing page (behind an email gate) to eliminate the extra navigation step, following the industry trend toward embedded scheduling (only 18% of B2B SaaS companies currently do this, but it significantly reduces friction per Chili Piper's research)

**Research sources**:
- Chili Piper 2025 Demo Form Conversion Rate Benchmark Report: Median qualified-to-booked rate is 62%. Scheduling tools on the website reduce back-and-forth and capture leads when intent is highest. Only 18% of B2B SaaS companies embed scheduling on their website. (https://www.chilipiper.com/post/form-conversion-rate-benchmark-report)
- InfluenceFlow SaaS Pricing Page Best Practices 2026: Match the CTA to the buying motion -- enterprise/sales-led tiers should route through a demo page where you can qualify the prospect, set expectations, and capture information before the meeting is booked. Progressive disclosure is a core UX strategy for 2026. (https://influenceflow.io/resources/saas-pricing-page-best-practices-complete-guide-for-2026/)
- PipelineRoad SaaS Pricing Page Best Practices 2026: "Track downstream metrics, not just clicks. A variant that increases CTA clicks but decreases actual trial activations is a false positive -- always track the downstream metric." An intermediate demo page can qualify intent before the calendar step. (https://pipelineroad.com/agency/blog/saas-pricing-page-best-practices)
- RevenueHero State of Demo Conversion Rates 2025: Responding to leads within the first minute increases conversions by 391%. Letting prospects self-schedule in one click (on your site, not an external URL) maximizes conversion at the moment of highest intent. (https://www.revenuehero.io/blog/the-state-of-demo-conversion-rates-in-2025)
- Howdygo 8 Examples to Increase Book a Demo Page Conversion: Removing top menu bars from demo booking pages improves conversion by 2.3%; 88% of people say they wouldn't book a demo without having seen a product first -- the `/demo` page includes a demo video, while the direct Cal.com link does not. (https://www.howdygo.com/blog/increase-conversion-of-your-book-a-demo-page)

**Applies to**: Pricing page (`/pricing`), specifically `src/components/site/pricing/pricing.config.ts` (GROWTH_PLAN.ctaHref, ENTERPRISE_PLAN.ctaHref) and `src/components/site/pricing/PricingCard.astro` (the CTA rendering logic for non-startup plans)

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

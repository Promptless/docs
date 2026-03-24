# Website Conversion Problems Log

This is a running log of identified conversion rate problems on the Promptless marketing site. Each entry includes a hypothesis, supporting evidence, a testable prediction, and research on how to fix it. Problems are never deleted from this log -- only appended.

---

## Problem #3: Documentation section is a conversion dead end -- 51 of 52 docs pages have zero CTAs, wasting the site's most engaged audience

**Date identified**: 2026-03-24

**Category**: CTA / Structure

**Hypothesis**: The documentation section (`/docs/...`) receives 21% of total site traffic (273 pageviews, 43 unique users in the last 30 days), yet only 1 of 52 docs pages (the welcome page) contains any call-to-action linking to `/demo`. The remaining 51 pages -- which account for 72% of docs traffic (198 pageviews) -- end without any conversion mechanism. Docs visitors are the most deeply engaged audience on the entire site, averaging 6.35 pages per user, and they are actively evaluating the product's capabilities, integrations, and security posture. Despite this high intent, the docs section converts at 0% to `demo_requested` because there is simply no place to convert. The Starlight docs layout has no global CTA injection mechanism: the desktop sidebar has no CTA, the content footer shows only on website pages (not docs), and no component inserts a demo prompt at the end of docs content. The only conversion path available is the small "Book demo" button in the top-right header, which is easy to overlook while reading documentation. This is a significant missed opportunity because docs readers represent late-funnel evaluators -- people who are past the awareness stage and actively assessing whether Promptless fits their technical requirements.

**Evidence**:
- PostHog pageview data (last 30 days): `/docs` pages received 273 pageviews from 43 unique users, making it the second-largest traffic section after the homepage. Top docs pages include: welcome (75 views), core-concepts (16), setup-quickstart (16), promptless-oss (12), promptless-1-0 (11), getting-help (8), security-and-privacy (6), and many more.
- PostHog funnel (last 30 days): 43 unique docs visitors -> 0 fired `demo_requested`. This is a **0.0% conversion rate** -- a complete dead end despite being the most engaged audience segment on the site.
- PostHog docs-to-demo-page funnel (last 30 days): 43 docs visitors, 12 (27.91%) eventually navigated to `/demo` -- proving these visitors have active conversion intent. They sought out the demo page on their own through header navigation, yet none completed the email form. The median time from docs to demo page was only 38 seconds, indicating urgency.
- PostHog engagement depth (last 30 days): Docs visitors averaged **6.35 pageviews per user** -- far higher than any other section. These are not casual browsers; they are reading multiple pages about triggers, integrations, security, and setup, which are classic late-funnel evaluation behaviors.
- Code inspection: Only `src/content/docs/docs/getting-started/welcome.mdx` contains a CTA (`<div class="pl-docs-cta">... <a href="/demo">Book a demo</a></div>`). The other 51 `.mdx` files in `src/content/docs/` have zero links to `/demo`, zero email capture forms, and zero conversion prompts.
- Code inspection of `src/components/starlight/Footer.astro`: The website footer (with support email and privacy link) only renders when `activeSection === 'website'` -- it does not render on docs pages. Docs pages have no footer CTA.
- Code inspection of `src/components/starlight/Sidebar.astro`: The desktop sidebar is a pure navigation tree (`SidebarSublist`). The `MobileMenuFooter` (which contains a "Book demo" link) only renders inside a `md:sl-hidden` div, meaning it is visible only on mobile, not desktop. Desktop docs users have no sidebar CTA.
- Screenshot of `/docs/getting-started/core-concepts/` confirms: the page content ends with an "Advanced Configuration" section that trails off into whitespace. No CTA, no demo prompt, no next-step conversion action appears anywhere in the content body. The only "Book demo" link is the small button in the top-right header bar.

**Testable prediction**: I predict that adding a persistent "Book a demo" CTA to all docs pages -- either as a global component at the bottom of every docs page content area, or as a sidebar CTA visible on desktop -- will increase the docs-to-demo conversion rate from 0% to at least 2-3% within 30 days, generating an estimated 1-2 additional demo requests per month from the current 43 monthly docs visitors. This is a conservative estimate: 28% of docs visitors already self-navigate to `/demo` (12 of 43), proving high intent. Even converting a fraction of the remaining 31 visitors who never reach `/demo` would be incremental. Furthermore, the CTA will provide a measurable signal (`demo_requested` with `location: "docs"`) that allows the team to attribute conversions to documentation content for the first time, informing content strategy decisions.

**Recommended fix**:
- Create a `DocsBottomCTA.astro` component with a brief, contextual prompt (e.g., "Want to see Promptless in action? Book a 15-minute demo." with a button linking to `/demo`) and include `data-track-location="docs_bottom_cta"` for tracking
- Override the Starlight `ContentPanel` or inject the CTA via a custom `PageFrame` override so it appears at the bottom of every docs page's content area -- this avoids editing all 52 individual `.mdx` files
- Alternatively, add a CTA to the desktop sidebar in `src/components/starlight/Sidebar.astro` (currently the desktop sidebar has no CTA; only the mobile menu does via `MobileMenuFooter.astro`), placed below the navigation tree as a sticky element
- Remove the `md:sl-hidden` restriction on the sidebar CTA so desktop users also see a "Book demo" link in the sidebar, or create a separate desktop-visible sidebar CTA component
- Track clicks with `cta_clicked` (location: `docs_sidebar` or `docs_bottom_cta`) and submissions with `demo_requested` (location: `docs`) to measure which placement drives more conversions
- Vary the CTA copy contextually based on the docs section: security pages could say "See how Promptless keeps your data safe -- book a demo", integration pages could say "Ready to connect Promptless to your stack?"

**Research sources**:
- LandingPageFlow CTA Placement Strategies 2026: End-of-page CTAs are critical for users who consume the full content -- "a well-timed end-of-page CTA offers a final push toward conversion after consuming the full value story." Multiple placement strategies (hero, mid-page, end-of-page, sticky) should be used together. (https://www.landingpageflow.com/post/best-cta-placement-strategies-for-landing-pages)
- Webstacks 2026 SaaS Conversion Guide: Personalized CTAs convert 202% better than generic ones. Every page needs a clear, prominent CTA guiding visitors forward. "Multiple CTAs on long pages maintain conversion opportunities as visitors scroll." (https://www.webstacks.com/blog/website-conversions-for-saas-businesses)
- Powered by Search B2B SaaS Funnel Benchmarks: Documentation and technical content readers represent late-funnel evaluators with higher conversion potential than top-of-funnel blog readers. "Smart B2B SaaS CRO accounts for multi-stakeholder buying by building landing pages for distinct personas -- creating separate pages that speak directly to technical users." Documentation is the technical user's landing page. (https://www.poweredbysearch.com/learn/b2b-saas-funnel-conversion-benchmarks/)
- Kalungi B2B SaaS CTA Guide: "Every page needs a clear and prominent CTA guiding visitors forward. Use action-oriented language... Multiple CTAs on long pages maintain conversion opportunities." Including a CTA with clear purpose can push conversion from under 1% up to 20% on focused pages. (https://www.kalungi.com/blog/conversion-rates-for-saas-companies)
- First Page Sage CTA Conversion Rates Report 2026: Meta-analysis of CTA conversion rates by placement and style confirms that contextually placed CTAs within content (not just header navigation) significantly outperform header-only CTAs because they meet users at the point of engagement. (https://firstpagesage.com/reports/cta-conversion-rates-report/)

**Applies to**: All documentation pages (`/docs/...`), specifically `src/components/starlight/Sidebar.astro` (desktop sidebar CTA), `src/components/starlight/Footer.astro` (docs footer), and potentially a new Starlight content override component. The welcome page CTA pattern in `src/content/docs/docs/getting-started/welcome.mdx` can serve as the template.

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

# Lucky Food

A responsive, server-rendered restaurant website built with Next.js 16 App Router, TypeScript, Tailwind CSS 4, Framer Motion 12 and Lucide. French, Belgian Dutch and English content is available on the homepage and both restaurant pages. `/` redirects to `/fr`.

## Local development

Use Node.js 22.x (`.nvmrc` and `package.json` specify the deployment runtime).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Visit http://localhost:3000. Production checks:

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

## Deploy to Vercel

Push this directory to a GitHub repository and import it into Vercel. Use the Next.js preset with the default build/output settings. Set `NEXT_PUBLIC_SITE_ORIGIN` to the final HTTPS domain before building; this controls canonical links, alternate languages, sitemap and structured data. If not set, Vercel’s production/deployment hostname is used; localhost is the development-only fallback. Enable Web Analytics in the Vercel project before deploying. See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete deployment steps.

## Content and architecture

- `src/lib/data.ts`: typed independent location records, exact prices, provisional hours, news, reservation settings, assets and unresolved questions.
- `src/lib/translations.ts`: shared French, Dutch and English dictionaries.
- `src/components/site.tsx`: server-rendered content and shared restaurant template.
- `src/components/interactive.tsx`: language context, reading-position-preserving language switch, mobile menu, anchor navigation and photo/review carousels.
- `src/app/globals.css`: theme tokens, Tailwind integration, container queries, mobile layouts and reduced-motion rules.

Routes: `/fr`, `/nl`, `/en`, `/{locale}/restaurants/choose-branch`, `/{locale}/restaurants/{sint-pieters-leeuw|jemeppe}`, `/{locale}/reservation`, and `/{locale}/reservation/{sint-pieters-leeuw|jemeppe}` (21 localised pages). `/reservation` and `/reservation/[branch]` redirect to their French versions. Unknown locales and restaurants return 404. Essential content and booking links work without JavaScript; the mobile menu and language position preservation need JavaScript.

## Asset replacement

The supplied logo and `hero.webp` are used for brand imagery. `space-1.webp`, `space-2.webp` and `space-3.webp` appear in the homepage brand gallery. Their branch assignment remains unconfirmed; they are presented as general brand interiors. The owner has identified `hero.webp` as Sint-Pieters-Leeuw and `jemeppe-hero.webp` as Jemeppe; these appear in their location cards and detail heroes. The original unprefixed interior gallery assignments remain unconfirmed; the `j-space-*` images are confirmed as Jemeppe. Set each location’s `gallery` in `data.ts` after confirming ownership; detail galleries use clearly identified placeholders until then.

The homepage buffet uses the supplied `spl-food-*` and `j-food-*` images in a slow, seamless moving strip. It pauses on hover or keyboard focus, has no pause button, and becomes a static horizontally scrollable strip with reduced motion. Image dimensions are recorded in `FoodPhoto` data, so portrait and landscape photos retain their native proportions without cropping or letterboxing. Duplicated loop images are hidden from assistive technology. Branch detail carousels advance every six seconds while visible, with keyboard navigation and native touch swiping. They pause during hover, focus, touch interaction or while the page is hidden, and remain manual for reduced motion. No stock food images are used. Each branch’s `foodPhotos` and `gallery` arrays live in `src/lib/data.ts`; descriptions and controls are translated in `translations.ts`. The `j-space-*` photographs are assigned to Jemeppe and included in the six-image homepage grid alongside the three original brand interiors. The original unprefixed interiors are not attributed to a branch. Sint-Pieters-Leeuw’s dedicated interior gallery remains a placeholder until its interior photographs are identified. All new branch food photos appear on that branch’s detail page.

Remote placeholder food URLs have been removed. Images use next/image with explicit responsive containers and lazy loading below the hero. Jemeppe’s final News section, after the reservation card, displays the supplied `JSSNoel2025.webp` and `JSSnewyear2025.webp` posters. They retain their full proportions and rounded corners, appear side by side on desktop and stack on phones. Each opens the full poster for easier reading. Their original 2025 dates are unchanged.

## Reservations

Each location has its owner-supplied `reservationWidgetUrl` in `src/lib/data.ts`: Jemeppe uses `https://reserve.intelis.pt/lucky-food-jss`; Sint-Pieters-Leeuw uses `https://reserve.intelis.pt/lucky-food-spl`. Booking CTAs open `/{locale}/reservation/[branch]`. Each page retains the shared navbar and uses an eager, titled iframe for the entire remaining dynamic viewport, without a footer, outer gutters or card framing. Generic booking CTAs open `/{locale}/reservation` to choose a branch; CTAs on a restaurant or booking page go directly to that branch. Telephone numbers remain contact links, separate from online booking.

Both widget URLs return HTTP 200, allow embedding and now render live reservation forms after owner activation. The widget’s own language and styling are controlled in Intelis; both currently default to Portuguese, with EN/PT/Chinese choices independent of the website’s FR/NL/EN navigation. No reservation was submitted during verification.

## Owner confirmation required before launch

1. **Sint-Pieters-Leeuw hours:** contact screenshot gives lunch 12:00–14:30, pricing screenshot 12:00–14:00. Contact hours are used provisionally; dinner is 18:00–22:00. Confirm exact weekly hours.
2. **Jemeppe hours:** contact screenshot gives 12:00–14:00 and 18:00–22:00; pricing screenshot gives 12:00–15:00 and 18:00–23:00. Contact hours are used provisionally. Both branches remain closed Tuesday; no Tuesday holiday opening is inferred.
3. **Sint-Pieters-Leeuw phone:** display remains `02/2188.888` as supplied. The dial link removes punctuation only (`022188888`). Confirm the number before launch.
4. **Children:** confirm which packages the Sint-Pieters-Leeuw under-11 half-price discount applies to. Confirm Jemeppe under-4 pricing and children’s Plus prices. No alcohol inclusion for children is stated.
5. **Photography:** confirm the location of the original unprefixed interior photographs and supply Sint-Pieters-Leeuw interior photos.
6. **Booking:** confirm the widget’s language, country-code defaults and availability settings in Intelis, then verify a real booking flow before launch.
7. **Legal:** provide approved privacy/legal text, business legal identity and final domain. No placeholder legal links or VAT numbers are shown.
8. **News:** provide new localised entries when available. Jemeppe shows the two owner-requested JSS posters; other empty news sections stay hidden.

Provisional opening hours are intentionally omitted from Restaurant structured data. Holiday prices take precedence over ordinary weekday lunches. Friday and Saturday **dinner only** share Sunday/holiday pricing; daytime Saturday pricing remains independent. All service periods apply only on opening days.

## Accessibility and mobile

Semantic headings and landmarks, skip link, visible focus, translated image descriptions and controls, keyboard-trapped mobile navigation with Escape/focus restoration, and fixed-width FR/NL/EN controls. Restaurant prices use keyboard-accessible Adults/Children tabs with responsive tables. Essential contact details are summarised at the top, and booking with the map is at the bottom. Motion respects reduced-motion and pointer type. Vercel Web Analytics tracks page views. Restaurant pages load the supplied Google Maps embeds.

## Dependency audit

The production dependency audit reports no vulnerabilities. At implementation time the full audit reports five high-severity findings in the development-only ESLint chain (`eslint-config-next` → `fast-glob` → `micromatch` → `braces`), with no compatible fix offered. Recheck upstream before launch; do not downgrade Next.js tooling across major versions via `npm audit fix --force`.

## Validation

`npm run check` runs ESLint, TypeScript and the production build. `npm run test:smoke` checks a running server: all 21 localised pages, reservation widget URLs/titles/loading mode and footer omission, redirects, missing routes, internal links and section targets, canonical/language metadata, sitemap, robots, response headers, source images and responsive image delivery. Use `SMOKE_BASE_URL` to target a local production server or Vercel preview, and optionally `SMOKE_SITE_ORIGIN` to assert the expected canonical domain. See [DEPLOYMENT.md](DEPLOYMENT.md) for the latest results and exact commands.

## Homepage pricing overview

The homepage shows compact tables with exact adult Base and Plus prices for every lunch/dinner service, sourced directly from each branch’s full pricing data. A shared package legend explains drinks; Sunday/holiday service is explicit and the note covers Tuesday closure, holiday precedence and the link to children’s prices and conditions. All copy is translated.

## Takeaway

Each restaurant detail page includes prepared buffet dishes to take away, below the dine-in prices. Sizes and prices are stored independently in each restaurant’s `takeaway` array in `src/lib/data.ts`: Sint-Pieters-Leeuw 1000 cc €18 / 500 cc €12; Jemeppe 750 cc €13 / 450 cc €10. Copy is translated in FR/NL/EN. No online takeaway ordering or additional inclusions are implied.

## Visual system

Shared font configuration lives in `src/lib/fonts.ts`: Outfit for geometric headings that echo the supplied logo, Manrope for body text and all monetary values. Prices use medium weight, lining and tabular numerals (`lnum` / `tnum`) to keep baselines and widths consistent. The palette uses charcoal, warm ivory and amber drawn from the logo, with shared neutral surface tokens for cards and pricing. The supplied logo itself is unchanged.

Google Maps actions use each branch’s owner-supplied `mapsUrl` in `src/lib/data.ts`. Weekend pricing labels separate Friday/Saturday dinner from Sunday/public-holiday lunch and dinner with a line break in every locale.

## Restaurant navigation

Desktop and mobile navigation use an Our restaurants disclosure with individual location links. It supports click/tap, keyboard Arrow Down, Escape and outside-click dismissal. Prices links to the localised branch chooser. The booking CTA has no arrow icon. Branch selections retain the current language.

Photo update validation: all nine pages fit at 360px; branch pages contain only their own prefixed food photos; Jemeppe’s two interiors appear in its gallery and the homepage grid. Manual next-slide and keyboard End navigation were verified in the browser, including disabled controls at the endpoints. ESLint, TypeScript and the production build pass.

The homepage spaces gallery uses two columns and three rows with matching 3:2 image frames, including the Sint-Pieters-Leeuw exterior hero as the sixth image. Below 700px it becomes one column while retaining the same frame ratio.

## Customer reviews

`src/lib/reviews.ts` contains the eight customer reviews transcribed from the owner-supplied screenshots, with source-image filenames recorded for traceability. The first four belong to Sint-Pieters-Leeuw; the remaining four belong to Jemeppe. Each shows its author, supplied five-star rating and branch. Céline De Muynck’s text is the exact excerpt requested by the owner, labelled as an excerpt. English retains the supplied wording; French and Dutch are labelled translations. Relative dates from screenshots are omitted rather than converted into invented publication dates.

The homepage shows all eight in a manually scrollable review rail. Restaurant detail pages omit the review rail and its section-navigation link. Cards link to the owner-provided restaurant Maps URL, not an invented individual-review permalink. No aggregate rating, review count or review structured data has been added. These are selected static reviews, not a live Google API feed.

The review slider keeps its section height stable using the tallest review at the current viewport width. Individual cards retain natural heights so short reviews do not stretch. Short quotes use larger Outfit type; medium and longer quotes use readable Manrope sizes without truncation. Matching keyboard-accessible previous/next controls sit at the left and right edges of the review row, without counters or progress indicators. Motion respects reduced-motion preferences.

## Image optimisation and deployment readiness

All 18 public images, including the three hero photos, logo and retained event posters, use WebP (approximately 4.9 MiB in total). Full-resolution originals are preserved locally in `assets/originals/`, excluded by `.gitignore` and `.vercelignore`. Conversion is reproducible with `npm run images:optimize`. The logo uses lossless compression; photographs use quality 84 and a maximum 1920px edge without upscaling. Responsive `next/image` delivery serves appropriate smaller sizes.

`npm run check` runs lint, TypeScript and the production build. Vercel configuration uses Node 22.x, the standard Next.js output, final-domain-aware canonical metadata, WebP image delivery and basic response headers. Mobile viewport metadata supports safe-area insets. See [DEPLOYMENT.md](DEPLOYMENT.md) for the deployment steps and the existing business-content confirmations before public launch.

## Scroll-driven homepage hero

The hero uses `hero.webp`, `hero-2.webp` and `hero-3.webp` in a sticky 100svh panel. Framer Motion `useScroll` is scoped to its 320svh section (220svh on mobile); `useTransform` slides consecutive full-screen photos vertically without fades or per-frame React state. The logo remains the accessible main heading, above the two locations and a translated one-line buffet descriptor and booking/discovery links. Photo crops and contrast scrims vary by image. Hero CTAs have no icons; the primary CTA has no hover animation.

Reduced motion collapses the hero to 100svh, shows only the first image and disables separator light sweeps. Section boundaries use a transform-only, 16-second warm light sweep.

## Prices navigation

Desktop and mobile navigation place Prices after The Buffet. The localised `/[locale]/restaurants/choose-branch` page lets guests choose a branch and opens its existing restaurant page at `#prices`. The unprefixed `/restaurants/choose-branch` entry redirects to the French version, matching the homepage default. The chooser has translated copy, canonical/language metadata, and sitemap entries.

The homepage booking CTA is a rounded card within the review section and retains the `#reservation` target. Cards and photo tiles share a 16px radius; controls use 12px corners. The hero has its own light sweep along the visible sticky panel’s bottom edge.

## Language switching and separator glow

Language changes use navigation with automatic scrolling disabled. `src/lib/locale-scroll.ts` captures the reading position within the visible section (including the nested booking card and footer) and restores the same relative position in the translated layout before paint, with one frame to settle layout. Bottom-of-page position stays pinned to the bottom. Clicking the active language does nothing; modified clicks retain normal browser behaviour. The language group uses the shared 12px corner radius with 9px inset corners.

Section lights use a 96px transparent band around the boundary, a narrow travelling streak and soft elliptical gradients for the glow. The hero clips its moving images separately so its separator glow can fade across the boundary. Reduced motion still disables the sweep.

## Entrance animations

The homepage logo, locations, descriptor and CTAs fade upward in a short sequence; the first hero photograph settles from a subtle 1.035 scale. Restaurant titles, exterior photos and information rows enter in sequence, and both branch choosers animate their headings and cards. Entrances last 700ms with delays under half a second. The navbar and reservation widgets remain immediately available.

Lower headings, restaurant cards, price cards, gallery photos, reservation cards and news posters reveal once as they enter view, using opacity and an 18px transform over 650ms. `Reveal` only prepares content below the viewport after hydration; server-rendered content stays visible without JavaScript, and the current reading position is not hidden on language changes. Observer callbacks change a data attribute, with no per-frame React updates. Focus reveals a block immediately. All new motion is scoped to `prefers-reduced-motion: no-preference`. Section wrappers and the hero’s sticky stage are not transformed, keeping anchor positions and layout stable.

## Footer

The footer places section links between the logo and the two restaurant contact columns on desktop, and stacks them responsively on mobile. It contains no language selector. The credit reads “© 2026 Lucky Food. Designed by Intelis, all rights reserved.” with Intelis linking to https://intelis.pt.

## Restaurant detail structure

Restaurant pages have three main sections: the restaurant name above an exterior photo and a short address/hours/phone/email table; adult/children price tabs beside a combined space-and-buffet photo carousel; and a dark reservation card with the branch’s supplied Google Maps embed and booking CTA. Jemeppe adds its poster news section last. All booking links open the dedicated reservation page for the branch. The previous sticky section navigation, separate space/buffet sections, repeated contact block and floating mobile booking bar have been removed.

Opening hours are summarised as every day (except Tuesday) with lunch/dinner times, plus a Tuesday/closed line within the same hours section. Pricing defaults to adults; Jemeppe has a separate keyboard-accessible children’s tab, while Sint-Pieters-Leeuw has no tab selector because it has no explicit children’s rate table. Conditions, package details and takeaway prices remain accessible in one expandable disclosure. All values remain sourced from the existing data and translations. Carousels use each branch’s confirmed photos, falling back to the exterior when interior photos are unavailable. Restaurant pages contain no dedicated reviews section. Maps retain lazy loading, translated titles, responsive dimensions and the supplied referrer policy.

Restaurant text sizes have been increased for readability. The practical-information card includes a translated heading and Lucide address, clock, phone and email icons. Its photo carousel advances every six seconds while at least 25% visible, pauses during interaction or when the page is hidden, and respects reduced motion. Automatic slides do not trigger live announcements.

The restaurant visit panel blends into the page background and stretches to match the exterior photograph on desktop. It has a welcoming translated heading and a booking CTA at the top. Dropdown restaurant selections always return to the top, including reselecting the current branch; language switches continue to preserve reading position.

The visit table uses clearer dividers between address, hours, phone and email. Tuesday closure sits within the hours group and the provisional-hours display note is removed. Visible “Price per person” labels are removed. Holiday copy is shortened to “Public-holiday rates may vary.” The package-ordering note appears only inside the takeaway card.

Both restaurant overview sections use the shared surface background. The navbar logo returns to the current language’s homepage at scroll position zero, including when clicked again from a lower homepage section.

## Mobile layout and Vercel build

Restaurant overview and pricing/gallery columns stack at 900px so tablet content remains readable. Phones use larger supporting copy, 44px carousel and language controls, full-width booking buttons, and single-column footer contact details. The language selector matches the navbar booking button’s height. The fixed header and page gutters account for display safe areas; compact landscape screens use a shorter hero composition. The mobile menu closes and releases its scroll lock when resizing to desktop.

`vercel.json` selects Next.js and runs `npm run check` before creating a deployment. Vercel uses its default lockfile-based install and reuses cached dependencies. The build uses Turbopack and checks TypeScript once. Node 22.x is pinned in `package.json`. The default Next.js output preserves image optimisation and generated routes.

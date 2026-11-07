# Deployment

The project is prepared for Vercel’s Next.js preset; it has not been published.

1. Push the project files to a Git repository and import the repository in Vercel.
2. `vercel.json` selects the **Next.js** preset, `npm ci` installation and `npm run check` build command. This runs lint, TypeScript and the production build. Node **22.x** is declared in `package.json`. Leave the output directory on its framework default.
3. Set `NEXT_PUBLIC_SITE_ORIGIN` to the final HTTPS custom domain, without a trailing slash, or leave it unset to use Vercel’s hostname. If omitted, the app uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. Enable Vercel system environment variables for this fallback. Local development defaults to `http://localhost:3000`; do not set a localhost value in Vercel.
4. Deploy, then confirm `/` redirects to `/fr`, all three homepages and both restaurant pages open, and `/sitemap.xml` uses the final domain.
5. Verify Jemeppe’s online booking form, the Sint-Pieters-Leeuw phone link and both Google Maps destinations on an actual phone. Jemeppe’s widget language, country code and availability are configured in Intelis.

No database, booking backend or API secrets are required. Fonts are self-hosted by Next.js after building. The build needs access to Google Fonts; the deployed site does not load fonts from Google. Source originals in `assets/originals/` are excluded from Git and deployment; the optimised assets in `public/images/` must be committed.

Before running the production build locally:

```sh
npm ci
npm run check
npm run start
```

In another terminal, verify the running production server:

```sh
npm run test:smoke
```

To check a preview or a different local port, set `SMOKE_BASE_URL` to that server’s URL. Optionally set `SMOKE_SITE_ORIGIN` to the expected canonical origin. The smoke test checks 12 localised pages, Jemeppe’s reservation iframe, redirects, 404s, links, metadata, sitemap and robots, response headers, and WebP delivery for the desktop and portrait hero sources.

The production command uses Next.js’s supported `next build --webpack` option. A clean Turbopack build could not open its internal PostCSS worker port in this restricted local environment; the explicit webpack command lets local verification and Vercel use the same build path. Development can still use Turbopack; `npm run dev -- --webpack` is available if local worker-port restrictions affect development too.

For new photography, keep the originals in `assets/originals/`, run `npm run images:optimize`, and use the generated `.webp` paths in `src/lib/data.ts`. The conversion tool uses a 1920px maximum edge, never enlarges photos, retains their aspect ratios and preserves logo transparency losslessly. If replacing a food photo, update its width and height metadata too.

## Business content still requiring owner confirmation

Confirm opening hours, Jemeppe’s under-4 and children’s Plus rates, and approved legal and privacy content before launch. Check the language and country-code defaults for Jemeppe’s live booking form in Intelis. Sint-Pieters-Leeuw takes bookings by phone.

## Platform references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Next.js build options](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options)

## Responsive behaviour

- Portrait screens up to 900px use the `hero-1-mobile.webp`, `hero-2-mobile.webp` and `hero-3-mobile.webp` crops. Landscape screens use the wide crops. The first photo loads eagerly and the two later photos load lazily.
- All 12 localised pages were checked at 320, 390, 768 and 1024px widths without horizontal overflow or broken images.
- Restaurant columns stack below 901px; contact headers remain on one line, booking is available above the contact details, and prices retain a readable table layout.
- The language selector matches the navbar booking button’s 44px height. Carousel buttons also have 44px touch heights. Mobile footer contacts stack with larger type and touch targets.
- The fixed navbar, page gutters and footer account for device safe areas. Short landscape screens retain the logo, descriptor and both hero CTAs without overlap.
- The mobile menu scrolls when necessary, restores focus on Escape and releases its body scroll lock when resized to desktop. Restaurant selections return to the top; section links align immediately below the navbar.
- Reduced-motion styles collapse the hero to one viewport and disable automatic slides and light sweeps. The browser test surface does not offer reduced-motion emulation, so these rules were checked in source rather than in a separate emulated session.

## Verification completed — 22 October 2026

- Clean lockfile install: `npm ci --no-audit --no-fund` passed on Node 22.
- `npm run check` passed: ESLint, TypeScript and the webpack production build; all 21 localised pages were generated.
- `SMOKE_BASE_URL=http://localhost:3001 SMOKE_SITE_ORIGIN=http://localhost:3000 npm run test:smoke` passed against `next start`: 21 pages, iframe URLs/titles/eager loading, omitted booking-page footers, internal links/anchors, five redirects, missing-route 404s, metadata, sitemap/robots, response headers, 18 WebP images and image optimisation. The canonical origin is localhost for this local build; Vercel supplies the production origin at build time.
- Browser checks covered all 12 routes at 320, 390, 768 and 1024px (48 checks). The production browser check also verified the 568 × 320 landscape hero and the 390px restaurant layout, with no console errors or warnings.
- Reservation chooser and form layouts passed 27 checks across FR/NL/EN at 320, 768 and 1280px. Form iframes align directly below the navbar, fill the remaining viewport, omit the footer and add no outer page scrolling or horizontal overflow. Homepage-to-branch booking, branch-specific CTAs, language switching with the selected branch, and mobile menu booking links were verified. Both external forms load; no booking was submitted.
- Mobile interactions passed: opening the restaurant dropdown, returning to a restaurant at the top, closing the menu on navigation/desktop resize, section alignment, adults/children tabs including keyboard selection, and photo controls.
- Entrance animations were verified from their initial opacity/18px offset through their settled state, and scroll reveals were verified entering the gallery. Section alignment and language reading position remained stable. The 15 homepage, restaurant and chooser routes passed 45 layout checks at 320, 768 and 1280px, including gallery proportions and footer text fit. Reduced-motion handling was reviewed in source; media emulation is unavailable in the browser test surface.
- `npm audit --omit=dev` reported zero vulnerabilities. The full audit still reports five high-severity findings in the development-only ESLint dependency chain, with no compatible upstream fix offered. Details remain in README; no forced tooling downgrade was applied.
- No deployment or publication was performed.

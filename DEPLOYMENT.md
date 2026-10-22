# Deployment

The project is prepared for Vercel’s Next.js preset; it has not been published.

1. Push the project files to a Git repository and import the repository in Vercel.
2. `vercel.json` selects the **Next.js** preset, `npm ci` installation and `npm run check` build command. This runs lint, TypeScript and the production build. Node **22.x** is declared in `package.json`. Leave the output directory on its framework default.
3. Set `NEXT_PUBLIC_SITE_ORIGIN` to the final HTTPS custom domain, without a trailing slash, or leave it unset to use Vercel’s hostname. If omitted, the app uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. Enable Vercel system environment variables for this fallback. Local development defaults to `http://localhost:3000`; do not set a localhost value in Vercel.
4. Deploy, then confirm `/` redirects to `/fr`, all three homepages and both restaurant pages open, and `/sitemap.xml` uses the final domain.
5. Verify each branch’s online booking flow and supplied Google Maps destination on an actual phone. Widget languages, country-code defaults and availability are configured in Intelis.

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

To check a preview or a different local port, set `SMOKE_BASE_URL` to that server’s URL. Optionally set `SMOKE_SITE_ORIGIN` to the expected canonical origin. The smoke test checks the 21 localised pages, reservation iframe configuration, redirects, 404s, internal page and section links, metadata, sitemap/robots, security headers, all public WebP images and Next.js image optimisation.

The production command uses Next.js’s supported `next build --webpack` option. A clean Turbopack build could not open its internal PostCSS worker port in this restricted local environment; the explicit webpack command lets local verification and Vercel use the same build path. Development can still use Turbopack; `npm run dev -- --webpack` is available if local worker-port restrictions affect development too.

For new photography, keep the originals in `assets/originals/`, run `npm run images:optimize`, and use the generated `.webp` paths in `src/lib/data.ts`. The conversion tool uses a 1920px maximum edge, never enlarges photos, retains their aspect ratios and preserves logo transparency losslessly. If replacing a food photo, update its width and height metadata too.

## Business content still requiring owner confirmation

Technical deployment is ready. The launch content still has the outstanding questions listed in README: conflicting opening hours; the Sint-Pieters-Leeuw telephone number and children’s discount scope; missing Jemeppe under-4/children’s Plus rates; and approved legal/privacy content. Both reservation widgets are configured and now display live forms after owner activation. The widget defaults currently use Portuguese and Portugal’s +351 phone prefix; configure local defaults in Intelis. No live reservation was submitted during verification.

## Platform references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)
- [Next.js build options](https://nextjs.org/docs/app/api-reference/cli/next#next-build-options)

## Responsive behaviour

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
- `npm audit --omit=dev` reported zero vulnerabilities. The full audit still reports five high-severity findings in the development-only ESLint dependency chain, with no compatible upstream fix offered. Details remain in README; no forced tooling downgrade was applied.
- No deployment or publication was performed.

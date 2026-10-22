# Deployment

The project is prepared for Vercel’s Next.js preset; it has not been published.

1. Push the project files to a Git repository and import the repository in Vercel.
2. Select the **Next.js** framework preset. Node **22.x** is declared in `package.json`; use `npm ci` for installation and `npm run build` for the build. Leave the output directory on its framework default.
3. Set `NEXT_PUBLIC_SITE_ORIGIN` to the final HTTPS domain, without a trailing slash. If omitted, the app uses `VERCEL_PROJECT_PRODUCTION_URL`, then `VERCEL_URL`. Enable Vercel system environment variables for this fallback. Local development defaults to `http://localhost:3000`.
4. Deploy, then confirm `/` redirects to `/fr`, all three homepages and both restaurant pages open, and `/sitemap.xml` uses the final domain.
5. Check both booking telephone links and the supplied Google Maps destinations on an actual phone.

No database, booking backend or API secrets are required. Fonts are self-hosted by Next.js after building. The build needs access to Google Fonts; the deployed site does not load fonts from Google. Source originals in `assets/originals/` are excluded from Git and deployment; the optimised assets in `public/images/` must be committed.

Before running the production build locally:

```sh
npm ci
npm run check
npm run start
```

For new photography, keep the originals in `assets/originals/`, run `npm run images:optimize`, and use the generated `.webp` paths in `src/lib/data.ts`. The conversion tool uses a 1920px maximum edge, never enlarges photos, retains their aspect ratios and preserves logo transparency losslessly. If replacing a food photo, update its width and height metadata too.

## Business content still requiring owner confirmation

Technical deployment is ready. The launch content still has the outstanding questions listed in README: conflicting opening hours; the Sint-Pieters-Leeuw telephone number and children’s discount scope; missing Jemeppe under-4/children’s Plus rates; and approved legal/privacy content. Online booking remains telephone-based until verified booking URLs are supplied.

## Platform references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables)

## Verification completed — 17 October 2026

- `npm run check`: lint, TypeScript and production build passed; all nine locale pages generated.
- Production dependency audit: zero vulnerabilities. The known development-only lint-tool advisories remain documented in README.
- HTTP smoke checks: nine pages return 200, the root redirects to `/fr`, invalid locale/restaurant paths return 404, sitemap/robots are served, canonical metadata and safe-area viewport metadata are present, and local anchor targets exist.
- All 16 WebP files decode and return `image/webp`. Source assets are 90.8% smaller (48,078,924 → 4,420,590 bytes). The optimized 640px hero response was 30,792 bytes.
- Browser checks: all nine routes at 320px, 360px and 768px had no horizontal overflow or failed images. Mobile menu Escape handling restores focus.
- Review section height and the absolute position of the following section were identical before and after sliding on desktop and mobile. Compact cards keep their own natural heights within that stable section.
- Explicit-domain and Vercel-hostname fallback logic were verified. No deployment or publication was performed.

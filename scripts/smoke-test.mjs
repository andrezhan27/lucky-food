import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";

// Run against `npm start` locally or a Vercel preview, without browser dependencies.
const base = new URL(process.env.SMOKE_BASE_URL || "http://localhost:3000");
const expectedOrigin = process.env.SMOKE_SITE_ORIGIN
  ? new URL(process.env.SMOKE_SITE_ORIGIN).origin
  : null;
const locales = ["fr", "nl", "en"];
const paths = locales.flatMap(locale => [
  `/${locale}`,
  `/${locale}/restaurants/choose-branch`,
  `/${locale}/restaurants/sint-pieters-leeuw`,
  `/${locale}/restaurants/jemeppe`,
  `/${locale}/reservation`,
  `/${locale}/reservation/sint-pieters-leeuw`,
  `/${locale}/reservation/jemeppe`,
]);
const pages = new Map();
let canonicalOrigin;

async function request(path, options) {
  return fetch(new URL(path, base), { signal: AbortSignal.timeout(30_000), ...options });
}

for (const path of paths) {
  const response = await request(path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type") || "", /text\/html/, path);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(response.headers.get("x-powered-by"), null);
  const html = await response.text();
  pages.set(path, html);
  assert.match(html, new RegExp(`<html[^>]+lang="${path.split("/")[1]}"`), path);
  assert.match(html, /name="viewport"[^>]+viewport-fit=cover/, path);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one main heading`);
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
  assert.ok(canonical, `${path}: canonical`);
  const url = new URL(canonical[1]);
  canonicalOrigin ??= url.origin;
  assert.equal(url.pathname, path);
  assert.equal(url.origin, expectedOrigin || canonicalOrigin);
  for (const locale of locales) {
    assert.ok(html.includes(`hrefLang="${locale}"`), `${path}: ${locale} alternate`);
  }
  assert.ok(!/href="(?:#|)"/.test(html), `${path}: no empty links`);
  const branch = path.match(/\/reservation\/(jemeppe|sint-pieters-leeuw)$/)?.[1];
  if (branch) {
    const widget = branch === "jemeppe" ? "lucky-food-jss" : "lucky-food-spl";
    const name = branch === "jemeppe" ? "Lucky Food Jemeppe" : "Lucky Food Sint-Pieters-Leeuw";
    assert.match(html, new RegExp(`<iframe[^>]+src="https://reserve\\.intelis\\.pt/${widget}"[^>]+title="${name}"`), path);
    assert.match(html, /<iframe[^>]+loading="eager"/, path);
    assert.ok(!html.includes("<footer"), `${path}: no footer below the full-screen form`);
  }
  assert.ok(!/href="tel:[^"]*"[^>]*>\s*(?:Book by phone|Réserver par téléphone|Telefonisch reserveren)/.test(html), `${path}: no telephone booking CTA`);
}

// Check local page and section links, including cross-page navigation.
for (const [path, html] of pages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    const url = new URL(href.replaceAll("&amp;", "&"), new URL(path, base));
    if (url.pathname.startsWith("/images/") && url.pathname.endsWith(".webp")) {
      assert.equal((await request(url.pathname)).status, 200, `${path}: poster link ${href}`);
      continue;
    }
    const target = pages.get(url.pathname);
    assert.ok(target, `${path}: unknown internal page ${href}`);
    if (url.hash) {
      assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: missing target ${href}`);
    }
  }
}

for (const [path, destination] of [["/", "/fr"], ["/restaurants/choose-branch", "/fr/restaurants/choose-branch"], ["/reservation", "/fr/reservation"], ["/reservation/jemeppe", "/fr/reservation/jemeppe"], ["/reservation/sint-pieters-leeuw", "/fr/reservation/sint-pieters-leeuw"]]) {
  const response = await request(path, { redirect: "manual" });
  assert.ok([307, 308].includes(response.status), `${path}: redirect`);
  assert.equal(new URL(response.headers.get("location"), base).pathname, destination);
}
for (const path of ["/de", "/en/restaurants/unknown", "/en/reservation/unknown", "/reservation/unknown"]) {
  assert.equal((await request(path)).status, 404, `${path}: 404`);
}

const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
assert.equal((sitemap.match(/<loc>/g) || []).length, paths.length);
for (const path of paths) assert.ok(sitemap.includes(`<loc>${canonicalOrigin}${path}</loc>`), `sitemap: ${path}`);
const robots = await request("/robots.txt");
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));

const images = (await readdir(new URL("../public/images/", import.meta.url))).filter(name => name.endsWith(".webp"));
for (const name of images) {
  const response = await request(`/images/${name}`);
  assert.equal(response.status, 200, name);
  assert.match(response.headers.get("content-type") || "", /image\/webp/, name);
}
const optimized = await request("/_next/image?url=%2Fimages%2Fhero.webp&w=640&q=75", {
  headers: { Accept: "image/webp" },
});
assert.equal(optimized.status, 200, "responsive image optimisation");
assert.match(optimized.headers.get("content-type") || "", /image\/webp/);
console.log(`Smoke checks passed: ${paths.length} pages, internal links and anchors, redirects, 404s, metadata, sitemap, robots, headers, ${images.length} images and responsive image delivery.`);

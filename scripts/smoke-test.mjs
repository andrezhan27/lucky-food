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
  `/${locale}/restaurants/sint-pieters-leeuw`,
  `/${locale}/restaurants/jemeppe`,
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
  if (path.endsWith("/reservation/jemeppe")) {
    assert.match(html, /<iframe[^>]+src="https:\/\/reserve\.intelis\.pt\/lucky-food-jss"[^>]+title="Lucky Food Jemeppe"/, path);
    assert.match(html, /<iframe[^>]+loading="eager"/, path);
    assert.ok(!html.includes("<footer"), `${path}: no footer below the full-screen form`);
  }
  assert.ok(!html.includes("lucky-food-spl"), `${path}: no SPL booking widget`);
}

const splPhone = "tel:+3222188888";
const splWebsite = "https://www.buffetluckyfood.be/bxl-accueil.html";
const heroImages = [1, 2, 3].flatMap(number => [
  `hero-${number}.webp`,
  `hero-${number}-mobile.webp`,
]);
for (const locale of locales) {
  const home = pages.get(`/${locale}`);
  const hero = home.match(/<div class="scroll-hero-images".*?<div class="scroll-hero-content"/s)[0];
  const slides = [...hero.matchAll(/<img[^>]+src="[^"]*(hero-[1-3]\.webp)/g)].map(match => match[1]);
  assert.deepEqual(slides, ["hero-1.webp", "hero-2.webp", "hero-3.webp"], `${locale}: hero order`);
  const portraitSlides = [...hero.matchAll(/<source media="\(max-width: 900px\) and \(orientation: portrait\)"[^>]*srcSet="[^"]*(hero-[1-3]-mobile\.webp)/g)].map(match => match[1]);
  assert.deepEqual(portraitSlides, ["hero-1-mobile.webp", "hero-2-mobile.webp", "hero-3-mobile.webp"], `${locale}: portrait hero sources`);
  assert.equal((hero.match(/<img[^>]+loading="eager"/g) || []).length, 1, `${locale}: only the opening hero loads eagerly`);
  for (const name of heroImages) assert.ok(hero.includes(name), `${locale}: ${name}`);

  const food = home.slice(home.indexOf('id="food"'), home.indexOf('id="pricing-overview"'));
  for (let number = 1; number <= 7; number++) assert.ok(food.includes(`j-food-${number}.webp`));
  assert.ok(!food.includes("spl-food-"));
  assert.ok(!food.includes("<figcaption"), `${locale}: no repeated food photo captions`);

  const spaces = home.slice(home.indexOf('id="spaces"'), home.indexOf('id="reviews"'));
  const [jemeppeGallery, splGallery] = spaces.split('aria-labelledby="spaces-sint-pieters-leeuw"');
  for (let number = 1; number <= 6; number++) assert.ok(jemeppeGallery.includes(`j-space-${number}.webp`));
  for (let number = 1; number <= 3; number++) assert.ok(splGallery.includes(`spl-space-${number}.webp`));
  assert.ok(splGallery.includes("spl-exterior.webp") && !splGallery.includes("hero-2.webp"));
  assert.ok(!jemeppeGallery.includes("spl-space-") && !splGallery.includes("j-space-"));

  const reviewsStart = home.indexOf('id="reviews"');
  const visitStart = home.indexOf('id="restaurants"');
  const reviews = home.slice(reviewsStart, visitStart);
  assert.ok(reviews.includes("Jemeppe-sur-Sambre") && !reviews.includes("Sint-Pieters-Leeuw"));
  const pricingStart = home.indexOf('id="pricing-overview"');
  const spacesStart = home.indexOf('id="spaces"');
  assert.ok(pricingStart >= 0 && pricingStart < spacesStart && spacesStart < reviewsStart && reviewsStart < visitStart);
  const prices = home.slice(pricingStart, spacesStart);
  assert.equal((prices.match(/<table\b/g) || []).length, 1);
  assert.ok(prices.includes("Jemeppe-sur-Sambre") && prices.includes(splWebsite));

  const spl = pages.get(`/${locale}/restaurants/sint-pieters-leeuw`);
  assert.ok(spl.includes(splWebsite) && !spl.includes("branch-price-table"));
  const jemeppeBooking = `href="/${locale}/reservation/jemeppe"`;
  const splBooking = `href="${splPhone}"`;
  const visit = home.match(/<section[^>]+id="restaurants".*?<\/section>/s)[0];
  assert.ok(visit.includes('id="reservation"') && visit.includes("visit-card"));
  assert.ok(visit.includes("jemeppe-hero.webp") && !visit.includes("spl-exterior.webp"));
  assert.ok(visit.includes(jemeppeBooking) && visit.includes("https://maps.app.goo.gl/V1b1UBnrVTtK64qE7"));
  assert.ok(visit.includes(splBooking) && visit.includes(splWebsite));
  assert.ok(food.includes(jemeppeBooking));
  for (const html of [home, spl]) {
    assert.ok(html.match(/<header\b.*?<\/header>/s)[0].includes(jemeppeBooking));
    assert.ok(html.match(/<footer\b.*?<\/footer>/s)[0].includes(jemeppeBooking));
    assert.ok(html.includes(splBooking));
    assert.ok(!html.includes(`href="/${locale}/reservation"`));
    assert.ok(!html.includes(`href="/${locale}/reservation/sint-pieters-leeuw"`));
  }
  assert.ok(home.match(/<div class="scroll-hero-actions".*?<\/div>/s)[0].includes(jemeppeBooking));
  assert.ok(spl.match(/<div class="branch-reservation-heading".*?<\/a>/s)[0].includes(splBooking));
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

const redirects = [
  ["/", "/fr"],
  ["/restaurants/choose-branch", "/fr/restaurants/choose-branch"],
  ["/reservation", "/fr/reservation/jemeppe"],
  ["/reservation/jemeppe", "/fr/reservation/jemeppe"],
  ["/reservation/sint-pieters-leeuw", "/fr/reservation/sint-pieters-leeuw"],
  ...locales.flatMap(locale => [
    [`/${locale}/reservation`, `/${locale}/reservation/jemeppe`],
    [`/${locale}/restaurants/choose-branch`, `/${locale}#pricing-overview`],
    [`/${locale}/reservation/sint-pieters-leeuw`, `/${locale}/restaurants/sint-pieters-leeuw#reservation`],
  ]),
];
for (const [path, destination] of redirects) {
  const response = await request(path, { redirect: "manual" });
  assert.ok([307, 308].includes(response.status), `${path}: redirect`);
  const location = new URL(response.headers.get("location"), base);
  assert.equal(location.pathname + location.hash, destination);
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
for (const name of [...heroImages, "j-food-2.webp"]) {
  const version = name.startsWith("hero-2") ? "?v=3" : name === "j-food-2.webp" ? "?v=2" : "";
  const src = encodeURIComponent(`/images/${name}${version}`);
  const optimized = await request(`/_next/image?url=${src}&w=640&q=75`, {
    headers: { Accept: "image/webp" },
  });
  assert.equal(optimized.status, 200, `${name}: responsive image optimisation`);
  assert.match(optimized.headers.get("content-type") || "", /image\/webp/);
}
console.log(`Smoke checks passed: ${paths.length} pages, internal links and anchors, redirects, 404s, metadata, sitemap, robots, headers, ${images.length} images and responsive image delivery.`);

import { PriceTabs } from "./price-tabs";
import { ScrollHero } from "./scroll-hero";
import { SectionSeparator } from "./section-separator";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Phone,
  Clock,
  Mail,
  MapPin,
  Star,
} from "lucide-react";
import {
  restaurants,
  booking,
  directions,
  jemeppe,
  sintPietersLeeuw,
  type GalleryPhoto,
  money,
  type Locale,
  type Restaurant,
} from "@/lib/data";
import { customerReviews } from "@/lib/reviews";
import { getDictionary } from "@/lib/translations";
import {
  FoodCarousel,
  ReviewCarousel,
  MovingFoodCarousel,
  Reveal,
  BookingLink,
} from "./interactive";
export function Photo({
  src,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 700px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`photo ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
    </div>
  );
}
function VisitSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="visit-section" id="restaurants" aria-labelledby="visit-title">
      <div id="reservation">
        <Reveal className="restaurant-card visit-card">
          <Photo
            className="visit-photo"
            src={jemeppe.image}
            alt={`${t.restaurantExterior} · ${jemeppe.city}`}
            sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) 55vw, 720px"
          />
          <div className="visit-copy">
            <p className="eyebrow">{t.locationKicker}</p>
            <h2 id="visit-title">{t.locationTitle}</h2>
            <dl className="visit-details">
              <div>
                <dt><MapPin size={18} aria-hidden="true" />{t.addressLabel}</dt>
                <dd>{jemeppe.address}</dd>
              </div>
              <div>
                <dt><Clock size={18} aria-hidden="true" />{t.hours}</dt>
                <dd>
                  <span>{t.openDays}</span>
                  <span>{t.lunch} {jemeppe.lunch} · {t.dinner} {jemeppe.dinner}</span>
                </dd>
              </div>
            </dl>
            <div className="visit-actions">
              <Link className="button" href={booking(jemeppe, locale)}>{t.reserve}</Link>
              <a className="text-link" href={directions(jemeppe)} target="_blank" rel="noreferrer">
                {t.directions}<ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>
        <div className="other-location">
          <p>{t.otherLocation}</p>
          <div className="other-location-links">
            <a className="text-link" href={sintPietersLeeuw.websiteUrl} aria-label={`${t.restaurantWebsite} · ${sintPietersLeeuw.city}`}>
              {t.restaurantWebsite}<ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a className="text-link" href={booking(sintPietersLeeuw, locale)} aria-label={`${t.phoneBooking} · ${sintPietersLeeuw.city}`}>
              <Phone size={15} aria-hidden="true" />{t.phoneBooking}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FoodSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="food-section section" id="food">
      <div className="container food-grid moving-food-layout">
        <Reveal className="food-copy">
          <p className="eyebrow">{t.foodKicker}</p>
          <h2>{t.foodTitle}</h2>
          <p className="body-copy">{t.foodIntro}</p>
          <div className="food-tags">
            <span>Sushi</span>
            <span>Wok</span>
            <span>Teppanyaki</span>
          </div>
          <BookingLink className="text-link">
            {t.reserve}
            <ArrowUpRight size={17} />
          </BookingLink>
        </Reveal>
        <MovingFoodCarousel photos={jemeppe.foodPhotos} />
      </div>
      <SectionSeparator />
    </section>
  );
}
export function SpaceGallery({
  locale,
  images,
  compact = false,
}: {
  locale: Locale;
  images: GalleryPhoto[];
  compact?: boolean;
}) {
  const t = getDictionary(locale);
  return (
    <div className={compact ? "space-gallery space-gallery-compact" : "space-gallery"}>
      {images.map((photo, index) => (
        <Reveal key={photo.src} delay={(index % 2) * 0.1}>
          <Photo
            className="space-item"
            src={photo.src}
            alt={t[photo.altKey]}
            sizes={compact
              ? "(max-width: 700px) 50vw, 25vw"
              : "(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) calc((100vw - 132px) / 2), 650px"}
          />
        </Reveal>
      ))}
    </div>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <footer>
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href={`/${locale}`}>
            <Image
              src="/images/logo.webp"
              alt="Lucky Food"
              width={2172}
              height={724}
              sizes="190px"
              className="footer-logo"
            />
          </Link>
          <p>{t.footerLine}</p>
        </div>
        <nav className="footer-sections" aria-label={t.menu}>
          <Link href={`/${locale}#restaurants`}>{t.restaurants}</Link>
          <Link href={`/${locale}#food`}>{t.food}</Link>
          <Link href={`/${locale}#pricing-overview`}>{t.prices}</Link>
          <Link href={`/${locale}#spaces`}>{t.spaces}</Link>
          <Link href={`/${locale}#reviews`}>{t.reviews}</Link>
          <BookingLink>{t.reserve}</BookingLink>
        </nav>
        {restaurants.map((r) => (
          <div key={r.id} className="footer-location">
            <Link href={`/${locale}/restaurants/${r.id}`}>
              {r.city}
              <ArrowUpRight size={14} />
            </Link>
            <p>{r.address}</p>
            <a href={`tel:${r.telephone}`}>{r.phone}</a>
            <a href={`mailto:${r.email}`}>{r.email}</a>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>
          © 2026 Lucky Food. Designed by <a href="https://intelis.pt">Intelis</a>, all rights reserved.
        </span>
      </div>
    </footer>
  );
}
export function Home({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <ScrollHero locale={locale} />
      <FoodSection locale={locale} />
      <PricingOverview locale={locale} />
      <section className="section spaces-section" id="spaces">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">{t.spaceKicker}</p>
              <h2>{t.spaceTitle}</h2>
            </div>
            <p>{t.spaceIntro}</p>
          </Reveal>
          {restaurants.map((r) => (
            <section key={r.id} className="space-location" aria-labelledby={`spaces-${r.id}`}>
              <h3 id={`spaces-${r.id}`}>{r.city}</h3>
              <SpaceGallery locale={locale} images={r.gallery} compact={r.id !== jemeppe.id} />
            </section>
          ))}
        </div>
        <SectionSeparator />
      </section>
      <ReviewsSection locale={locale} />
    </>
  );
}
export function PricingOverview({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const r = jemeppe;
  return (
    <section className="section pricing-overview" id="pricing-overview">
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{t.prices}</p>
            <h2>{t.priceOverviewTitle}</h2>
          </div>
          <p>{t.priceOverviewIntro}</p>
        </Reveal>
        <div className="price-overview-packages">
          {(["base", "plus"] as const).map((name) => (
            <p key={name}><strong>{t[name]}</strong><span>{t[name === "base" ? "baseInfo" : "plusInfo"]}</span></p>
          ))}
        </div>
        <Reveal>
          <article className="price-overview-location">
            <h3>{r.city}</h3>
            <table className="price-overview-table">
              <caption className="sr-only">{r.city} · {t.perPerson}</caption>
              <thead>
                <tr>
                  <th scope="col">{t.service}</th>
                  <th scope="col">{t.base}</th>
                  <th scope="col">{t.plus}</th>
                </tr>
              </thead>
              <tbody>
                {r.prices.map((row) => (
                  <tr key={row.period}>
                    <th scope="row">{t[row.period]}</th>
                    <td>{money(row.base, locale)}</td>
                    <td>{money(row.plus, locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Link
              className="text-link"
              href={`/${locale}/restaurants/${r.id}#prices`}
              aria-label={`${t.fullPrices} · ${r.city}`}
            >
              {t.fullPrices}<ArrowUpRight size={17} />
            </Link>
          </article>
        </Reveal>
        <p className="pricing-note">{t.priceOverviewNote}</p>
        <p className="pricing-note"><a href={sintPietersLeeuw.websiteUrl}>{t.splPrices}</a></p>
      </div>
      <SectionSeparator />
    </section>
  );
}
function RestaurantPricing({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const r = jemeppe;
  const adults = (
    <>
      <p className="branch-package-note"><strong>{t.base}</strong> · {t.baseInfo}<br /><strong>{t.plus}</strong> · {t.plusInfo}</p>
      <table className="branch-price-table">
        <caption className="sr-only">{r.name} · {t.adultsLabel} · {t.perPerson}</caption>
        <thead><tr><th scope="col">{t.service}</th><th scope="col">{t.base}</th><th scope="col">{t.plus}</th></tr></thead>
        <tbody>{r.prices.map(row => (
          <tr key={row.period}><th scope="row">{t[row.period]}</th><td>{money(row.base, locale)}</td><td>{money(row.plus, locale)}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
  const children = (
    <>
      <p className="branch-package-note">{t.childJ}</p>
      <table className="branch-price-table">
        <caption className="sr-only">{r.name} · {t.childrenLabel} · {t.perPerson}</caption>
        <thead><tr><th scope="col">{t.service}</th><th scope="col">{t.age4}</th><th scope="col">{t.age11}</th></tr></thead>
        <tbody>{r.prices.map(row => (
          <tr key={row.period}><th scope="row">{t[row.period]}</th><td>{money(row.children[0], locale)}</td><td>{money(row.children[1], locale)}</td></tr>
        ))}</tbody>
      </table>
    </>
  );
  return (
    <div className="branch-pricing">
      <div className="branch-block-heading"><h2>{t.prices}</h2></div>
      <PriceTabs label={t.prices} adultsLabel={t.adultsLabel} childrenLabel={t.childrenLabel} adults={adults}>{children}</PriceTabs>
      <details className="branch-price-details">
        <summary>{t.priceDetails}</summary>
        <p>{t.conditions}</p>
        <p>{t.digestif}</p>
        <TakeawayPricing restaurant={r} locale={locale} />
      </details>
    </div>
  );
}
export function TakeawayPricing({
  restaurant: r,
  locale,
}: {
  restaurant: Restaurant;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  return (
    <section
      className="takeaway-pricing"
      id="takeaway"
      aria-labelledby="takeaway-title"
    >
      <h3 id="takeaway-title">{t.takeawayTitle}</h3>
      <p>{t.takeawayIntro}</p>
      <dl>
        {r.takeaway.map((box) => (
          <div key={box.volumeCc}>
            <dt>
              {t.takeawayBox}{" "}
              <span>
                {new Intl.NumberFormat(`${locale}-BE`).format(box.volumeCc)} cc
              </span>
            </dt>
            <dd>{money(box.price, locale)}</dd>
          </div>
        ))}
      </dl>
      <p className="takeaway-note">{t.tableCondition}</p>
    </section>
  );
}
export function RestaurantDetail({
  restaurant: r,
  locale,
}: {
  restaurant: Restaurant;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const bookingLabel = r.reservationWidgetUrl ? t.reserve : t.phoneBooking;
  const galleryLabel = r.foodPhotos.length ? t.spaceBuffet : t.space;
  return (
    <>
      <section className="branch-overview" id="contact">
        <div className="container">
          <h1>{r.city}</h1>
          <div className="branch-overview-grid">
            {r.image && <Photo src={r.image} alt={r.name} className="branch-exterior" priority sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 72px), 50vw" />}
            <div className="branch-essentials">
              <div className="branch-info-heading">
                <h2>{t.restaurantInfo}</h2>
                <Link className="button" href={booking(r, locale)}>{bookingLabel}</Link>
              </div>
              <dl>
                <div><dt><span className="branch-info-icon"><MapPin size={17} aria-hidden="true" /></span>{t.addressLabel}</dt><dd><a href={directions(r)} target="_blank" rel="noreferrer">{r.address}<ArrowUpRight size={15} aria-hidden="true" /></a></dd></div>
                <div><dt><span className="branch-info-icon"><Clock size={17} aria-hidden="true" /></span>{t.hours}</dt><dd><span>{t.openDays}</span><span>{t.lunch} {r.lunch} · {t.dinner} {r.dinner}</span><span className="branch-hours-closed">{t.days[1]} · {t.closed}</span></dd></div>
                <div><dt><span className="branch-info-icon"><Phone size={17} aria-hidden="true" /></span>{t.phoneLabel}</dt><dd><a href={`tel:${r.telephone}`}>{r.phone}</a></dd></div>
                <div><dt><span className="branch-info-icon"><Mail size={17} aria-hidden="true" /></span>{t.emailLabel}</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
              </dl>
              {r.websiteUrl && <a className="text-link branch-website" href={r.websiteUrl}>{t.restaurantWebsite}<ArrowUpRight size={17} aria-hidden="true" /></a>}
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>
      <section className="branch-experience section" id="prices">
        <div className="container branch-experience-grid">
          <Reveal>
            {r.websiteUrl ? (
              <div className="branch-pricing">
                <div className="branch-block-heading"><h2>{t.prices}</h2></div>
                <p className="pricing-note"><a href={r.websiteUrl}>{t.splPrices}</a></p>
              </div>
            ) : <RestaurantPricing locale={locale} />}
          </Reveal>
          <Reveal className="branch-gallery" delay={0.1}>
          <div id="food">
            <div className="branch-block-heading"><h2 id="space">{galleryLabel}</h2></div>
            <FoodCarousel
              key={r.id}
              label={galleryLabel}
              photos={[
                ...(r.gallery.length ? r.gallery : r.image ? [{ src: r.image, altKey: "restaurantExterior" as const, city: r.city }] : []),
                ...r.foodPhotos,
              ]}
            />
          </div>
          </Reveal>
        </div>
        <SectionSeparator />
      </section>
      <section className="branch-reservation-section section" id="reservation">
        <div className="container">
        <Reveal className="branch-reservation-card">
          <div className="branch-reservation-heading">
            <div><h2>{t.reserve}</h2><p>{r.reservationWidgetUrl ? r.city : r.phone}</p></div>
            <Link className="button" href={booking(r, locale)}>{bookingLabel}</Link>
          </div>
          <div className="branch-reservation-map">
            <iframe src={r.mapEmbedUrl} title={`${t.mapTitle} · ${r.city}`} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </Reveal>
        </div>
        <SectionSeparator />
      </section>
      {r.news.length > 0 && (
        <section className="branch-news section" id="news" aria-labelledby="news-title">
          <div className="container">
            <Reveal className="branch-block-heading"><h2 id="news-title">{t.news}</h2></Reveal>
            {r.news.map((n) => (
              <article key={n.title}>
                <time dateTime={n.date}>
                  {new Intl.DateTimeFormat(`${locale}-BE`, { dateStyle: "long" }).format(new Date(n.date))}
                </time>
                <h3>{n.title}</h3>
                <p>{n.summary}</p>
                {n.image && <Photo src={n.image} alt={n.title} />}
                {n.url && <a href={n.url}>{t.readMore}</a>}
              </article>
            ))}
          </div>
          <SectionSeparator />
        </section>
      )}
    </>
  );
}

function ReviewsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const reviews = customerReviews.filter((review) => review.restaurantId === jemeppe.id);
  const renderReviews = (duplicate: boolean) => reviews.map((review) => {
    const initials = review.author
      .split(" ")
      .slice(0, 2)
      .map((name) => name[0])
      .join("");
    return (
      <figure
        className={`review-card review-${review.text[locale].length <= 140 ? "short" : review.text[locale].length <= 230 ? "medium" : "long"}`}
        key={review.id}
        aria-hidden={duplicate || undefined}
      >
        <div className="review-card-top">
          <div
            className="review-stars"
            role="img"
            aria-label={t.reviewRating}
          >
            {Array.from({ length: review.rating }, (_, i) => (
              <Star
                key={i}
                size={15}
                fill="currentColor"
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="review-quote-mark" aria-hidden="true">
            “
          </span>
        </div>
        <blockquote lang={locale}>
          <p>{review.text[locale]}</p>
        </blockquote>
        <figcaption className="review-author">
          <span className="review-initials" aria-hidden="true">
            {initials}
          </span>
          <span>
            <strong>{review.author}</strong>
            <span>{jemeppe.city}</span>
          </span>
        </figcaption>
        <div className="review-source">
          <span>
            Google Maps{review.excerpt ? ` · ${t.reviewExcerpt}` : ""}
            {locale !== "en" ? ` · ${t.reviewTranslated}` : ""}
          </span>
          <a
            href={jemeppe.mapsUrl}
            tabIndex={duplicate ? -1 : undefined}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.reviewsOnGoogle} · ${jemeppe.city}`}
          >
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </figure>
    );
  });
  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{t.reviews}</p>
            <h2 id="reviews-title">{t.reviewsTitle}</h2>
          </div>
          <p>{t.reviewsIntro}</p>
        </Reveal>
        <ReviewCarousel
          copies={renderReviews(true)}
          previousLabel={t.previousReview}
          nextLabel={t.nextReview}
          label={t.reviews}
        >
          {renderReviews(false)}
        </ReviewCarousel>
        <VisitSection locale={locale} />
      </div>
      <SectionSeparator />
    </section>
  );
}

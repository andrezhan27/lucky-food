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
  homepageSpacePhotos,
  homepageFoodPhotos,
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
export function RestaurantCard({
  restaurant: r,
  locale,
  index,
  pricing = false,
  reserving = false,
}: {
  restaurant: Restaurant;
  locale: Locale;
  index: number;
  pricing?: boolean;
  reserving?: boolean;
}) {
  const t = getDictionary(locale);
  const href = reserving ? booking(r, locale) : `/${locale}/restaurants/${r.id}${pricing ? "#prices" : ""}`;
  const action = reserving ? t.reserve : pricing ? t.fullPrices : t.view;
  return (
    <article className="restaurant-card">
      <Link
        href={href}
        className={`restaurant-image branch-${r.id}`}
        aria-label={`${action} · ${r.city}`}
      >
        {r.image ? (
          <Photo src={r.image} alt={r.name} />
        ) : (
          <>
            <div className="branch-art">
              <span>LUCKY FOOD</span>
              <MapPin size={34} strokeWidth={1} />
              <strong>{r.city}</strong>
              <small>{t.imagePending}</small>
            </div>
            <span className="card-number">0{index + 1}</span>
          </>
        )}
      </Link>
      <div className="restaurant-copy">
        <p className="eyebrow">
          {index === 0 ? "SINT-PIETERS-LEEUW" : "JEMEPPE-SUR-SAMBRE"}
        </p>
        <h3>{r.city}</h3>
        <p className="address">{r.address}</p>
        <a className="phone-link" href={`tel:${r.telephone}`}>
          <Phone size={14} />
          {r.phone}
        </a>
        <Link
          className="restaurant-link"
          href={href}
        >
          {action}
          <span>
            <ArrowUpRight size={21} />
          </span>
        </Link>
      </div>
    </article>
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
        <MovingFoodCarousel photos={homepageFoodPhotos} />
      </div>
      <SectionSeparator />
    </section>
  );
}
export function SpaceGallery({
  locale,
  images = homepageSpacePhotos,
}: {
  locale: Locale;
  images?: GalleryPhoto[];
}) {
  const t = getDictionary(locale);
  return (
    <div className="space-gallery">
      {images.map((photo) => (
        <figure className="space-item" key={photo.src}>
          <Photo
            src={photo.src}
            alt={`${t[photo.altKey]}${photo.city ? ` · ${photo.city}` : ""}`}
            sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1432px) calc((100vw - 132px) / 2), 650px"
          />
          {photo.city && (
            <figcaption className="space-caption">{photo.city}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
export function ReservationCTA({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <div className="reservation reservation-card" id="reservation" role="region" aria-labelledby="reservation-title">
      <div className="reservation-grid">
        <div>
          <p className="eyebrow">{t.reserveKicker}</p>
          <h2 id="reservation-title">{t.reserveTitle}</h2>
          <p>{t.reserveIntro}</p>
        </div>
        <div className="reservation-options">
          {restaurants.map((r, i) => (
            <Link
              key={r.id}
              href={booking(r, locale)}
              aria-label={`${t.reserve} · ${r.city}`}
            >
              <span className="reservation-number">0{i + 1}</span>
              <span>
                <strong>{r.city}</strong>
                <small>
                  {t.onlineBooking}
                </small>
              </span>
              <ArrowUpRight size={23} />
            </Link>
          ))}
        </div>
      </div>
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
          <Link href={`/${locale}/restaurants/choose-branch`}>{t.restaurants}</Link>
          <Link href={`/${locale}#food`}>{t.food}</Link>
          <Link href={`/${locale}/restaurants/choose-branch`}>{t.prices}</Link>
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
      <section className="section restaurants-section" id="restaurants">
        <div className="container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">{t.locationKicker}</p>
              <h2>{t.locationTitle}</h2>
            </div>
            <p>{t.locationIntro}</p>
          </Reveal>
          <div className="restaurant-grid">
            {restaurants.map((r, i) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                locale={locale}
                index={i}
              />
            ))}
          </div>
        </div>
        <SectionSeparator />
      </section>
      <FoodSection locale={locale} />
      <PricingOverview locale={locale} />
      <section className="section spaces-section" id="spaces">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t.spaceKicker}</p>
              <h2>{t.spaceTitle}</h2>
            </div>
            <p>{t.spaceIntro}</p>
          </div>
          <SpaceGallery locale={locale} />
          <p className="photo-caption">{t.brandPhoto}</p>
        </div>
        <SectionSeparator />
      </section>
      <ReviewsSection locale={locale} />
    </>
  );
}
export function PricingOverview({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <section className="section pricing-overview" id="pricing-overview">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.prices}</p>
            <h2>{t.priceOverviewTitle}</h2>
          </div>
          <p>{t.priceOverviewIntro}</p>
        </div>
        <div className="price-overview-packages">
          {(["base", "plus"] as const).map((name) => (
            <p key={name}><strong>{t[name]}</strong><span>{t[name === "base" ? "baseInfo" : "plusInfo"]}</span></p>
          ))}
        </div>
        <div className="price-overview-grid">
          {restaurants.map((r) => (
            <article className="price-overview-location" key={r.id}>
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
          ))}
        </div>
        <p className="pricing-note">{t.priceOverviewNote}</p>
      </div>
      <SectionSeparator />
    </section>
  );
}
function RestaurantPricing({ restaurant: r, locale }: { restaurant: Restaurant; locale: Locale }) {
  const t = getDictionary(locale);
  const hasChildrenPrices = r.prices.every(row => row.children !== undefined);
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
      <p className="branch-package-note">{r.id === "jemeppe" ? t.childJ : t.childSPL}</p>
      {r.id === "jemeppe" && (
        <table className="branch-price-table">
          <caption className="sr-only">{r.name} · {t.childrenLabel} · {t.perPerson}</caption>
          <thead><tr><th scope="col">{t.service}</th><th scope="col">{t.age4}</th><th scope="col">{t.age11}</th></tr></thead>
          <tbody>{r.prices.map(row => (
            <tr key={row.period}><th scope="row">{t[row.period]}</th><td>{money(row.children![0], locale)}</td><td>{money(row.children![1], locale)}</td></tr>
          ))}</tbody>
        </table>
      )}
    </>
  );
  return (
    <div className="branch-pricing">
      <div className="branch-block-heading"><h2>{t.prices}</h2></div>
      {hasChildrenPrices ? (
        <PriceTabs label={t.prices} adultsLabel={t.adultsLabel} childrenLabel={t.childrenLabel} adults={adults}>{children}</PriceTabs>
      ) : adults}
      <details className="branch-price-details">
        <summary>{t.priceDetails}</summary>
        <p>{t.conditions}</p>
        {r.id === "jemeppe" && <p>{t.digestif}</p>}
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
                <Link className="button" href={booking(r, locale)}>{t.reserve}</Link>
              </div>
              <dl>
                <div><dt><span className="branch-info-icon"><MapPin size={17} aria-hidden="true" /></span>{t.addressLabel}</dt><dd><a href={directions(r)} target="_blank" rel="noreferrer">{r.address}<ArrowUpRight size={15} aria-hidden="true" /></a></dd></div>
                <div><dt><span className="branch-info-icon"><Clock size={17} aria-hidden="true" /></span>{t.hours}</dt><dd><span>{t.openDays}</span><span>{t.lunch} {r.lunch} · {t.dinner} {r.dinner}</span><span className="branch-hours-closed">{t.days[1]} · {t.closed}</span></dd></div>
                <div><dt><span className="branch-info-icon"><Phone size={17} aria-hidden="true" /></span>{t.phoneLabel}</dt><dd><a href={`tel:${r.telephone}`}>{r.phone}</a></dd></div>
                <div><dt><span className="branch-info-icon"><Mail size={17} aria-hidden="true" /></span>{t.emailLabel}</dt><dd><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
              </dl>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>
      <section className="branch-experience section" id="prices">
        <div className="container branch-experience-grid">
          <RestaurantPricing restaurant={r} locale={locale} />
          <div className="branch-gallery" id="food">
            <div className="branch-block-heading"><h2 id="space">{t.spaceBuffet}</h2></div>
            <FoodCarousel
              key={r.id}
              label={t.spaceBuffet}
              photos={[
                ...(r.gallery.length ? r.gallery : r.image ? [{ src: r.image, altKey: "restaurantExterior" as const, city: r.city }] : []),
                ...r.foodPhotos,
              ]}
            />
          </div>
        </div>
        <SectionSeparator />
      </section>
      <section className="branch-reservation-section section" id="reservation">
        <div className="container branch-reservation-card">
          <div className="branch-reservation-heading">
            <div><h2>{t.reserve}</h2><p>{r.city}</p></div>
            <Link className="button" href={booking(r, locale)}>{t.reserve}</Link>
          </div>
          <div className="branch-reservation-map">
            <iframe src={r.mapEmbedUrl} title={`${t.mapTitle} · ${r.city}`} width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        </div>
        <SectionSeparator />
      </section>
      {(r.id === "jemeppe" || r.news.length > 0) && (
        <section className="branch-news section" id="news" aria-labelledby="news-title">
          <div className="container">
            <div className="branch-block-heading"><h2 id="news-title">{t.news}</h2></div>
            {r.id === "jemeppe" && (
              <div className="branch-news-grid">
                {[
                  { src: "/images/JSSNoel2025.webp", alt: t.newsChristmasPoster },
                  { src: "/images/JSSnewyear2025.webp", alt: t.newsNewYearPoster },
                ].map(poster => (
                  <a className="branch-news-poster" key={poster.src} href={poster.src} target="_blank" rel="noreferrer">
                    <Image src={poster.src} alt={poster.alt} width={1920} height={1353} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1150px) calc((100vw - 96px) / 2), 648px" />
                  </a>
                ))}
              </div>
            )}
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

export function ReviewsSection({
  locale,
  restaurant,
}: {
  locale: Locale;
  restaurant?: Restaurant;
}) {
  const t = getDictionary(locale);
  const reviews = restaurant
    ? customerReviews.filter((review) => review.restaurantId === restaurant.id)
    : customerReviews;
  return (
    <section
      className="section reviews-section"
      id="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t.reviews}</p>
            <h2 id="reviews-title">{t.reviewsTitle}</h2>
          </div>
          <p>{t.reviewsIntro}</p>
        </div>
        <ReviewCarousel
          key={restaurant?.id || "all-restaurants"}
          previousLabel={t.previousReview}
          nextLabel={t.nextReview}
          label={t.reviews}
        >
          {reviews.map((review) => {
            const branch = restaurants.find(
              (r) => r.id === review.restaurantId,
            )!;
            const initials = review.author
              .split(" ")
              .slice(0, 2)
              .map((name) => name[0])
              .join("");
            return (
              <figure
                className={`review-card review-${review.text[locale].length <= 140 ? "short" : review.text[locale].length <= 230 ? "medium" : "long"}`}
                key={review.id}
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
                    <span>{branch.city}</span>
                  </span>
                </figcaption>
                <div className="review-source">
                  <span>
                    Google Maps{review.excerpt ? ` · ${t.reviewExcerpt}` : ""}
                    {locale !== "en" ? ` · ${t.reviewTranslated}` : ""}
                  </span>
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t.reviewsOnGoogle} · ${branch.city}`}
                  >
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </figure>
            );
          })}
        </ReviewCarousel>
        {!restaurant && <ReservationCTA locale={locale} />}
      </div>
      <SectionSeparator />
    </section>
  );
}

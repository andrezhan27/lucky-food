"use client";
import {
  createContext,
  useCallback,
  Children,
  useContext,
  useId,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import type { FoodPhoto } from "@/lib/data";
import { motion, useReducedMotion } from "framer-motion";
import {
  locales,
  restaurants,
  bookingForPath,
  type Locale,
  type GalleryPhoto,
} from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import { captureLocaleScroll, capturePageTop, restoreLocaleScroll, takeLocaleScroll } from "@/lib/locale-scroll";
const LanguageContext = createContext<Locale>("fr");
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const position = takeLocaleScroll(pathname);
    if (!position) return;
    restoreLocaleScroll(position);
    // Recheck once after the translated layout has completed its first frame.
    const frame = requestAnimationFrame(() => restoreLocaleScroll(position));
    return () => cancelAnimationFrame(frame);
  }, [locale, pathname]);
  return (
    <LanguageContext.Provider value={locale}>
      {children}
    </LanguageContext.Provider>
  );
}
export function LanguageSwitcher() {
  const locale = useContext(LanguageContext);
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <div
      className="languages"
      role="group"
      aria-label={getDictionary(locale).language}
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={`${pathname.replace(/^\/(fr|nl|en)(?=\/|$)/, `/${l}`)}${hash}`}
          hrefLang={l}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            if (l === locale) return;
            const nextPathname = pathname.replace(/^\/(fr|nl|en)(?=\/|$)/, `/${l}`);
            captureLocaleScroll(nextPathname);
            router.push(`${nextPathname}${window.location.hash}`, { scroll: false });
          }}
          aria-current={l === locale ? "page" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
export function BookingLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const locale = useContext(LanguageContext);
  const pathname = usePathname();
  return <Link className={className} href={bookingForPath(pathname, locale)}>{children}</Link>;
}
export function PageFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return /^\/(fr|nl|en)\/reservation\/[^/]+$/.test(pathname) ? null : children;
}
function RestaurantDropdown({ locale, onSelect }: {
  locale: Locale;
  onSelect?: () => void;
}) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [expanded]);
  return (
    <div
      className="restaurant-dropdown"
      ref={root}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          event.stopPropagation();
          setExpanded(false);
          trigger.current?.focus();
        }
        if (event.key === "ArrowDown" && event.target === trigger.current) {
          event.preventDefault();
          setExpanded(true);
          requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("a")?.focus());
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="restaurant-dropdown-trigger"
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => setExpanded(value => !value)}
      >
        {t.restaurants}<ChevronDown size={14} aria-hidden="true" />
      </button>
      <div className="restaurant-dropdown-panel" id={id} hidden={!expanded}>
        {restaurants.map(restaurant => (
          <Link
            key={restaurant.id}
            href={`/${locale}/restaurants/${restaurant.id}`}
            scroll={false}
            aria-current={pathname === `/${locale}/restaurants/${restaurant.id}` ? "page" : undefined}
            onClick={event => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              const destination = `/${locale}/restaurants/${restaurant.id}`;
              if (pathname === destination) {
                event.preventDefault();
                router.replace(destination, { scroll: false });
                window.scrollTo({ top: 0, behavior: "instant" });
              } else {
                capturePageTop(destination);
              }
              setExpanded(false);
              onSelect?.();
            }}
          >
            <span>{restaurant.city}</span><ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const locale = useContext(LanguageContext);
  const pathname = usePathname();
  const router = useRouter();
  const t = getDictionary(locale);
  const reservationHref = bookingForPath(pathname, locale);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    Array.from(panel.current?.querySelectorAll<HTMLElement>("a,button") || [])
      .find(element => element.getClientRects().length > 0)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [
          button.current,
          ...Array.from(
            panel.current?.querySelectorAll<HTMLElement>("a,button") || [],
          ),
        ].filter((item): item is HTMLElement => !!item && item.getClientRects().length > 0);
        const first = items[0],
          last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const navigation = ["food", "prices", "spaces"] as const;
  const navHref = (key: typeof navigation[number]) =>
    key === "prices"
      ? `/${locale}/restaurants/choose-branch`
      : `/${locale}#${key}`;
  const links = navigation.map((key) => (
    <Link
      key={key}
      href={navHref(key)}
      onClick={() => {
        setOpen(false);
        button.current?.focus();
      }}
    >
      {t[key]}
    </Link>
  ));
  return (
    <header
      className={`header ${scrolled || open || pathname.includes("/restaurants/") || pathname.includes("/reservation") ? "solid" : ""}`}
    >
      <div className="header-inner">
        <Link
          className="logo"
          href={`/${locale}`}
          scroll={false}
          aria-label={`Lucky Food · ${t.home}`}
          onClick={event => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const home = `/${locale}`;
            if (pathname === home) {
              event.preventDefault();
              router.replace(home, { scroll: false });
              window.scrollTo({ top: 0, behavior: "instant" });
            } else {
              capturePageTop(home);
            }
            setOpen(false);
          }}
        >
          <Image
            src="/images/logo.webp"
            width={2172}
            height={724}
            alt="Lucky Food"
            sizes="180px"
          />
        </Link>
        <nav className="desktop-nav" aria-label={t.menu}>
          <RestaurantDropdown locale={locale} />
          {navigation.map((key) => (
            <Link key={key} href={navHref(key)}>
              {t[key]}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link
            className="button small header-book"
            href={reservationHref}
          >
            {t.reserve}
          </Link>
          <button
            className="menu-toggle"
            ref={button}
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div
          className="mobile-menu"
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label={t.menu}
        >
          <nav>
            <RestaurantDropdown locale={locale} onSelect={() => {
              setOpen(false);
              button.current?.focus();
            }} />
            {links}
            <Link
              href={reservationHref}
              onClick={() => {
                setOpen(false);
                button.current?.focus();
              }}
            >
              {t.reserve}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ y: reduce ? 0 : 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduce ? 0 : 0.5 }}
    >
      {children}
    </motion.div>
  );
}
export function FoodCarousel({ photos, label }: { photos: GalleryPhoto[]; label?: string }) {
  const locale = useContext(LanguageContext);
  const t = getDictionary(locale);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const go = useCallback((index: number, automatic = false) => {
    const next = Math.max(0, Math.min(index, photos.length - 1));
    track.current?.scrollTo({
      left: next * track.current.clientWidth,
      behavior: reduce || (automatic && next === 0) ? "instant" : "smooth",
    });
  }, [photos.length, reduce]);
  const canAutoPlay = !reduce && inView && pageVisible && !hovered && !focused && !touching;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(entries => {
      setInView((entries[0]?.intersectionRatio ?? 0) >= 0.25);
    }, { threshold: 0.25 });
    observer.observe(element);
    const visibility = () => setPageVisible(!document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!canAutoPlay || photos.length < 2) return;
    const timer = window.setTimeout(() => go((active + 1) % photos.length, true), 6000);
    return () => window.clearTimeout(timer);
  }, [active, canAutoPlay, go, photos.length]);
  return (
    <section
      className="food-carousel"
      ref={root}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => { setHovered(false); setTouching(false); }}
      onPointerDown={event => { if (event.pointerType !== "mouse") setTouching(true); }}
      onPointerUp={() => setTouching(false)}
      onPointerCancel={() => setTouching(false)}
      onFocus={() => setFocused(true)}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      aria-label={label ?? t.food}
      aria-roledescription={t.carousel}
    >
      <div
        className="food-carousel-track"
        ref={track}
        tabIndex={0}
        aria-label={t.carousel}
        onScroll={() => {
          const el = track.current;
          if (el?.clientWidth)
            setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            go(
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? photos.length - 1
                  : active + (event.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
      >
        {photos.map((photo, i) => (
          <figure
            className="food-carousel-slide"
            key={photo.src}
            role="group"
            aria-roledescription={t.slide}
            aria-label={`${i + 1} / ${photos.length}`}
          >
            <Image
              src={photo.src}
              alt={`${t[photo.altKey]}${photo.city ? ` · ${photo.city}` : ""}`}
              fill
              sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 900px) calc(100vw - 72px), 50vw"
            />
          </figure>
        ))}
      </div>
      <div className="food-carousel-controls">
        <p aria-live={canAutoPlay ? "off" : "polite"} aria-atomic="true">
          <span>{photos[active]?.city}</span>
          <span className="carousel-count">
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </p>
        <div>
          <button
            type="button"
            aria-label={t.previousPhoto}
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <ArrowLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={t.nextPhoto}
            disabled={active === photos.length - 1}
            onClick={() => go(active + 1)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export function MovingFoodCarousel({ photos }: { photos: FoodPhoto[] }) {
  const locale = useContext(LanguageContext);
  const t = getDictionary(locale);
  return (
    <section
      className="moving-food-carousel"
      aria-label={t.food}
      aria-roledescription={t.carousel}
    >
      <div
        className="moving-food-viewport"
        tabIndex={0}
        aria-label={t.carousel}
      >
        <div className="moving-food-track">
          {[false, true].map((duplicate) => (
            <div
              className="moving-food-group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
            >
              {photos.map((photo) => (
                <figure
                  className="moving-food-card"
                  key={photo.src}
                  style={{
                    width: `calc(var(--food-strip-height) * ${photo.width / photo.height})`,
                  }}
                >
                  <Image
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    alt={duplicate ? "" : `${t[photo.altKey]} · ${photo.city}`}
                    sizes={`(max-width: 700px) ${Math.round((240 * photo.width) / photo.height)}px, ${Math.round((380 * photo.width) / photo.height)}px`}
                    draggable={false}
                  />
                  <figcaption>{photo.city}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="moving-food-controls">
        <span>{t.foodNote}</span>

      </div>
    </section>
  );
}

export function ReviewCarousel({
  children,
  previousLabel,
  nextLabel,
  label,
}: {
  children: React.ReactNode;
  previousLabel: string;
  nextLabel: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const total = Children.count(children);
  const [view, setView] = useState({
    start: true,
    end: false,
  });
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      setView({
        start: el.scrollLeft <= 8,
        end: el.scrollLeft >= maxScroll - 8,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
    };
  }, [total]);
  const go = (direction: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".review-card");
    el.scrollBy({
      left:
        direction *
        ((card?.getBoundingClientRect().width || el.clientWidth) + 24),
      behavior: reduce ? "instant" : "smooth",
    });
  };
  return (
    <div className="review-carousel">
      <button className="review-arrow review-arrow-previous" type="button" aria-label={previousLabel} disabled={view.start} onClick={() => go(-1)}>
        <ArrowLeft size={18} aria-hidden="true" />
      </button>
      <div
        className="review-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-label={label}
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            (event.key === "ArrowLeft" || event.key === "ArrowRight")
          ) {
            event.preventDefault();
            go(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
      <button className="review-arrow review-arrow-next" type="button" aria-label={nextLabel} disabled={view.end} onClick={() => go(1)}>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

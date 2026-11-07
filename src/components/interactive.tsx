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
  type CSSProperties,
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
import { useReducedMotion } from "framer-motion";
import {
  locales,
  restaurants,
  booking,
  jemeppe,
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
  return <Link className={className} href={booking(jemeppe, locale)}>{children}</Link>;
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
  const reservationHref = booking(jemeppe, locale);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => {
    setOpen(false);
    button.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    let pastThreshold: boolean | undefined;
    const scroll = () => {
      const next = window.scrollY > 30;
      if (pastThreshold === next) return;
      pastThreshold = next;
      setScrolled(next);
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (panel.current) panel.current.scrollTop = 0;
    Array.from(panel.current?.querySelectorAll<HTMLElement>("a,button") || [])
      .find(element => element.getClientRects().length > 0)?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
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
  }, [closeMenu, open]);
  const navigation = ["food", "prices", "spaces"] as const;
  const navHref = (key: typeof navigation[number]) =>
    key === "prices"
      ? `/${locale}#pricing-overview`
      : `/${locale}#${key}`;
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
            type="button"
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <div
        className="mobile-menu"
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal={open || undefined}
        aria-label={t.menu}
        inert={!open}
      >
        <nav>
          <RestaurantDropdown locale={locale} onSelect={closeMenu} />
          {navigation.map((key) => (
            <Link key={key} href={navHref(key)} onClick={closeMenu}>
              {t[key]}
            </Link>
          ))}
          <Link className="button mobile-menu-book" href={reservationHref} onClick={closeMenu}>
            {t.reserve}
          </Link>
        </nav>
      </div>
    </header>
  );
}
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node || reduce || !("IntersectionObserver" in window)) return;
    // Leave server-rendered content and the current reading position visible.
    // Only prepare elements that are still below the viewport for a reveal.
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    node.dataset.reveal = "waiting";
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      node.dataset.reveal = "visible";
      observer.disconnect();
    }, { rootMargin: "0px 0px -32px 0px" });
    observer.observe(node);
    return () => {
      observer.disconnect();
      delete node.dataset.reveal;
    };
  }, [reduce]);
  return (
    <div
      ref={element}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      onFocusCapture={event => { event.currentTarget.dataset.reveal = "visible"; }}
    >
      {children}
    </div>
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
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = viewport.current;
    const track = element?.querySelector(".moving-food-track");
    const group = track?.firstElementChild;
    if (!element || !track || !group) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const duration = 140_000;
    const frictionTime = 170;
    // Seek the compositor animation during manual input, then let it run on its own.
    const effect = new KeyframeEffect(track, [], { duration, iterations: Infinity });
    const animation = new Animation(effect, document.timeline);
    let groupWidth = 0;
    let visible = false;
    let momentumFrame = 0;
    let drag: {
      id: number;
      startX: number;
      startTime: number;
      lastX: number;
      lastAt: number;
      velocity: number;
    } | undefined;

    const stopMomentum = () => {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    };
    const updatePlayback = () => {
      if (!groupWidth) return;
      if (!visible || element.matches(":focus-visible")) {
        stopMomentum();
        animation.pause();
      } else if (!drag && !momentumFrame) {
        animation.play();
      }
    };
    const currentTime = () => Number(animation.currentTime ?? 0) % duration;
    const seek = (time: number, pixels: number) => {
      const next = time + (pixels / groupWidth) * duration;
      animation.currentTime = ((next % duration) + duration) % duration;
    };
    const coast = (velocity: number) => {
      const start = performance.now();
      const time = currentTime();
      const autoplaySpeed = groupWidth / duration;
      const extraSpeed = velocity - autoplaySpeed;

      const step = (now: number) => {
        const elapsed = Math.max(0, now - start);
        const decay = Math.exp(-elapsed / frictionTime);
        // Ease the release speed into the autoplay speed so the handoff stays continuous.
        seek(time, autoplaySpeed * elapsed + extraSpeed * frictionTime * (1 - decay));
        if (Math.abs(extraSpeed * decay) > 0.025) {
          momentumFrame = requestAnimationFrame(step);
        } else {
          momentumFrame = 0;
          updatePlayback();
        }
      };
      momentumFrame = requestAnimationFrame(step);
    };
    const resizeTrack = () => {
      const width = group.getBoundingClientRect().width;
      const nextWidth = !reducedMotion.matches && width > element.clientWidth ? width : 0;
      if (nextWidth === groupWidth) return;

      stopMomentum();
      const progress = currentTime() / duration;
      if (nextWidth) {
        const position = groupWidth ? progress * nextWidth : element.scrollLeft;
        element.dataset.moving = "";
        effect.setKeyframes([{ transform: "translateX(0px)" }, { transform: `translateX(-${nextWidth}px)` }]);
        animation.currentTime = ((position % nextWidth) / nextWidth) * duration;
      } else {
        animation.cancel();
        delete element.dataset.moving;
        element.scrollLeft = progress * width;
        drag = undefined;
      }
      groupWidth = nextWidth;
      updatePlayback();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!groupWidth || !event.isPrimary || event.button !== 0 || drag) return;
      element.setPointerCapture(event.pointerId);
      stopMomentum();
      animation.pause();
      drag = {
        id: event.pointerId,
        startX: event.clientX,
        startTime: currentTime(),
        lastX: event.clientX,
        lastAt: event.timeStamp,
        velocity: 0,
      };
    };
    const onPointerMove = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const elapsed = event.timeStamp - drag.lastAt;
      if (elapsed > 0) {
        const speed = (drag.lastX - event.clientX) / elapsed;
        const weight = 1 - Math.exp(-elapsed / 35);
        drag.velocity += (speed - drag.velocity) * weight;
        drag.lastX = event.clientX;
        drag.lastAt = event.timeStamp;
      }
      seek(drag.startTime, drag.startX - event.clientX);
    };
    const onPointerEnd = (event: PointerEvent) => {
      if (drag?.id !== event.pointerId) return;
      const idleTime = event.timeStamp - drag.lastAt;
      const velocity = Math.max(-2.5, Math.min(2.5, drag.velocity)) * Math.max(0, 1 - idleTime / 100);
      drag = undefined;
      if (event.type === "pointerup" && Math.abs(velocity) > 0.06) coast(velocity);
      updatePlayback();
    };
    const onWheel = (event: WheelEvent) => {
      const { deltaMode, deltaX, deltaY, shiftKey } = event;
      const horizontal = shiftKey ? deltaX || deltaY : deltaX;
      if (!groupWidth || !horizontal || event.ctrlKey || !event.cancelable) return;
      if (!shiftKey && Math.abs(deltaY) > Math.abs(horizontal)) return;
      event.preventDefault();
      const unit = deltaMode === 1 ? 16 : deltaMode === 2 ? element.clientWidth : 1;
      stopMomentum();
      seek(currentTime(), horizontal * unit);
      updatePlayback();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!groupWidth || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault();
      stopMomentum();
      updatePlayback();
      seek(currentTime(), event.key === "ArrowLeft" ? -80 : 80);
    };

    const resize = new ResizeObserver(resizeTrack);
    resize.observe(group);
    resize.observe(element);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    visibility.observe(element);
    reducedMotion.addEventListener("change", resizeTrack);
    element.addEventListener("pointerdown", onPointerDown, { passive: true });
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerup", onPointerEnd);
    element.addEventListener("pointercancel", onPointerEnd);
    element.addEventListener("lostpointercapture", onPointerEnd);
    element.addEventListener("wheel", onWheel, { passive: false });
    element.addEventListener("keydown", onKeyDown);
    element.addEventListener("focus", updatePlayback);
    element.addEventListener("blur", updatePlayback);
    return () => {
      stopMomentum();
      animation.cancel();
      delete element.dataset.moving;
      resize.disconnect();
      visibility.disconnect();
      reducedMotion.removeEventListener("change", resizeTrack);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerEnd);
      element.removeEventListener("pointercancel", onPointerEnd);
      element.removeEventListener("lostpointercapture", onPointerEnd);
      element.removeEventListener("wheel", onWheel);
      element.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("focus", updatePlayback);
      element.removeEventListener("blur", updatePlayback);
    };
  }, []);

  return (
    <section
      className="moving-food-carousel"
      aria-label={t.food}
      aria-roledescription={t.carousel}
    >
      <div
        className="moving-food-viewport"
        ref={viewport}
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
                    alt={duplicate ? "" : t[photo.altKey]}
                    sizes={`(max-width: 700px) ${Math.round((240 * photo.width) / photo.height)}px, ${Math.round((380 * photo.width) / photo.height)}px`}
                    draggable={false}
                  />
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
  copies,
  previousLabel,
  nextLabel,
  label,
}: {
  children: React.ReactNode;
  copies: React.ReactNode;
  previousLabel: string;
  nextLabel: string;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const total = Children.count(children);
  const looping = total > 1;

  useLayoutEffect(() => {
    const el = track.current;
    if (!el || !looping) return;

    const cycleWidth = () => el.children[total].getBoundingClientRect().left
      - el.children[0].getBoundingClientRect().left;
    el.scrollTo({ left: cycleWidth(), behavior: "instant" });

    // Shift a settled copy to its matching position in the middle set.
    const recenter = () => {
      const width = cycleWidth();
      const left = el.scrollLeft;
      if (!width) return;
      if (left < width - 1) el.scrollTo({ left: left + width, behavior: "instant" });
      if (left >= width * 2 - 1) el.scrollTo({ left: left - width, behavior: "instant" });
    };
    if (Reflect.has(el, "onscrollend")) {
      el.addEventListener("scrollend", recenter);
      return () => el.removeEventListener("scrollend", recenter);
    }

    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(recenter, 160);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, [looping, total]);

  const go = (direction: number) => {
    const el = track.current;
    if (!el || !looping) return;
    const first = el.children[0].getBoundingClientRect().left;
    const step = el.children[1].getBoundingClientRect().left - first;
    el.scrollTo({
      left: (Math.round(el.scrollLeft / step) + direction) * step,
      behavior: reduce ? "instant" : "smooth",
    });
  };
  return (
    <div className="review-carousel">
      <button className="review-arrow review-arrow-previous" type="button" aria-label={previousLabel} disabled={!looping} onClick={() => go(-1)}>
        <ArrowLeft size={18} aria-hidden="true" />
      </button>
      <div
        className="review-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-label={label}
        onMouseDown={(event) => {
          // Copies can open their source link by pointer without taking focus.
          if (event.target instanceof Element && event.target.closest('.review-card[aria-hidden="true"] a')) {
            event.preventDefault();
          }
        }}
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
        {looping && <>{copies}</>}
        <>{children}</>
        {looping && <>{copies}</>}
        {total === 2 && <>{copies}</>}
      </div>
      <button className="review-arrow review-arrow-next" type="button" aria-label={nextLabel} disabled={!looping} onClick={() => go(1)}>
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

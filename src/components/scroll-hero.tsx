"use client";

import Image, { getImageProps } from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { jemeppe, sintPietersLeeuw, type Locale } from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import { SectionSeparator } from "./section-separator";
import { BookingLink } from "./interactive";

const portraitHeroMedia = "(max-width: 900px) and (orientation: portrait)";

export function ScrollHero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Full transform values let Motion use a native scroll timeline where supported.
  const above = "translateY(-100%)";
  const center = "translateY(0%)";
  const below = "translateY(100%)";
  const firstSlide = useTransform(scrollYProgress, [0, 0.1, 0.5, 1], [center, center, above, above]);
  const secondSlide = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.9, 1], [below, below, center, above, above]);
  const thirdSlide = useTransform(scrollYProgress, [0, 0.5, 0.9, 1], [below, below, center, center]);

  return (
    <section ref={section} className="scroll-hero" aria-labelledby="hero-name" data-reduced-motion={reduce ? "true" : undefined}>
      <div className="scroll-hero-panel">
        <div className="scroll-hero-images" aria-hidden="true">
          {[firstSlide, secondSlide, thirdSlide].map((transform, index) => {
            const name = `hero-${index + 1}`;
            const version = index === 1 ? "?v=3" : "";
            const common = { alt: "", fill: true, sizes: "100vw" };
            const { props: desktop } = getImageProps({ ...common, src: `/images/${name}.webp${version}` });
            const { props: mobile } = getImageProps({ ...common, src: `/images/${name}-mobile.webp${version}` });

            return (
              <motion.div key={index} className={`scroll-hero-slide slide-${index + 1}`} style={{ transform: reduce ? "none" : transform }}>
                <picture>
                  <source media={portraitHeroMedia} srcSet={mobile.srcSet} sizes={mobile.sizes} />
                  {/* getImageProps preserves Next.js image optimisation for art direction. */}
                  <img
                    {...desktop}
                    alt=""
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                  />
                </picture>
                <div className="scroll-hero-shade" />
              </motion.div>
            );
          })}
        </div>
        <div className="scroll-hero-content">
          <h1 id="hero-name">
            <Image src="/images/logo.webp" alt="Lucky Food" width={2172} height={724} sizes="(max-width: 480px) 78vw, (max-width: 900px) 420px, 500px" loading="eager" />
          </h1>
          <p className="scroll-hero-locations">{jemeppe.city} <span aria-hidden="true">·</span> {sintPietersLeeuw.city}</p>
          <p className="scroll-hero-descriptor">{t.heroDescriptor}</p>
          <div className="scroll-hero-actions">
            <BookingLink className="hero-cta hero-cta-primary">{t.reserve}</BookingLink>
            <a className="hero-cta hero-cta-secondary" href="#food">
              {t.discover}
            </a>
          </div>
        </div>
        <div className="scroll-hero-bottom">
          <a href="#restaurants">{t.scroll}<ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <SectionSeparator />
      </div>
    </section>
  );
}

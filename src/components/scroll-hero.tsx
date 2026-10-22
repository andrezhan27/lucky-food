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
import type { Locale } from "@/lib/data";
import { getDictionary } from "@/lib/translations";
import { SectionSeparator } from "./section-separator";
import { BookingLink } from "./interactive";

export function ScrollHero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // Adjacent panels share their travel range so each wipe stays fully covered.
  const firstY = useTransform(scrollYProgress, [0, 0.1, 0.5, 1], ["0%", "0%", "-100%", "-100%"]);
  const secondY = useTransform(scrollYProgress, [0, 0.1, 0.5, 0.9, 1], ["100%", "100%", "0%", "-100%", "-100%"]);
  const thirdY = useTransform(scrollYProgress, [0, 0.5, 0.9, 1], ["100%", "100%", "0%", "0%"]);

  return (
    <section ref={section} className="scroll-hero" aria-labelledby="hero-name" data-reduced-motion={reduce ? "true" : undefined}>
      <div className="scroll-hero-panel">
        <div className="scroll-hero-images" aria-hidden="true">
          {[firstY, secondY, thirdY].map((y, index) => {
            const name = `hero${index ? `-${index + 1}` : ""}`;
            const common = { alt: "", fill: true, sizes: "100vw" };
            const { props: desktop } = getImageProps({ ...common, src: `/images/${name}.webp` });
            const { props: mobile } = getImageProps({ ...common, src: `/images/${name}-mobile.webp` });

            return (
              <motion.div key={index} className={`scroll-hero-slide slide-${index + 1}`} style={{ y: reduce ? 0 : y }}>
                <picture>
                  <source media="(max-width: 700px)" srcSet={mobile.srcSet} sizes={mobile.sizes} />
                  {/* getImageProps preserves Next.js image optimisation for art direction. */}
                  <img {...desktop} alt="" loading="eager" fetchPriority={index === 0 ? "high" : "auto"} />
                </picture>
                <div className="scroll-hero-shade" />
              </motion.div>
            );
          })}
        </div>
        <div className="scroll-hero-content">
          <h1 id="hero-name">
            <Image src="/images/logo.webp" alt="Lucky Food" width={2172} height={724} sizes="(max-width: 700px) 78vw, 500px" priority />
          </h1>
          <p className="scroll-hero-locations">Sint-Pieters-Leeuw <span aria-hidden="true">·</span> Jemeppe-sur-Sambre</p>
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

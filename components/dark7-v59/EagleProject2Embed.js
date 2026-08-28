"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dark7V59ScrollTrigger,
  DARK7_V59_HERO_PIN_ID,
  notifyHeroPinReady,
  refreshDark7V59ScrollTriggers,
} from "./lenisScrollTrigger";
import "./EagleProject2Embed.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Hero eagle from /eagle-project-2/ (Noomo crystalline bird, white scene). */
function setEmbedVisible(embedEl, visible) {
  if (!embedEl) return;
  embedEl.style.visibility = visible ? "visible" : "hidden";
  embedEl.style.opacity = visible ? "1" : "0";
  embedEl.style.pointerEvents = "none";
}

export default function EagleProject2Embed({ pinTargetRef }) {
  const embedRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const pinEl = pinTargetRef?.current;
    const embedEl = embedRef.current;
    if (!pinEl || !embedEl) return;

    ScrollTrigger.getById(DARK7_V59_HERO_PIN_ID)?.kill();
    setEmbedVisible(embedEl, true);

    const ctx = gsap.context(() => {
      ScrollTrigger.create(
        Dark7V59ScrollTrigger({
          id: DARK7_V59_HERO_PIN_ID,
          trigger: pinEl,
          start: "top top",
          end: "+=500",
          scrub: 0.8,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          refreshPriority: 3,
          onUpdate: (self) => {
            setEmbedVisible(embedEl, self.progress < 0.98);
          },
          onLeave: () => setEmbedVisible(embedEl, false),
          onEnterBack: () => setEmbedVisible(embedEl, true),
        }),
      );
    }, pinEl);

    const heroSection = pinEl.closest(".dark7-v59-hero");
    const intersectionObserver = heroSection
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              setEmbedVisible(embedEl, false);
            } else {
              const trigger = ScrollTrigger.getById(DARK7_V59_HERO_PIN_ID);
              const progress = trigger?.progress ?? 0;
              setEmbedVisible(embedEl, progress < 0.98);
            }
          },
          { threshold: 0.05 },
        )
      : null;

    intersectionObserver?.observe(heroSection);

    requestAnimationFrame(() => {
      refreshDark7V59ScrollTriggers();
    });

    const readyTimer = window.setTimeout(() => {
      refreshDark7V59ScrollTriggers(true);
      notifyHeroPinReady();
    }, 400);

    return () => {
      window.clearTimeout(readyTimer);
      intersectionObserver?.disconnect();
      ctx.revert();
      ScrollTrigger.getById(DARK7_V59_HERO_PIN_ID)?.kill();
    };
  }, [pinTargetRef]);

  return (
    <div ref={embedRef} className="eagle-project2-embed" aria-hidden>
      <iframe
        src="/eagle-project-2/?embed=1"
        title="Eagle hero scene"
        className="eagle-project2-embed__iframe"
        loading="eager"
        tabIndex={-1}
      />
    </div>
  );
}

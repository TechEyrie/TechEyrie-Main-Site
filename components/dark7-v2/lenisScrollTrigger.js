import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Lenis + ScrollTrigger scroller for all dark7-v2 sections. */
export const DARK7_V2_SCROLLER =
  typeof document !== "undefined" ? document.documentElement : null;

export const DARK7_V2_HERO_PIN_ID = "dark7-v2-eagle-hero";
export const DARK7_V2_HERO_PIN_READY_EVENT = "dark7-v2-hero-pin-ready";

let lenisInstance = null;
let removeRefreshInitListener = null;

export function getDark7V2ScrollTop() {
  if (lenisInstance) return lenisInstance.scroll;
  if (DARK7_V2_SCROLLER) {
    return ScrollTrigger.getScrollFunc(DARK7_V2_SCROLLER)?.() ?? window.scrollY;
  }
  return window.scrollY;
}

/** Merge dark7-v2 scroll defaults into a ScrollTrigger config object. */
export function dark7V2ScrollTrigger(vars = {}) {
  return {
    scroller: DARK7_V2_SCROLLER,
    invalidateOnRefresh: true,
    ...vars,
  };
}

/**
 * Wire Lenis to ScrollTrigger. Call once from MainPage before child
 * useLayoutEffects create their ScrollTriggers.
 */
function applyDark7V2ScrollerProxy(lenis) {
  if (!DARK7_V2_SCROLLER) return;

  // Lenis always transforms documentElement — "fixed" pins shift downstream triggers.
  const pinType = lenis ? "transform" : DARK7_V2_SCROLLER.style.transform ? "transform" : "fixed";

  ScrollTrigger.scrollerProxy(DARK7_V2_SCROLLER, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType,
  });
}

export function initDark7V2LenisScroll(lenis) {
  if (typeof window === "undefined" || !DARK7_V2_SCROLLER) return;

  lenisInstance = lenis;

  applyDark7V2ScrollerProxy(lenis);

  const onRefreshInit = () => applyDark7V2ScrollerProxy(lenis);
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  removeRefreshInitListener = () => {
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
  };

  ScrollTrigger.defaults({
    scroller: DARK7_V2_SCROLLER,
    invalidateOnRefresh: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  requestAnimationFrame(() => {
    applyDark7V2ScrollerProxy(lenis);
    refreshDark7V2ScrollTriggers(true);
  });
}

export function destroyDark7V2LenisScroll(lenis) {
  lenisInstance = null;
  removeRefreshInitListener?.();
  removeRefreshInitListener = null;

  if (typeof window === "undefined" || !DARK7_V2_SCROLLER) return;

  ScrollTrigger.scrollerProxy(DARK7_V2_SCROLLER, {});
  ScrollTrigger.defaults({
    scroller: undefined,
    invalidateOnRefresh: false,
  });
}

export function refreshDark7V2ScrollTriggers(hard = true) {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh(hard);
  ScrollTrigger.sort();
}

/** Run callback after the hero eagle pin exists and layout has been recalculated. */
export function subscribeAfterHeroPin(callback) {
  if (typeof window === "undefined") return () => {};

  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    refreshDark7V2ScrollTriggers(true);
    callback();
  };

  if (ScrollTrigger.getById(DARK7_V2_HERO_PIN_ID)) {
    requestAnimationFrame(run);
    return () => {
      cancelled = true;
    };
  }

  const onReady = () => {
    window.removeEventListener(DARK7_V2_HERO_PIN_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
    run();
  };

  window.addEventListener(DARK7_V2_HERO_PIN_READY_EVENT, onReady);
  const fallbackTimer = window.setTimeout(onReady, 2000);

  return () => {
    cancelled = true;
    window.removeEventListener(DARK7_V2_HERO_PIN_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
  };
}

export function notifyHeroPinReady() {
  if (typeof window === "undefined") return;
  refreshDark7V2ScrollTriggers(true);
  window.dispatchEvent(new Event(DARK7_V2_HERO_PIN_READY_EVENT));
}

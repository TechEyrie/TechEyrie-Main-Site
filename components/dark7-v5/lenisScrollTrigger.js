import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Lenis + ScrollTrigger scroller for all dark7-v5 sections. */
export const DARK7_V5_SCROLLER =
  typeof document !== "undefined" ? document.documentElement : null;

let lenisInstance = null;
let removeRefreshInitListener = null;

export function getDark7V5ScrollTop() {
  if (lenisInstance) return lenisInstance.scroll;
  if (DARK7_V5_SCROLLER) {
    return ScrollTrigger.getScrollFunc(DARK7_V5_SCROLLER)?.() ?? window.scrollY;
  }
  return window.scrollY;
}

/** Merge dark7-v5 scroll defaults into a ScrollTrigger config object. */
export function dark7V5ScrollTrigger(vars = {}) {
  return {
    scroller: DARK7_V5_SCROLLER,
    invalidateOnRefresh: true,
    ...vars,
  };
}

/**
 * Wire Lenis to ScrollTrigger. Call once from MainPage before child
 * useLayoutEffects create their ScrollTriggers.
 */
function applyDark7V5ScrollerProxy(lenis) {
  if (!DARK7_V5_SCROLLER) return;

  // Lenis always transforms documentElement — "fixed" pins shift downstream triggers.
  const pinType = lenis ? "transform" : DARK7_V5_SCROLLER.style.transform ? "transform" : "fixed";

  ScrollTrigger.scrollerProxy(DARK7_V5_SCROLLER, {
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

export function initDark7V5LenisScroll(lenis) {
  if (typeof window === "undefined" || !DARK7_V5_SCROLLER) return;

  lenisInstance = lenis;

  applyDark7V5ScrollerProxy(lenis);

  const onRefreshInit = () => applyDark7V5ScrollerProxy(lenis);
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  removeRefreshInitListener = () => {
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
  };

  ScrollTrigger.defaults({
    scroller: DARK7_V5_SCROLLER,
    invalidateOnRefresh: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  requestAnimationFrame(() => {
    applyDark7V5ScrollerProxy(lenis);
    refreshDark7V5ScrollTriggers(true);
  });
}

export function destroyDark7V5LenisScroll(lenis) {
  lenisInstance = null;
  removeRefreshInitListener?.();
  removeRefreshInitListener = null;

  if (typeof window === "undefined" || !DARK7_V5_SCROLLER) return;

  ScrollTrigger.scrollerProxy(DARK7_V5_SCROLLER, {});
  ScrollTrigger.defaults({
    scroller: undefined,
    invalidateOnRefresh: false,
  });
}

export function refreshDark7V5ScrollTriggers(hard = true) {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh(hard);
  ScrollTrigger.sort();
}

export const DARK7_V5_SCROLL_LAYOUT_READY_EVENT = "dark7-v5-scroll-layout-ready";

let scrollLayoutReady = false;

/** Hero morph triggers registered — downstream pins can measure layout. */
export function notifyScrollLayoutReady() {
  if (typeof window === "undefined") return;

  scrollLayoutReady = true;
  refreshDark7V5ScrollTriggers(true);
  window.dispatchEvent(new Event(DARK7_V5_SCROLL_LAYOUT_READY_EVENT));

  requestAnimationFrame(() => refreshDark7V5ScrollTriggers(true));
  window.setTimeout(() => refreshDark7V5ScrollTriggers(true), 120);
}

/**
 * Run callback after hero/portfolio ScrollTriggers exist and layout is stable.
 * Pinned sections (DeepJudge, Airvoir, etc.) should register here — not before.
 */
export function subscribeAfterScrollLayout(callback) {
  if (typeof window === "undefined") return () => {};

  let cancelled = false;

  const run = () => {
    if (cancelled) return;
    refreshDark7V5ScrollTriggers(true);
    callback();
    requestAnimationFrame(() => {
      if (!cancelled) refreshDark7V5ScrollTriggers(true);
    });
  };

  if (scrollLayoutReady) {
    requestAnimationFrame(run);
    return () => {
      cancelled = true;
    };
  }

  const onReady = () => {
    window.removeEventListener(DARK7_V5_SCROLL_LAYOUT_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
    run();
  };

  window.addEventListener(DARK7_V5_SCROLL_LAYOUT_READY_EVENT, onReady);
  const fallbackTimer = window.setTimeout(onReady, 2000);

  return () => {
    cancelled = true;
    window.removeEventListener(DARK7_V5_SCROLL_LAYOUT_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
  };
}

/** @deprecated Use subscribeAfterScrollLayout — kept for existing imports. */
export function subscribeAfterHeroPin(callback) {
  return subscribeAfterScrollLayout(callback);
}

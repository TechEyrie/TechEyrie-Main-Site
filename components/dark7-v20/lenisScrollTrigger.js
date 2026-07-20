import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Lenis + ScrollTrigger scroller for all dark7-v20 sections. */
export const DARK7_V20_SCROLLER =
  typeof document !== "undefined" ? document.documentElement : null;

let lenisInstance = null;
let removeRefreshInitListener = null;
let layoutSettled = false;

export function getDark7V20ScrollTop() {
  if (lenisInstance) return lenisInstance.scroll;
  if (DARK7_V20_SCROLLER) {
    return ScrollTrigger.getScrollFunc(DARK7_V20_SCROLLER)?.() ?? window.scrollY;
  }
  return window.scrollY;
}

/** True when any pinned ScrollTrigger is currently active. */
export function hasActiveDark7V20Pin() {
  return ScrollTrigger.getAll().some(
    (st) => st.isActive && Boolean(st.vars?.pin || st.pin),
  );
}

/** Merge dark7-v20 scroll defaults into a ScrollTrigger config object. */
export function Dark7V20ScrollTrigger(vars = {}) {
  return {
    scroller: DARK7_V20_SCROLLER,
    invalidateOnRefresh: true,
    ...vars,
  };
}

/**
 * Wire Lenis to ScrollTrigger. Call once from MainPage before child
 * useLayoutEffects create their ScrollTriggers.
 */
function applyDark7V20ScrollerProxy(lenis) {
  if (!DARK7_V20_SCROLLER) return;

  // Lenis always transforms documentElement — "fixed" pins shift downstream triggers.
  const pinType = lenis ? "transform" : DARK7_V20_SCROLLER.style.transform ? "transform" : "fixed";

  ScrollTrigger.scrollerProxy(DARK7_V20_SCROLLER, {
    scrollTop(value) {
      if (arguments.length) {
        const next = Number(value);
        if (!Number.isFinite(next)) return lenis.scroll;
        // No-op sets: avoid yanking Lenis while it settles mid-pin.
        if (Math.abs(next - lenis.scroll) < 0.75) return lenis.scroll;
        // During coast/settle, ignore external jumps — they unpin Airvoir.
        if (lenis.isScrolling) return lenis.scroll;
        lenis.scrollTo(next, { immediate: true, force: true });
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

export function initDark7V20LenisScroll(lenis) {
  if (typeof window === "undefined" || !DARK7_V20_SCROLLER) return;

  lenisInstance = lenis;
  layoutSettled = false;

  applyDark7V20ScrollerProxy(lenis);

  const onRefreshInit = () => applyDark7V20ScrollerProxy(lenis);
  ScrollTrigger.addEventListener("refreshInit", onRefreshInit);
  removeRefreshInitListener = () => {
    ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
  };

  ScrollTrigger.defaults({
    scroller: DARK7_V20_SCROLLER,
    invalidateOnRefresh: true,
  });

  // Avoid observer-driven refreshes remapping pins while the user pauses mid-section.
  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  lenis.on("scroll", () => {
    ScrollTrigger.update();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dark7-v20-scroll", { detail: lenis.scroll }),
      );
    }
  });

  requestAnimationFrame(() => {
    applyDark7V20ScrollerProxy(lenis);
    refreshDark7V20ScrollTriggers(true);
  });
}

export function destroyDark7V20LenisScroll(lenis) {
  lenisInstance = null;
  layoutSettled = false;
  removeRefreshInitListener?.();
  removeRefreshInitListener = null;

  if (typeof window === "undefined" || !DARK7_V20_SCROLLER) return;

  ScrollTrigger.scrollerProxy(DARK7_V20_SCROLLER, {});
  ScrollTrigger.defaults({
    scroller: undefined,
    invalidateOnRefresh: false,
  });
  ScrollTrigger.config({
    autoRefreshEvents: "resize,visibilitychange,DOMContentLoaded,load",
  });
}

/**
 * Refresh ScrollTriggers. When a pin is active (user paused mid-Airvoir etc.),
 * skip hard refreshes that remape start/end and kick Lenis out of the pin range.
 */
export function refreshDark7V20ScrollTriggers(hard = true) {
  if (typeof window === "undefined") return;

  if (hard && layoutSettled && hasActiveDark7V20Pin()) {
    ScrollTrigger.update();
    return;
  }

  ScrollTrigger.refresh(hard);
  ScrollTrigger.sort();
}

/** Call after late layout timers so later hard refreshes stay pin-safe. */
export function markDark7V20ScrollLayoutSettled() {
  layoutSettled = true;
}

export const DARK7_V20_SCROLL_LAYOUT_READY_EVENT = "dark7-v20-scroll-layout-ready";

let scrollLayoutReady = false;

/** Hero morph triggers registered — downstream pins can measure layout. */
export function notifyScrollLayoutReady() {
  if (typeof window === "undefined") return;

  scrollLayoutReady = true;
  refreshDark7V20ScrollTriggers(true);
  window.dispatchEvent(new Event(DARK7_V20_SCROLL_LAYOUT_READY_EVENT));

  requestAnimationFrame(() => refreshDark7V20ScrollTriggers(true));
  window.setTimeout(() => refreshDark7V20ScrollTriggers(true), 120);
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
    // Create first, then refresh — pre-refresh while killing pins mid-rebuild is unsafe.
    callback();
    requestAnimationFrame(() => {
      if (!cancelled) refreshDark7V20ScrollTriggers(true);
    });
  };

  if (scrollLayoutReady) {
    requestAnimationFrame(run);
    return () => {
      cancelled = true;
    };
  }

  const onReady = () => {
    window.removeEventListener(DARK7_V20_SCROLL_LAYOUT_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
    run();
  };

  window.addEventListener(DARK7_V20_SCROLL_LAYOUT_READY_EVENT, onReady);
  const fallbackTimer = window.setTimeout(onReady, 2000);

  return () => {
    cancelled = true;
    window.removeEventListener(DARK7_V20_SCROLL_LAYOUT_READY_EVENT, onReady);
    window.clearTimeout(fallbackTimer);
  };
}

/** @deprecated Use subscribeAfterScrollLayout — kept for existing imports. */
export function subscribeAfterHeroPin(callback) {
  return subscribeAfterScrollLayout(callback);
}

/** ScrollTrigger id used by embedded eagle/hero fly-through pins. */
export const DARK7_V20_HERO_PIN_ID = "dark7-v20-hero-pin";

/** @deprecated Use notifyScrollLayoutReady — kept for EagleScrollScene imports. */
export function notifyHeroPinReady() {
  return notifyScrollLayoutReady();
}

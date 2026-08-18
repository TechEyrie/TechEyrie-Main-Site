const ALLOW_SELECTOR = ".quote-drawer-panel, .quote-phone-menu";

function isAllowedTarget(target) {
  const el = target instanceof Element ? target : target?.parentElement;
  return Boolean(el?.closest?.(ALLOW_SELECTOR));
}

function getPageLenis() {
  return typeof window !== "undefined" ? window.__techeyrieLenis : null;
}

export function registerPageLenis(lenis) {
  if (typeof window === "undefined") return () => {};
  window.__techeyrieLenis = lenis;
  return () => {
    if (window.__techeyrieLenis === lenis) window.__techeyrieLenis = null;
  };
}

export function lockBackgroundScroll() {
  const html = document.documentElement;
  const body = document.body;
  const lenis = getPageLenis();
  lenis?.stop?.();

  const prevHtmlOverflow = html.style.overflow;
  const prevBodyOverflow = body.style.overflow;
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";
  html.classList.add("quote-scroll-locked");

  const blockPageScroll = (event) => {
    if (isAllowedTarget(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  };

  const opts = { capture: true, passive: false };
  window.addEventListener("wheel", blockPageScroll, opts);
  window.addEventListener("touchmove", blockPageScroll, opts);

  return () => {
    window.removeEventListener("wheel", blockPageScroll, opts);
    window.removeEventListener("touchmove", blockPageScroll, opts);
    html.style.overflow = prevHtmlOverflow;
    body.style.overflow = prevBodyOverflow;
    html.classList.remove("quote-scroll-locked");
    getPageLenis()?.start?.();
  };
}

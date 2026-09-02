"use client";

import { useEffect, useRef, useState } from "react";
import { computeHeroScrollProgress } from "./cameraPose.js";
import {
  BACKGROUND_PRESETS,
  HERO_PIN_HEIGHT_VH,
} from "./constants.js";
import { initNativeEagleScene } from "./initNativeEagleScene.js";
import "./NativeEagleHero.css";

/**
 * Phase 8 — remount-safe hero.
 * Phase 9 — eagle-project-2 compare options (lock progress, eagle2Clear bg, hide mountains).
 */
export default function NativeEagleHero({
  pinHeightVh = HERO_PIN_HEIGHT_VH,
  /** Fill parent bounds (compare / embeds) — no sticky 100vh canvas. */
  fillParent = false,
  showHud = true,
  hudTitle = "Native Eagle — Phase 9",
  hudSubtitle = "Reference: eagle-project-2 · remount-safe",
  onReady = null,
  onError = null,
  reducedMotionFallback = true,
  /**
   * When set, scroll does not drive the timeline — progress is locked
   * (eagle-project-2 locks HERO_PROGRESS = 0).
   */
  lockProgress = null,
  /** Background preset key or hex number */
  background = "noomo",
  /** Match eagle-project-2 (mountains hidden). */
  hideMountains = false,
  /** Hide floor reflector (eagle2 compare default via init). */
  hideReflector = false,
  /** Use dispersion glass shaders — reference path. */
  glassDispersion = false,
  /** Optional GLB/texture URL overrides (eagle-extract test). */
  assetPaths = null,
  /** Glass color triplet { color, peaksColor, fringeColor } */
  glassColors = null,
}) {
  const pinRef = useRef(null);
  const canvasHostRef = useRef(null);
  const sceneRef = useRef(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  const lockProgressRef = useRef(lockProgress);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [preferReducedMotion, setPreferReducedMotion] = useState(false);

  onReadyRef.current = onReady;
  onErrorRef.current = onError;
  lockProgressRef.current = lockProgress;

  const backgroundHex =
    typeof background === "number"
      ? background
      : (BACKGROUND_PRESETS[background] ?? BACKGROUND_PRESETS.noomo);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setPreferReducedMotion(Boolean(mq.matches));
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return undefined;
    if (preferReducedMotion && reducedMotionFallback) {
      setStatus("reduced-motion");
      return undefined;
    }

    const ac = new AbortController();
    let cancelled = false;
    setStatus("loading");
    setErrorMessage(null);

    initNativeEagleScene(host, {
      signal: ac.signal,
      backgroundHex,
      hideMountains,
      hideReflector,
      initialProgress: typeof lockProgress === "number" ? lockProgress : 0,
      variant: hideMountains ? "eagle-project-2" : "default",
      assetPaths,
      glassColors,
      glassDispersion,
    })
      .then((api) => {
        if (cancelled || ac.signal.aborted) {
          api?.dispose();
          return;
        }
        if (!api || api.getState?.()?.loaded !== true) {
          if (cancelled || ac.signal.aborted) return;
          const message = api?.getState?.()?.error || "Scene init returned null";
          setStatus("error");
          setErrorMessage(message);
          onErrorRef.current?.(new Error(message));
          api?.dispose();
          return;
        }
        sceneRef.current = api;
        setStatus("ready");
        onReadyRef.current?.(api);
        if (typeof lockProgressRef.current === "number") {
          api.setScrollProgress(lockProgressRef.current);
        } else {
          api.setScrollProgress(computeHeroScrollProgress(pinRef.current));
        }
      })
      .catch((err) => {
        if (cancelled || ac.signal.aborted) return;
        const message = String(err?.message || err);
        setStatus("error");
        setErrorMessage(message);
        onErrorRef.current?.(err);
      });

    function onScroll() {
      if (typeof lockProgressRef.current === "number") {
        sceneRef.current?.setScrollProgress(lockProgressRef.current);
        return;
      }
      const progress = computeHeroScrollProgress(pinRef.current);
      sceneRef.current?.setScrollProgress(progress);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelled = true;
      ac.abort();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      const api = sceneRef.current;
      sceneRef.current = null;
      api?.dispose();
    };
  }, [
    preferReducedMotion,
    reducedMotionFallback,
    backgroundHex,
    hideMountains,
    hideReflector,
    lockProgress,
    assetPaths,
    glassColors,
    glassDispersion,
  ]);

  useEffect(() => {
    if (!glassColors || !sceneRef.current?.setGlassColors) return undefined;
    sceneRef.current.setGlassColors(glassColors);
    return undefined;
  }, [glassColors]);

  // Live lock updates after ready
  useEffect(() => {
    if (typeof lockProgress !== "number") return undefined;
    sceneRef.current?.setScrollProgress(lockProgress);
    return undefined;
  }, [lockProgress]);

  return (
    <div
      className={`native-eagle-page${fillParent ? " native-eagle-page--fill" : ""}`}
      data-status={status}
      data-fill-parent={fillParent ? "true" : "false"}
      data-lock-progress={typeof lockProgress === "number" ? String(lockProgress) : "scroll"}
      data-hide-mountains={hideMountains ? "true" : "false"}
    >
      <section
        ref={pinRef}
        className="native-eagle-hero-pin"
        style={fillParent ? undefined : { height: `${pinHeightVh}vh` }}
      >
        <div ref={canvasHostRef} className="native-eagle-canvas-host" aria-hidden="true" />

        {status === "loading" ? (
          <div className="native-eagle-status" role="status">
            Loading native eagle…
          </div>
        ) : null}

        {status === "error" ? (
          <div className="native-eagle-status native-eagle-status--error" role="alert">
            Failed to init: {errorMessage}
          </div>
        ) : null}

        {status === "reduced-motion" ? (
          <div className="native-eagle-status" role="status">
            Reduced motion — WebGL hero paused
          </div>
        ) : null}

        {showHud ? (
          <div className="native-eagle-hud">
            <p>{hudTitle}</p>
            <p>{hudSubtitle}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NativeEagleHero from "../native-eagle/NativeEagleHero.js";
import {
  deriveTealShades,
  glassColorsFromGreenPreset,
  GREEN_SHADE_PRESETS,
  randomizeGreenShadeFamily,
  REFERENCE_GLASS_COLORS,
} from "../native-eagle/glassColorSystem.js";
import { sampleCanvasGlassMetrics } from "./compareParity.js";
import {
  EAGLE2_REFERENCE_SRC,
  EAGLE_EXTRACT_ASSET_PATHS,
  EAGLE_EXTRACT_COLORS_URL,
  EAGLE_EXTRACT_MANIFEST_URL,
  EAGLE_EXTRACT_VALIDATION_URL,
} from "./paths.js";
import "./EagleExtractTest2.css";

async function fetchByteLength(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  return buf.byteLength;
}

function ColorSwatch({ label, hex }) {
  return (
    <div className="eagle-extract-test2__swatch">
      <span
        className="eagle-extract-test2__swatch-chip"
        style={{ background: hex }}
        title={hex}
      />
      <span className="eagle-extract-test2__swatch-label">{label}</span>
      <code className="eagle-extract-test2__swatch-hex">{hex}</code>
    </div>
  );
}

export default function EagleExtractTest2Client() {
  const sceneApiRef = useRef(null);
  const nativeStageRef = useRef(null);
  const [phase, setPhase] = useState("loading");
  const [manifest, setManifest] = useState(null);
  const [validation, setValidation] = useState(null);
  const [colorsMeta, setColorsMeta] = useState(null);
  const [assetChecks, setAssetChecks] = useState([]);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneError, setSceneError] = useState(null);
  const [debug, setDebug] = useState(null);
  const [glassColors, setGlassColors] = useState(REFERENCE_GLASS_COLORS);
  const [randomSeed, setRandomSeed] = useState(String(Date.now()));
  const [lastRandomize, setLastRandomize] = useState(null);
  const [heroKey, setHeroKey] = useState(0);
  const [split, setSplit] = useState(50);
  const [glassDispersion, setGlassDispersion] = useState(true);
  const [nativeMetrics, setNativeMetrics] = useState(null);

  const stageColumns = useMemo(
    () => ({ gridTemplateColumns: `${split}% ${100 - split}%` }),
    [split],
  );

  const runValidation = useCallback(async () => {
    setPhase("loading");
    setSceneReady(false);
    setSceneError(null);

    const [manifestRes, validationRes, colorsRes] = await Promise.all([
      fetch(EAGLE_EXTRACT_MANIFEST_URL, { cache: "no-store" }),
      fetch(EAGLE_EXTRACT_VALIDATION_URL, { cache: "no-store" }),
      fetch(EAGLE_EXTRACT_COLORS_URL, { cache: "no-store" }),
    ]);

    if (!manifestRes.ok) throw new Error("MANIFEST.json not found — run npm run extract:eagle");
    if (!validationRes.ok) throw new Error("VALIDATION.json not found");
    if (!colorsRes.ok) throw new Error("glass/colors.json not found");

    const manifestJson = await manifestRes.json();
    const validationJson = await validationRes.json();
    const colorsJson = await colorsRes.json();

    setManifest(manifestJson);
    setValidation(validationJson);
    setColorsMeta(colorsJson);

    if (colorsJson?.patched) {
      setGlassColors(colorsJson.patched);
    }

    const assets = manifestJson.assets ?? [];
    const checks = await Promise.all(
      assets.map(async (entry) => {
        const publicUrl = entry.dest.startsWith("assets/")
          ? `/eagle-extract/${entry.dest}`
          : null;
        if (!publicUrl) {
          return { name: entry.dest, ok: true, skipped: true, note: "not served publicly" };
        }
        try {
          const bytes = await fetchByteLength(publicUrl);
          const ok = bytes === entry.bytes;
          return {
            name: entry.dest,
            url: publicUrl,
            expectedBytes: entry.bytes,
            actualBytes: bytes,
            sha256: entry.sha256,
            ok,
          };
        } catch (err) {
          return {
            name: entry.dest,
            url: publicUrl,
            ok: false,
            error: String(err?.message || err),
          };
        }
      }),
    );

    setAssetChecks(checks);
    const browserAssetsOk = checks.filter((c) => !c.skipped).every((c) => c.ok);
    const extractionOk = validationJson.pass === true;
    const colorsOk =
      colorsJson?.patched?.color === "#12c48a" &&
      colorsJson?.patched?.peaksColor === "#6ee7b7";

    setPhase(extractionOk && browserAssetsOk && colorsOk ? "pass" : "fail");
  }, []);

  useEffect(() => {
    runValidation().catch((err) => {
      setPhase("fail");
      setSceneError(String(err?.message || err));
    });
  }, [runValidation]);

  useEffect(() => {
    if (!sceneReady) return undefined;
    const id = window.setInterval(() => {
      const d = window.__NATIVE_EAGLE_DEBUG__;
      if (d?.loaded) setDebug(d);

      const canvas = nativeStageRef.current?.querySelector("canvas");
      const metrics = sampleCanvasGlassMetrics(canvas);
      if (metrics) setNativeMetrics(metrics);
    }, 800);
    return () => window.clearInterval(id);
  }, [sceneReady, heroKey]);

  const handleRandomize = useCallback(() => {
    const seed = Number(randomSeed) || Date.now();
    const result = sceneApiRef.current?.randomizeGlassParameters?.(seed);
    if (result?.colors) {
      setGlassColors(result.colors);
      setLastRandomize(result);
    } else {
      setLastRandomize({ error: "Scene not ready" });
    }
  }, [randomSeed]);

  const handleResetReference = useCallback(() => {
    const ref = colorsMeta?.patched ?? REFERENCE_GLASS_COLORS;
    const result = sceneApiRef.current?.resetGlassToReference?.();
    setGlassColors(result?.colors ?? ref);
    setLastRandomize(null);
  }, [colorsMeta]);

  const handleDeriveShades = useCallback(() => {
    const derived = deriveTealShades(glassColors.color);
    sceneApiRef.current?.setGlassColors?.(derived);
    setGlassColors(derived);
  }, [glassColors.color]);

  const applyGlassColors = useCallback((next, meta = null) => {
    sceneApiRef.current?.setGlassColors?.(next);
    setGlassColors(next);
    setLastRandomize(meta);
  }, []);

  const handleGreenPreset = useCallback(
    (preset) => {
      applyGlassColors(glassColorsFromGreenPreset(preset), {
        preset: preset.id,
        seed: null,
        nodesTouched: 0,
      });
    },
    [applyGlassColors],
  );

  const handleRandomizeGreenShades = useCallback(() => {
    const seed = Number(randomSeed) || Date.now();
    const next = randomizeGreenShadeFamily(seed);
    applyGlassColors(next, { seed, nodesTouched: 0, mode: "green-shades" });
    setRandomSeed(String(seed + 1));
  }, [applyGlassColors, randomSeed]);

  const remountHero = useCallback(() => {
    sceneApiRef.current?.dispose?.();
    sceneApiRef.current = null;
    setSceneReady(false);
    setNativeMetrics(null);
    setHeroKey((k) => k + 1);
  }, []);

  const toggleDispersion = useCallback(() => {
    setGlassDispersion((v) => !v);
    remountHero();
  }, [remountHero]);

  return (
    <div className="eagle-extract-test2" data-phase={phase}>
      <header className="eagle-extract-test2__header">
        <div>
          <h1>Eagle Extract — Parity Refinement (test2)</h1>
          <p>
            Full-width side-by-side compare vs reference embed. Dispersion glass + dev timeline
            hero uniforms (no override clamp).
          </p>
          <p className="eagle-extract-test2__nav">
            Baseline sandbox: <a href="/eagle-extract-test1">/eagle-extract-test1</a>
          </p>
        </div>
        <button type="button" onClick={runValidation} className="eagle-extract-test2__btn">
          Re-run validation
        </button>
      </header>

      <section className="eagle-extract-test2__panel eagle-extract-test2__panel--parity">
        <h2>Parity compare — reference vs native</h2>
        <p className="eagle-extract-test2__hint">
          Reference loads <code>{EAGLE2_REFERENCE_SRC}</code> with darken compositing on a
          white stage. Native uses eagle2Clear + darken (same path as phase 10).
        </p>

        <div className="eagle-extract-test2__parity-toolbar">
          <label className="eagle-extract-test2__slider-label">
            Split {Math.round(split)}%
            <input
              type="range"
              min={5}
              max={95}
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label="Compare split"
            />
          </label>
          <label className="eagle-extract-test2__toggle">
            <input
              type="checkbox"
              checked={glassDispersion}
              onChange={toggleDispersion}
            />
            Dispersion glass (reference path)
          </label>
          <button type="button" className="eagle-extract-test2__btn" onClick={remountHero}>
            Remount WebGL
          </button>
        </div>

        <div className="eagle-extract-test2__compare-wrap">
          <div
            className="eagle-extract-test2__compare-stage"
            style={stageColumns}
            data-split={split}
            data-dispersion={glassDispersion ? "1" : "0"}
          >
            <div className="eagle-extract-test2__compare-pane eagle-extract-test2__compare-pane--ref">
              <iframe
                title="eagle-project-2 reference embed"
                src={EAGLE2_REFERENCE_SRC}
                className="eagle-extract-test2__ref-frame"
                allow="autoplay"
              />
              <span className="eagle-extract-test2__badge">Reference</span>
            </div>
            <div className="eagle-extract-test2__compare-pane eagle-extract-test2__compare-pane--native">
              <div ref={nativeStageRef} className="eagle-extract-test2__stage">
                <NativeEagleHero
                  key={heroKey}
                  fillParent
                  showHud={false}
                  lockProgress={0}
                  background="eagle2Clear"
                  hideMountains
                  hideReflector
                  glassDispersion={glassDispersion}
                  assetPaths={EAGLE_EXTRACT_ASSET_PATHS}
                  glassColors={glassColors}
                  onReady={(api) => {
                    sceneApiRef.current = api;
                    setSceneReady(true);
                    setSceneError(null);
                    api.setGlassColors?.(glassColors);
                  }}
                  onError={(err) => {
                    sceneApiRef.current = null;
                    setSceneReady(false);
                    setSceneError(String(err?.message || err));
                  }}
                />
              </div>
              <span className="eagle-extract-test2__badge eagle-extract-test2__badge--native">
                Native {glassDispersion ? "· dispersion" : "· simple"}
              </span>
            </div>
            <div
              className="eagle-extract-test2__compare-divider"
              style={{ left: `${split}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <ul className="eagle-extract-test2__metrics">
          <li>
            Teal pixels
            <strong>{nativeMetrics ? `${nativeMetrics.tealPct}%` : "—"}</strong>
          </li>
          <li>
            Bright (G&gt;120)
            <strong>{nativeMetrics ? `${nativeMetrics.brightPct}%` : "—"}</strong>
          </li>
          <li>
            maxG
            <strong>{nativeMetrics?.maxG ?? "—"}</strong>
          </li>
          <li>
            avg RGB
            <strong>
              {nativeMetrics?.avgRGB?.join(", ") ?? "—"}
            </strong>
          </li>
        </ul>

        <ul className="eagle-extract-test2__stats">
          <li>
            Scene:{" "}
            <strong data-ok={sceneReady ? "1" : "0"}>
              {sceneError ? `error: ${sceneError}` : sceneReady ? "ready" : "loading"}
            </strong>
          </li>
          {debug ? (
            <>
              <li>
                Active colors:{" "}
                {debug.glassColorsActive
                  ? `${debug.glassColorsActive.color} / ${debug.glassColorsActive.peaksColor} / ${debug.glassColorsActive.fringeColor}`
                  : "—"}
              </li>
              <li>Shader errors: {debug.shaderErrors?.length ?? 0}</li>
              <li>
                colorBoost / colorFactor / peaksFactor:{" "}
                {debug.getGlassMaterialSample
                  ? `${debug.getGlassMaterialSample()?.colorBoost ?? "—"} / ${debug.getGlassMaterialSample()?.colorFactor ?? "—"} / ${debug.getGlassMaterialSample()?.peaksFactor ?? "—"}`
                  : `${debug.glassColorFactor ?? "—"}`}{" "}
                (timeline {debug.glassTimelineBoundCount}/{debug.glassTimelineTotalBindings})
              </li>
              <li>
                maxColorValue / envReflection / envRefraction:{" "}
                {debug.getGlassMaterialSample
                  ? `${debug.getGlassMaterialSample()?.maxColorValue ?? "—"} / ${debug.getGlassMaterialSample()?.envReflection ?? "—"} / ${debug.getGlassMaterialSample()?.envRefraction ?? "—"}`
                  : "—"}
              </li>
              <li>
                Overrides active: {String(debug.glassOverridesActive ?? "—")}
              </li>
              <li>
                Reflector visible: {String(debug.reflectorVisible ?? "—")} · mountains:{" "}
                {String(debug.mountainsVisible ?? "—")}
              </li>
              <li>
                Wing NDC:{" "}
                {debug.getWingMeshNdc?.()?.ndc?.map((v) => v.toFixed(2)).join(", ") ?? "—"}
              </li>
            </>
          ) : null}
        </ul>
      </section>

      <section className="eagle-extract-test2__panel eagle-extract-test2__panel--colors">
        <h2>Glass color scheme — green shades</h2>
        <p className="eagle-extract-test2__hint">
          Pick a green family or randomize a cohesive base / peaks / fringe triplet. Full
          parameter randomize still matches the bundle dev button.
        </p>
        <div className="eagle-extract-test2__swatches">
          <ColorSwatch label="Base (Glass.color)" hex={glassColors.color} />
          <ColorSwatch label="Peaks (Glass.peaksColor)" hex={glassColors.peaksColor} />
          <ColorSwatch label="Fringe (Glass.fringeColor)" hex={glassColors.fringeColor} />
        </div>
        <div className="eagle-extract-test2__shade-presets" role="group" aria-label="Green shade presets">
          {GREEN_SHADE_PRESETS.map((preset) => {
            const active =
              glassColors.color.toLowerCase() === preset.base.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                className="eagle-extract-test2__shade-chip"
                data-active={active ? "1" : "0"}
                style={{ "--shade": preset.base }}
                onClick={() => handleGreenPreset(preset)}
                disabled={!sceneReady}
                title={preset.base}
              >
                <span className="eagle-extract-test2__shade-chip-swatch" />
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="eagle-extract-test2__color-actions">
          <label className="eagle-extract-test2__seed">
            PRNG seed
            <input
              type="text"
              value={randomSeed}
              onChange={(e) => setRandomSeed(e.target.value)}
              className="eagle-extract-test2__seed-input"
            />
          </label>
          <button
            type="button"
            className="eagle-extract-test2__btn eagle-extract-test2__btn--primary"
            onClick={handleRandomizeGreenShades}
            disabled={!sceneReady}
          >
            Randomize green shades
          </button>
          <button
            type="button"
            className="eagle-extract-test2__btn"
            onClick={handleRandomize}
            disabled={!sceneReady}
          >
            Randomize all glass params
          </button>
          <button
            type="button"
            className="eagle-extract-test2__btn"
            onClick={handleResetReference}
            disabled={!sceneReady}
          >
            Reset to reference teal
          </button>
          <button
            type="button"
            className="eagle-extract-test2__btn"
            onClick={handleDeriveShades}
            disabled={!sceneReady}
          >
            Derive peaks/fringe from base
          </button>
        </div>
        {lastRandomize ? (
          <p className="eagle-extract-test2__random-meta">
            Last —{" "}
            {lastRandomize.preset
              ? `preset: ${lastRandomize.preset}`
              : lastRandomize.mode
                ? `mode: ${lastRandomize.mode}`
                : "params"}
            {lastRandomize.seed != null ? ` · seed: ${lastRandomize.seed}` : ""}
            {lastRandomize.nodesTouched != null
              ? ` · nodes: ${lastRandomize.nodesTouched}`
              : ""}
          </p>
        ) : null}
      </section>

      <section className="eagle-extract-test2__panel">
        <h2>Extraction manifest</h2>
        <ul className="eagle-extract-test2__stats">
          <li>
            CLI validation:{" "}
            <strong data-ok={validation?.pass ? "1" : "0"}>
              {validation?.pass ? "PASS" : validation ? "FAIL" : "…"}
            </strong>
          </li>
          <li>
            Bundle SHA-256: <code>{manifest?.bundleSha256?.slice(0, 16) ?? "…"}…</code>
          </li>
          <li>Shaders extracted: {manifest?.shaders?.length ?? "…"}</li>
        </ul>
      </section>

      <section className="eagle-extract-test2__panel">
        <h2>Browser asset fetch (byte match)</h2>
        <ul className="eagle-extract-test2__checks">
          {assetChecks.map((c) => (
            <li key={c.name} data-ok={c.ok ? "1" : "0"}>
              {c.ok ? "✓" : "✗"} {c.name}
              {c.actualBytes != null ? ` — ${c.actualBytes} bytes` : ""}
              {c.error ? ` (${c.error})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <footer className="eagle-extract-test2__footer" data-overall={phase}>
        Overall:{" "}
        {phase === "pass" ? "EXTRACTION VALIDATED ✓" : phase === "fail" ? "FAILED ✗" : "Running…"}
      </footer>
    </div>
  );
}

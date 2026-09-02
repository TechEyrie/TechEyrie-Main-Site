"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NativeEagleHero from "../native-eagle/NativeEagleHero.js";
import {
  deriveTealShades,
  REFERENCE_GLASS_COLORS,
} from "../native-eagle/glassColorSystem.js";
import {
  EAGLE_EXTRACT_ASSET_PATHS,
  EAGLE_EXTRACT_COLORS_URL,
  EAGLE_EXTRACT_MANIFEST_URL,
  EAGLE_EXTRACT_VALIDATION_URL,
} from "./paths.js";
import "./EagleExtractTest1.css";

async function fetchByteLength(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  return buf.byteLength;
}

function ColorSwatch({ label, hex }) {
  return (
    <div className="eagle-extract-test1__swatch">
      <span
        className="eagle-extract-test1__swatch-chip"
        style={{ background: hex }}
        title={hex}
      />
      <span className="eagle-extract-test1__swatch-label">{label}</span>
      <code className="eagle-extract-test1__swatch-hex">{hex}</code>
    </div>
  );
}

export default function EagleExtractTest1Client() {
  const sceneApiRef = useRef(null);
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
    }, 500);
    return () => window.clearInterval(id);
  }, [sceneReady]);

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

  return (
    <div className="eagle-extract-test1" data-phase={phase}>
      <header className="eagle-extract-test1__header">
        <div>
          <h1>Eagle Extract — Parity Sandbox (test1)</h1>
          <p>
            Reference teal scheme + Noomo-style glass randomization. Same cooking as{" "}
            <code>eagle-project-2</code>.
          </p>
        </div>
        <button type="button" onClick={runValidation} className="eagle-extract-test1__btn">
          Re-run validation
        </button>
      </header>

      <section className="eagle-extract-test1__panel eagle-extract-test1__panel--colors">
        <h2>Glass color scheme (reference teal)</h2>
        <p className="eagle-extract-test1__hint">
          Default hero uses patched triplet from <code>colors.json</code>. Randomize matches the
          bundle dev button — green-teal HSL per channel + seeded numeric uniforms on Glass_* nodes.
        </p>
        <div className="eagle-extract-test1__swatches">
          <ColorSwatch label="Base (Glass.color)" hex={glassColors.color} />
          <ColorSwatch label="Peaks (Glass.peaksColor)" hex={glassColors.peaksColor} />
          <ColorSwatch label="Fringe (Glass.fringeColor)" hex={glassColors.fringeColor} />
        </div>
        <div className="eagle-extract-test1__color-actions">
          <label className="eagle-extract-test1__seed">
            PRNG seed
            <input
              type="text"
              value={randomSeed}
              onChange={(e) => setRandomSeed(e.target.value)}
              className="eagle-extract-test1__seed-input"
            />
          </label>
          <button
            type="button"
            className="eagle-extract-test1__btn eagle-extract-test1__btn--primary"
            onClick={handleRandomize}
            disabled={!sceneReady}
          >
            Randomize glass parameters
          </button>
          <button
            type="button"
            className="eagle-extract-test1__btn"
            onClick={handleResetReference}
            disabled={!sceneReady}
          >
            Reset to reference teal
          </button>
          <button
            type="button"
            className="eagle-extract-test1__btn"
            onClick={handleDeriveShades}
            disabled={!sceneReady}
          >
            Derive peaks/fringe from base
          </button>
        </div>
        {lastRandomize ? (
          <p className="eagle-extract-test1__random-meta">
            Last randomize — seed: {lastRandomize.seed ?? "—"}, nodes:{" "}
            {lastRandomize.nodesTouched ?? 0}
          </p>
        ) : null}
      </section>

      <section className="eagle-extract-test1__panel">
        <h2>1. Extraction manifest</h2>
        <ul className="eagle-extract-test1__stats">
          <li>
            CLI validation:{" "}
            <strong data-ok={validation?.pass ? "1" : "0"}>
              {validation?.pass ? "PASS" : validation ? "FAIL" : "…"}
            </strong>
          </li>
          <li>Bundle SHA-256: <code>{manifest?.bundleSha256?.slice(0, 16) ?? "…"}…</code></li>
          <li>Shaders extracted: {manifest?.shaders?.length ?? "…"}</li>
        </ul>
      </section>

      <section className="eagle-extract-test1__panel">
        <h2>2. Browser asset fetch (byte match)</h2>
        <ul className="eagle-extract-test1__checks">
          {assetChecks.map((c) => (
            <li key={c.name} data-ok={c.ok ? "1" : "0"}>
              {c.ok ? "✓" : "✗"} {c.name}
              {c.actualBytes != null ? ` — ${c.actualBytes} bytes` : ""}
              {c.error ? ` (${c.error})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="eagle-extract-test1__panel eagle-extract-test1__panel--compare">
        <h2>3. Live WebGL vs reference</h2>
        <div className="eagle-extract-test1__compare">
          <div className="eagle-extract-test1__compare-col">
            <h3>Reference (eagle-project-2 bundle)</h3>
            <iframe
              title="eagle-project-2 reference"
              src="/eagle-project-2/"
              className="eagle-extract-test1__ref-frame"
            />
          </div>
          <div className="eagle-extract-test1__compare-col">
            <h3>Native + extracted assets</h3>
            <div className="eagle-extract-test1__stage eagle-extract-test1__stage--compare">
              <NativeEagleHero
                key={heroKey}
                fillParent
                showHud={false}
                lockProgress={0}
                background="eagle2Clear"
                hideMountains
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
          </div>
        </div>
        <ul className="eagle-extract-test1__stats">
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
              <li>iorStart / envReflection: {debug.glassIorStart ?? "—"} / {debug.glassEnvReflection ?? "—"}</li>
              <li>Wing NDC: {debug.getWingMeshNdc?.()?.ndc?.map((v) => v.toFixed(2)).join(", ") ?? "—"}</li>
            </>
          ) : null}
        </ul>
        <button
          type="button"
          className="eagle-extract-test1__btn eagle-extract-test1__btn--ghost"
          onClick={() => {
            sceneApiRef.current?.dispose?.();
            sceneApiRef.current = null;
            setSceneReady(false);
            setHeroKey((k) => k + 1);
          }}
        >
          Remount WebGL
        </button>
      </section>

      <footer className="eagle-extract-test1__footer" data-overall={phase}>
        Overall: {phase === "pass" ? "EXTRACTION VALIDATED ✓" : phase === "fail" ? "FAILED ✗" : "Running…"}
      </footer>
    </div>
  );
}

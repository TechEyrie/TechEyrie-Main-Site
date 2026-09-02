"use client";

import { useCallback, useEffect, useState } from "react";
import NativeEagleHero from "../native-eagle/NativeEagleHero.js";
import {
  EAGLE_EXTRACT_ASSET_PATHS,
  EAGLE_EXTRACT_COLORS_URL,
  EAGLE_EXTRACT_MANIFEST_URL,
  EAGLE_EXTRACT_VALIDATION_URL,
} from "./paths.js";
import "./EagleExtractTest.css";

async function fetchByteLength(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  return buf.byteLength;
}

export default function EagleExtractTestClient() {
  const [phase, setPhase] = useState("loading");
  const [manifest, setManifest] = useState(null);
  const [validation, setValidation] = useState(null);
  const [colors, setColors] = useState(null);
  const [assetChecks, setAssetChecks] = useState([]);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneError, setSceneError] = useState(null);
  const [debug, setDebug] = useState(null);

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
    setColors(colorsJson);

    const assets = manifestJson.assets ?? [];
    const checks = await Promise.all(
      assets.map(async (entry) => {
        const url = `/eagle-extract/${entry.dest.replace(/^assets\//, "assets/")}`;
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

  const publicAssetChecks = assetChecks;

  return (
    <div className="eagle-extract-test" data-phase={phase}>
      <header className="eagle-extract-test__header">
        <div>
          <h1>Eagle Extract — Validation Test</h1>
          <p>
            Proves <code>eagle-extract/</code> assets load in Next.js and drive the native glass
            pipeline.
          </p>
        </div>
        <button type="button" onClick={runValidation} className="eagle-extract-test__btn">
          Re-run validation
        </button>
      </header>

      <section className="eagle-extract-test__panel">
        <h2>1. Extraction manifest</h2>
        <ul className="eagle-extract-test__stats">
          <li>
            CLI validation:{" "}
            <strong data-ok={validation?.pass ? "1" : "0"}>
              {validation?.pass ? "PASS" : validation ? "FAIL" : "…"}
            </strong>
          </li>
          <li>Bundle SHA-256: <code>{manifest?.bundleSha256?.slice(0, 16) ?? "…"}…</code></li>
          <li>Shaders extracted: {manifest?.shaders?.length ?? "…"}</li>
          <li>
            Teal colors:{" "}
            {colors?.patched
              ? `${colors.patched.color} / ${colors.patched.peaksColor} / ${colors.patched.fringeColor}`
              : "…"}
          </li>
        </ul>
      </section>

      <section className="eagle-extract-test__panel">
        <h2>2. Browser asset fetch (byte match)</h2>
        <ul className="eagle-extract-test__checks">
          {publicAssetChecks.map((c) => (
            <li key={c.name} data-ok={c.ok ? "1" : "0"}>
              {c.ok ? "✓" : "✗"} {c.name}
              {c.actualBytes != null ? ` — ${c.actualBytes} bytes` : ""}
              {c.error ? ` (${c.error})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="eagle-extract-test__panel">
        <h2>Why extraction can pass but the eagle looks black</h2>
        <ul className="eagle-extract-test__checks eagle-extract-test__checks--plain">
          <li>
            <strong>Extraction validates files</strong> — GLBs, HDR, textures, and bundle shaders are
            copied with matching byte hashes. It does not run the original Nuxt{" "}
            <code>CbdjwYMp.js</code> compositor in Next.js.
          </li>
          <li>
            <strong>The native viewer below</strong> —{" "}
            <code>components/native-eagle/</code> reimplements the dual-RT glass pipeline in Three.js.
            Shaders are synced from <code>eagle-extract/shaders/</code> on{" "}
            <code>npm run extract:eagle</code>.
          </li>
          <li>
            <strong>CSS compositing</strong> — like eagle-project-2, the canvas uses{" "}
            <code>mix-blend-mode: darken</code> on a white stage. Dark WebGL output reads as
            near-black unless glass emits bright teal.
          </li>
          <li>
            <strong>Teal comes from shaders + uniforms + scene refraction</strong> — patched colors (
            {colors?.patched?.color ?? "…"}), <code>colorsMap</code> LUT, HDR env, reflector sceneRT,
            and glass uniforms (<code>colorFactor</code>, <code>colorBoost</code>, etc.).
          </li>
        </ul>
      </section>

      <section className="eagle-extract-test__panel eagle-extract-test__panel--compare">
        <h2>3. Live WebGL vs reference</h2>
        <p className="eagle-extract-test__hint">
          Left: original eagle-project-2 bundle. Right: native port loading{" "}
          <code>/eagle-extract/assets/*</code> with bundle-exact shaders synced on{" "}
          <code>npm run extract:eagle</code>.
        </p>
        <div className="eagle-extract-test__compare">
          <div className="eagle-extract-test__compare-col">
            <h3>Reference (eagle-project-2 bundle)</h3>
            <iframe
              title="eagle-project-2 reference"
              src="/eagle-project-2/"
              className="eagle-extract-test__ref-frame"
            />
          </div>
          <div className="eagle-extract-test__compare-col">
            <h3>Native + extracted assets</h3>
            <div className="eagle-extract-test__stage eagle-extract-test__stage--compare">
              <NativeEagleHero
                fillParent
                showHud={false}
                lockProgress={0}
                background="eagle2Clear"
                hideMountains
                assetPaths={EAGLE_EXTRACT_ASSET_PATHS}
                onReady={() => {
                  setSceneReady(true);
                  setSceneError(null);
                }}
                onError={(err) => {
                  setSceneReady(false);
                  setSceneError(String(err?.message || err));
                }}
              />
            </div>
          </div>
        </div>
        <ul className="eagle-extract-test__stats">
          <li>
            Scene:{" "}
            <strong data-ok={sceneReady ? "1" : "0"}>
              {sceneError ? `error: ${sceneError}` : sceneReady ? "ready" : "loading"}
            </strong>
          </li>
          {debug ? (
            <>
              <li>Glass meshes: {debug.glassMeshCount}</li>
              <li>
                Glass shaders: {debug.glassBackShaderCount} back / {debug.glassFrontShaderCount} front
              </li>
              <li>Pipeline: {debug.glassPipelineActive ? "active" : "off"}</li>
              <li>Glass overrides: {debug.glassOverridesActive ? "extract boost" : "defaults"}</li>
              <li>
                colorFactor / colorBoost: {debug.glassColorFactor ?? "—"} (timeline bound:{" "}
                {debug.glassTimelineBoundCount}/{debug.glassTimelineTotalBindings})
              </li>
              <li>Background: {debug.backgroundHex}</li>
            </>
          ) : null}
        </ul>
      </section>

      <footer className="eagle-extract-test__footer" data-overall={phase}>
        Overall: {phase === "pass" ? "EXTRACTION VALIDATED ✓" : phase === "fail" ? "FAILED ✗" : "Running…"}
      </footer>
    </div>
  );
}

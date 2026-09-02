"use client";

import { useCallback, useMemo, useState } from "react";
import {
  EAGLE_PROJECT_2_HERO_PROGRESS,
  EAGLE_PROJECT_2_REFERENCE_SRC,
} from "./constants.js";
import NativeEagleHero from "./NativeEagleHero.js";
import "./NativeEagleCompareDev.css";

/**
 * Left: eagle-project-2 iframe (dark clear + CSS darken on white stage).
 * Right: native (eagle2Clear + CSS darken on white stage — same compositing path).
 */
export default function NativeEagleCompareDev({
  pinHeightVh = 400,
  referenceSrc = EAGLE_PROJECT_2_REFERENCE_SRC,
  /** When false, skip reference iframe (lighter remount / CI). */
  showReference = true,
  /** Locked timeline progress to match eagle-project-2 HERO_PROGRESS. */
  lockProgress = EAGLE_PROJECT_2_HERO_PROGRESS,
}) {
  /** True side-by-side columns — 50/50 by default */
  const [split, setSplit] = useState(50);
  const [remountKey, setRemountKey] = useState(0);
  const [nativeReady, setNativeReady] = useState(false);
  const [nativeError, setNativeError] = useState(null);
  const [mountCount, setMountCount] = useState(1);

  const onReady = useCallback(() => {
    setNativeReady(true);
    setNativeError(null);
  }, []);

  const onError = useCallback((err) => {
    setNativeReady(false);
    setNativeError(String(err?.message || err));
  }, []);

  const stageColumns = useMemo(
    () => ({ gridTemplateColumns: `${split}% ${100 - split}%` }),
    [split],
  );

  function remountNative() {
    setNativeReady(false);
    setNativeError(null);
    setRemountKey((k) => k + 1);
    setMountCount((c) => c + 1);
  }

  return (
    <div
      className="native-eagle-compare"
      data-mount-count={mountCount}
      data-reference="eagle-project-2"
      data-split={split}
      data-lock-progress={String(lockProgress)}
    >
      <header className="native-eagle-compare__toolbar">
        <div className="native-eagle-compare__title">
          <strong>Native Eagle Dev Compare — Phase 10</strong>
          <span>
            Left: eagle-project-2 · Right: native glass parity (progress @{lockProgress})
          </span>
        </div>
        <div className="native-eagle-compare__controls">
          <label className="native-eagle-compare__slider-label">
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
          <button type="button" onClick={remountNative} className="native-eagle-compare__btn">
            Remount native
          </button>
          <span className="native-eagle-compare__meta" data-testid="mount-count">
            mounts: {mountCount}
          </span>
          <span
            className="native-eagle-compare__meta"
            data-testid="native-status"
            data-ready={nativeReady ? "1" : "0"}
          >
            {nativeError ? `error: ${nativeError}` : nativeReady ? "native ready" : "native loading"}
          </span>
          <span className="native-eagle-compare__meta" data-testid="reference-src">
            {referenceSrc}
          </span>
        </div>
      </header>

      <div
        className="native-eagle-compare__stage native-eagle-compare__stage--eagle2"
        style={stageColumns}
      >
        <div className="native-eagle-compare__pane native-eagle-compare__pane--ref">
          {showReference ? (
            <iframe
              title="eagle-project-2 reference"
              src={referenceSrc}
              className="native-eagle-compare__iframe"
              allow="autoplay"
              data-testid="reference-iframe"
            />
          ) : (
            <div className="native-eagle-compare__iframe native-eagle-compare__iframe--placeholder">
              Reference iframe disabled
            </div>
          )}
          <span className="native-eagle-compare__badge">Reference · eagle-project-2</span>
        </div>

        <div
          className="native-eagle-compare__pane native-eagle-compare__pane--native"
          data-testid="native-pane"
        >
          <NativeEagleHero
            key={remountKey}
            fillParent
            pinHeightVh={pinHeightVh}
            showHud={false}
            lockProgress={lockProgress}
            background="eagle2Clear"
            hideMountains
            onReady={onReady}
            onError={onError}
          />
          <span className="native-eagle-compare__badge native-eagle-compare__badge--native">
            Native
          </span>
        </div>

        <div
          className="native-eagle-compare__divider"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

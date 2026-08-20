"use client";

/** Soft color dissolve at section edges into the continuous page bed (#162d24). */
export function IndustriesSeamFades({ top = true, bottom = true }) {
  return (
    <>
      {top ? <div className="ind-seam-fade ind-seam-fade--top" aria-hidden /> : null}
      {bottom ? <div className="ind-seam-fade ind-seam-fade--bottom" aria-hidden /> : null}
    </>
  );
}

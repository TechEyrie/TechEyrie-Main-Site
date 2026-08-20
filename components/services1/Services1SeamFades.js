"use client";

/** Soft color dissolve at section edges into the continuous page bed (#162d24). */
export function Services1SeamFades({ top = true, bottom = true }) {
  return (
    <>
      {top ? <div className="s1-seam-fade s1-seam-fade--top" aria-hidden /> : null}
      {bottom ? <div className="s1-seam-fade s1-seam-fade--bottom" aria-hidden /> : null}
    </>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const NativeEagleCompareDev = dynamic(
  () => import("../../../components/native-eagle/NativeEagleCompareDev"),
  { ssr: false },
);

function NativeEagleDevCompare() {
  const searchParams = useSearchParams();
  const showReference = searchParams.get("ref") !== "0";
  return <NativeEagleCompareDev pinHeightVh={100} showReference={showReference} />;
}

export default function NativeEagleDevClientPage() {
  return (
    <Suspense fallback={<div style={{ padding: "1rem" }}>Loading compare…</div>}>
      <NativeEagleDevCompare />
    </Suspense>
  );
}

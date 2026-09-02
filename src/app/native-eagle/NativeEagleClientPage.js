"use client";

import dynamic from "next/dynamic";

const NativeEagleHero = dynamic(
  () => import("../../../components/native-eagle/NativeEagleHero"),
  { ssr: false },
);

export default function NativeEagleClientPage() {
  return (
    <NativeEagleHero
      pinHeightVh={400}
      showHud
      hudTitle="Native Eagle — Phase 9"
      hudSubtitle="Reference lock: eagle-project-2 · full scroll demo"
    />
  );
}

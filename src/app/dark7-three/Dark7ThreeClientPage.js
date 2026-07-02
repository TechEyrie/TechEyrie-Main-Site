"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-three/MainPage"), {
  ssr: false,
});

export default function Dark7ThreeClientPage() {
  return <MainPage />;
}

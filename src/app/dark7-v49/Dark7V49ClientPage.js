"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v49/MainPage"), {
  ssr: false,
});

export default function Dark7V49ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v32/MainPage"), {
  ssr: false,
});

export default function Dark7V32ClientPage() {
  return <MainPage />;
}

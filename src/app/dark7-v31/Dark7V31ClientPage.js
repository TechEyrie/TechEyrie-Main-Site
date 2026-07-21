"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v31/MainPage"), {
  ssr: false,
});

export default function Dark7V31ClientPage() {
  return <MainPage />;
}

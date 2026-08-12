"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v43/MainPage"), {
  ssr: false,
});

export default function Dark7V43ClientPage() {
  return <MainPage />;
}

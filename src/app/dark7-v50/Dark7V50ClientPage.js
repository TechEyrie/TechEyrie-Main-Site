"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v50/MainPage"), {
  ssr: false,
});

export default function Dark7V50ClientPage() {
  return <MainPage />;
}

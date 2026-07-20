"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v19/MainPage"), {
  ssr: false,
});

export default function Dark7V19ClientPage() {
  return <MainPage />;
}

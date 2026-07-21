"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v25/MainPage"), {
  ssr: false,
});

export default function Dark7V25ClientPage() {
  return <MainPage />;
}

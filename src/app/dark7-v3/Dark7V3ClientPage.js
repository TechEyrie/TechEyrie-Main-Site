"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v3/MainPage"), {
  ssr: false,
});

export default function Dark7V3ClientPage() {
  return <MainPage />;
}

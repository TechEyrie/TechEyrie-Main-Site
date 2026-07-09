"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v5/MainPage"), {
  ssr: false,
});

export default function Dark7V5ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v58/MainPage"), {
  ssr: false,
});

export default function Dark7V58ClientPage() {
  return <MainPage />;
}

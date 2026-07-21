"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v21/MainPage"), {
  ssr: false,
});

export default function Dark7V21ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v23/MainPage"), {
  ssr: false,
});

export default function Dark7V23ClientPage() {
  return <MainPage />;
}

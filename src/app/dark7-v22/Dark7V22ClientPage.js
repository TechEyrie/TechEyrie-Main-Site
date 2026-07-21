"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v22/MainPage"), {
  ssr: false,
});

export default function Dark7V22ClientPage() {
  return <MainPage />;
}

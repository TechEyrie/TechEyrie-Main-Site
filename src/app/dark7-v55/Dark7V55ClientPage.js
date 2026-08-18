"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v55/MainPage"), {
  ssr: false,
});

export default function Dark7V55ClientPage() {
  return <MainPage />;
}

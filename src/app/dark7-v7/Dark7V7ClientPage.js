"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v7/MainPage"), {
  ssr: false,
});

export default function Dark7V7ClientPage() {
  return <MainPage />;
}

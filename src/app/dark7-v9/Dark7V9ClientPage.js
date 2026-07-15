"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v9/MainPage"), {
  ssr: false,
});

export default function Dark7V9ClientPage() {
  return <MainPage />;
}

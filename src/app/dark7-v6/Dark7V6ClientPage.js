"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v6/MainPage"), {
  ssr: false,
});

export default function Dark7V6ClientPage() {
  return <MainPage />;
}

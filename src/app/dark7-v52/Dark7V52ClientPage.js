"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v52/MainPage"), {
  ssr: false,
});

export default function Dark7V52ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v59/MainPage"), {
  ssr: false,
});

export default function Dark7V59ClientPage() {
  return <MainPage />;
}

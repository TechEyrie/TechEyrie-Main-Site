"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v53/MainPage"), {
  ssr: false,
});

export default function Dark7V53ClientPage() {
  return <MainPage />;
}

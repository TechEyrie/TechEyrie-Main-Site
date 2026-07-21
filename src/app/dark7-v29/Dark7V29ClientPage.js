"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v29/MainPage"), {
  ssr: false,
});

export default function Dark7V29ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v47/MainPage"), {
  ssr: false,
});

export default function Dark7V47ClientPage() {
  return <MainPage />;
}

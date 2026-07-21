"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v28/MainPage"), {
  ssr: false,
});

export default function Dark7V28ClientPage() {
  return <MainPage />;
}

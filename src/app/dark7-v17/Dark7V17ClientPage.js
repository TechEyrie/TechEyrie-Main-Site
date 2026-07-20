"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v17/MainPage"), {
  ssr: false,
});

export default function Dark7V17ClientPage() {
  return <MainPage />;
}

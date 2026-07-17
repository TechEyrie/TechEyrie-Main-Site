"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v12/MainPage"), {
  ssr: false,
});

export default function Dark7V12ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v56/MainPage"), {
  ssr: false,
});

export default function Dark7V56ClientPage() {
  return <MainPage />;
}

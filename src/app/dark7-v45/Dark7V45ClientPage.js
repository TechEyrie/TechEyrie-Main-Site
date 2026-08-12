"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v45/MainPage"), {
  ssr: false,
});

export default function Dark7V45ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v51/MainPage"), {
  ssr: false,
});

export default function Dark7V51ClientPage() {
  return <MainPage />;
}

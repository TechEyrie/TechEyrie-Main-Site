"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v44/MainPage"), {
  ssr: false,
});

export default function Dark7V44ClientPage() {
  return <MainPage />;
}

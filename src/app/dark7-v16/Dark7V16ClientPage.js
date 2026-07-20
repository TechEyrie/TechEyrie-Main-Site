"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v16/MainPage"), {
  ssr: false,
});

export default function Dark7V16ClientPage() {
  return <MainPage />;
}

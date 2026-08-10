"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v39/MainPage"), {
  ssr: false,
});

export default function Dark7V39ClientPage() {
  return <MainPage />;
}

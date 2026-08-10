"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v37/MainPage"), {
  ssr: false,
});

export default function Dark7V37ClientPage() {
  return <MainPage />;
}

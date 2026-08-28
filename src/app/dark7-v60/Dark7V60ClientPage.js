"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v60/MainPage"), {
  ssr: false,
});

export default function Dark7V60ClientPage() {
  return <MainPage />;
}

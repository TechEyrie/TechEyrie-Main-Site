"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v26/MainPage"), {
  ssr: false,
});

export default function Dark7V26ClientPage() {
  return <MainPage />;
}

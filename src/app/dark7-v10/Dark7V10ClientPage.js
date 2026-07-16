"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v10/MainPage"), {
  ssr: false,
});

export default function Dark7V10ClientPage() {
  return <MainPage />;
}

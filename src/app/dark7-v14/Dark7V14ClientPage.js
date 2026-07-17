"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v14/MainPage"), {
  ssr: false,
});

export default function Dark7V14ClientPage() {
  return <MainPage />;
}

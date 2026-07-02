"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-three4/MainPage"), {
  ssr: false,
});

export default function Dark7Three4ClientPage() {
  return <MainPage />;
}

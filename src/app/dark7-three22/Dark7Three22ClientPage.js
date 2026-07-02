"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-three22/MainPage"), {
  ssr: false,
});

export default function Dark7Three22ClientPage() {
  return <MainPage />;
}

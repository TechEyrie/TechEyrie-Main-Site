"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-three3/MainPage"), {
  ssr: false,
});

export default function Dark7Three3ClientPage() {
  return <MainPage />;
}

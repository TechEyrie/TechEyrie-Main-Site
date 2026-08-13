"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v48/MainPage"), {
  ssr: false,
});

export default function Dark7V48ClientPage() {
  return <MainPage />;
}

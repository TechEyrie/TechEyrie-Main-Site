"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v24/MainPage"), {
  ssr: false,
});

export default function Dark7V24ClientPage() {
  return <MainPage />;
}

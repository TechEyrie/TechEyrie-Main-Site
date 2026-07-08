"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v4/MainPage"), {
  ssr: false,
});

export default function Dark7V4ClientPage() {
  return <MainPage />;
}

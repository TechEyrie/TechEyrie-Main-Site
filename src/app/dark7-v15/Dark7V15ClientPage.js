"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v15/MainPage"), {
  ssr: false,
});

export default function Dark7V15ClientPage() {
  return <MainPage />;
}

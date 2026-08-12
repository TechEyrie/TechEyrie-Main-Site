"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v42/MainPage"), {
  ssr: false,
});

export default function Dark7V42ClientPage() {
  return <MainPage />;
}

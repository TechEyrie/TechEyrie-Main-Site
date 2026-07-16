"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v11/MainPage"), {
  ssr: false,
});

export default function Dark7V11ClientPage() {
  return <MainPage />;
}

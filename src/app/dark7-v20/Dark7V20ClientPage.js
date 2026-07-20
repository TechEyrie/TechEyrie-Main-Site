"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v20/MainPage"), {
  ssr: false,
});

export default function Dark7V20ClientPage() {
  return <MainPage />;
}

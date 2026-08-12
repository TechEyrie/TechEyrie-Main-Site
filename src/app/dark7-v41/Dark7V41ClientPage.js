"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v41/MainPage"), {
  ssr: false,
});

export default function Dark7V41ClientPage() {
  return <MainPage />;
}

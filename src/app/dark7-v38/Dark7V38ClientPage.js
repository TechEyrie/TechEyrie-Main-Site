"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v38/MainPage"), {
  ssr: false,
});

export default function Dark7V38ClientPage() {
  return <MainPage />;
}

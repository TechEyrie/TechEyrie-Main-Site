"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v13/MainPage"), {
  ssr: false,
});

export default function Dark7V13ClientPage() {
  return <MainPage />;
}

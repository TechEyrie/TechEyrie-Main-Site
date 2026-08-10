"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v36/MainPage"), {
  ssr: false,
});

export default function Dark7V36ClientPage() {
  return <MainPage />;
}

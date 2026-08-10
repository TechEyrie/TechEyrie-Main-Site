"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v40/MainPage"), {
  ssr: false,
});

export default function Dark7V40ClientPage() {
  return <MainPage />;
}

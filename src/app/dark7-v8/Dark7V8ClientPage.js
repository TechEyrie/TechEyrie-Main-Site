"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v8/MainPage"), {
  ssr: false,
});

export default function Dark7V8ClientPage() {
  return <MainPage />;
}

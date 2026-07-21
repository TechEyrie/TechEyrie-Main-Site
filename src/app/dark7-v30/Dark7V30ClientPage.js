"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v30/MainPage"), {
  ssr: false,
});

export default function Dark7V30ClientPage() {
  return <MainPage />;
}

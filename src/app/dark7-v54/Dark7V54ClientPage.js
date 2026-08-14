"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v54/MainPage"), {
  ssr: false,
});

export default function Dark7V54ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v35/MainPage"), {
  ssr: false,
});

export default function Dark7V35ClientPage() {
  return <MainPage />;
}

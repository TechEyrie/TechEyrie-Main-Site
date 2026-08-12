"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v46/MainPage"), {
  ssr: false,
});

export default function Dark7V46ClientPage() {
  return <MainPage />;
}

"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-v2/MainPage"), {
  ssr: false,
});

export default function Dark7V2ClientPage() {
  return <MainPage />;
}

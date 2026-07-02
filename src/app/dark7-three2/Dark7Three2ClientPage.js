"use client";

import dynamic from "next/dynamic";

const MainPage = dynamic(() => import("../../../components/dark7-three2/MainPage"), {
  ssr: false,
});

export default function Dark7Three2ClientPage() {
  return <MainPage />;
}

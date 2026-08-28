"use client";

import dynamic from "next/dynamic";

const EagleProject4Hero = dynamic(
  () => import("../../../components/eagle-project-4/EagleProject4Hero"),
  { ssr: false },
);

export default function EagleProject4ClientPage() {
  return <EagleProject4Hero />;
}

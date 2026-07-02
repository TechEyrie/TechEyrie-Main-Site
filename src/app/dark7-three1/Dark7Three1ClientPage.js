"use client";

import { useLayoutEffect } from "react";
import EagleScrollScene from "../../../components/dark7-three1/EagleScrollScene";

export default function Dark7Three1ClientPage() {
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.scrollBehavior = "";
      document.body.style.margin = "";
      document.body.style.overflowX = "";
    };
  }, []);

  return <EagleScrollScene />;
}

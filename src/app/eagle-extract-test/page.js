import EagleExtractTestClient from "../../../components/eagle-extract-test/EagleExtractTestClient.js";

export const metadata = {
  title: "Eagle Extract — Validation Test",
  description: "Validate eagle-extract package loads in Next.js and renders WebGL glass eagle",
};

export default function EagleExtractTestPage() {
  return <EagleExtractTestClient />;
}

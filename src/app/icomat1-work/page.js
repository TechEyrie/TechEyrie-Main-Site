import Header from "../../../components/icomat1/Header";
import FooterSection from "../../../components/icomat1/FooterSection";
import WorkSection from "../../../components/icomat1-work/FeaturedProjectsSection";
import CTASection from "../../../components/icomat1/CTASection";

export default function Icomat1WorkPage() {
  return (
    <div
      data-theme="dark"
      className="icomat1-laygrotesk"
      style={{ width: "100%", minHeight: "100vh", background: "#f5f2ec" }}
    >
      <Header />
      <WorkSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}


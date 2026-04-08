import Home1CTA from "../../../components/home1/Home1CTA";
import Home1CTA2 from "../../../components/home1/Home1CTA2";
import Home1Discuss from "../../../components/home1/Home1Discuss";
import EagleHeadReveal from "../../../components/home1/Home1Eagle2SVG";
import DivingEagleReveal from "../../../components/home1/Home1Eagle3SVG";
import EagleReveal from "../../../components/home1/Home1EagleSVG";
import Home1Footer from "../../../components/home1/Home1Footer";
import Home1Hero from "../../../components/home1/Home1Hero";
import Home1HowWeWork from "../../../components/home1/Home1HowWeWork";
import Home1Pricing from "../../../components/home1/Home1Pricing";
import Home1RecentProjects from "../../../components/home1/Home1RecentProjects";
import Home1Services from "../../../components/home1/Home1Services";
import Home1SliderScroll from "../../../components/home1/Home1SliderScroll";
import CursorRevealStar from "../../../components/home1/Home1StarAnimation";
import Home1ThingMightAsk from "../../../components/home1/Home1ThingMightAsk";
import Home1TwoText from "../../../components/home1/Home1TwoText";

export default function Home1Page() {
  return (
    <div className="home1-page relative min-h-screen bg-[#162d24] text-[#e0d1b6] antialiased">
      <Home1Hero />
      <Home1TwoText />
      <Home1Services />
      <Home1RecentProjects />
      <Home1Discuss />
      <Home1HowWeWork />
      <Home1SliderScroll />
      <Home1CTA />
      <Home1Pricing />
      <Home1ThingMightAsk />
      <Home1CTA2 />
      <Home1Footer />
      <CursorRevealStar />
      <EagleReveal />
      <EagleHeadReveal />
      <DivingEagleReveal />
    </div>
  );
}

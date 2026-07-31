import Hero from "@/components/sections/Hero";
import Vision from "@/components/sections/Vision";
import Features from "@/components/sections/Features";
import ProductPreview from "@/components/sections/ProductPreview";
import Benefits from "@/components/sections/Benefits";
import TeamMembers from "@/components/sections/TeamMembers";
// import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import BlurReveal from "@/components/sections/BlurReveal";

export default function Home() {
  return (
    <>
      <Hero />
      <BlurReveal><Vision /></BlurReveal>
      <BlurReveal><Features /></BlurReveal>
      <BlurReveal><ProductPreview /></BlurReveal>
      <BlurReveal><Benefits /></BlurReveal>
      <BlurReveal><TeamMembers /></BlurReveal>
      <BlurReveal><Pricing /></BlurReveal>
      <BlurReveal><FAQ /></BlurReveal>
      <BlurReveal><FinalCTA /></BlurReveal>
    </>
  );
}

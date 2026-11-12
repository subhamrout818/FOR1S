import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Vision from "@/components/sections/Vision";
import Features from "@/components/sections/Features";
import ProductPreview from "@/components/sections/ProductPreview";
import TeamMembers from "@/components/sections/TeamMembers";
import Work from "@/components/sections/Work";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Vision />
      <Features />
      <ProductPreview />
      <Work />
      <TeamMembers />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

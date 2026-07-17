import Hero from "@/components/sections/Hero";
import Vision from "@/components/sections/Vision";
import Features from "@/components/sections/Features";
import ProductPreview from "@/components/sections/ProductPreview";
import Benefits from "@/components/sections/Benefits";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Vision />
      <Features />
      <ProductPreview />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </>
  );
}

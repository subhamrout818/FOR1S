import Container from "@/components/ui/Container";

import HeroHeading from "./HeroHeading";
import HeroSubtitle from "./HeroSubtitle";
import HeroCTA from "./HeroCTA";

export default function HeroContent() {
  return (
    <Container>
      <div
        className="
          inline-flex
          min-h-screen
          flex-col
          justify-center
          gap-8
        "
      >
        <HeroHeading />
        <HeroSubtitle />
        <HeroCTA />
      </div>
    </Container>
  );
}
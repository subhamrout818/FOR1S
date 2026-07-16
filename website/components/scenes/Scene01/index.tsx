import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import Herovisual from "./Herovisual";
import ScrollIndicator from "./ScrollIndicator";

export default function Scene01() {
  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
      "
    >
      <HeroBackground />
      <HeroContent />
      <Herovisual />
      <ScrollIndicator />
    </section>
  );
}
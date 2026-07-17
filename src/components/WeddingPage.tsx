import { CastleGateTransition } from "./CastleGateTransition";
import { FinalMessage } from "./FinalMessage";
import { FloatingAudioPlayer } from "./FloatingAudioPlayer";
import { GuestThanks } from "./GuestThanks";
import { HeroSection } from "./HeroSection";
import { SinceWeddingCounter } from "./SinceWeddingCounter";
import { WeddingGallery } from "./WeddingGallery";
import { WeddingMonogram } from "./WeddingMonogram";
import { WitnessThanks } from "./WitnessThanks";
import { wedding } from "@/content/wedding";

export function WeddingPage() {
  return (
    <>
      <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
      <main id="main-content">
        <HeroSection />
        <CastleGateTransition />
        <SinceWeddingCounter />
        <WeddingGallery />
        <WitnessThanks />
        <GuestThanks />
        <FinalMessage />
      </main>
      <footer className="site-footer">
        <WeddingMonogram compact />
        <p>{wedding.couple.displayName}</p>
        <time dateTime={wedding.wedding.dateTime}>{wedding.wedding.dateNumeric}</time>
        <span>{wedding.wedding.location}</span>
      </footer>
      <FloatingAudioPlayer />
    </>
  );
}

import Image from "next/image";
import { wedding } from "@/content/wedding";
import { WeddingMonogram } from "./WeddingMonogram";

export function FinalMessage() {
  return (
    <section className="final-message" id="unser-fuer-immer" aria-labelledby="final-title">
      <Image
        className="final-message__image"
        src={wedding.final.image.src}
        alt={wedding.final.image.alt}
        fill
        sizes="100vw"
        quality={90}
        preload
        style={{ objectPosition: wedding.final.image.focalPoint }}
      />
      <div className="final-message__overlay" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
      <div className="final-message__copy">
        <WeddingMonogram />
        <p className="final-message__lead">{wedding.final.lead}</p>
        <h2 id="final-title">{wedding.final.quote.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
        <p className="final-message__signature">
          {wedding.final.signature.split("\n").map((line) => <span key={line}>{line}</span>)}
        </p>
        <time dateTime={wedding.wedding.dateTime}>{wedding.final.date}</time>
      </div>
    </section>
  );
}

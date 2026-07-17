import Image from "next/image";
import { WeddingMonogram } from "./WeddingMonogram";
import { wedding } from "@/content/wedding";

export function HeroSection() {
  const { hero, wedding: date, couple } = wedding;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <Image
        className="hero__image"
        src={hero.image.src}
        alt={hero.image.alt}
        fill
        priority
        quality={92}
        sizes="100vw"
        style={{ objectPosition: hero.image.focalPoint }}
      />
      <div className="hero__wash" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />

      <div className="hero__topline">
        <WeddingMonogram compact />
        <span>{date.dateNumeric}</span>
      </div>

      <div className="hero__content">
        <p className="hero__eyebrow">{couple.monogram}</p>
        <h1 id="hero-title">{hero.title}</h1>
        <p className="hero__subtitle">{hero.subtitle}</p>
        <span className="hero__line" aria-hidden="true" />
        <p className="hero__meta">
          <time dateTime={date.dateTime}>{date.dateLabel}</time>
          <span aria-hidden="true">·</span>
          {date.location}
        </p>
        <p className="hero__memory">{hero.memory}</p>
      </div>

      <a className="hero__scroll" href="#schlosstor">
        <span>Erinnerungen entdecken</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}

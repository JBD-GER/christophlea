import Image from "next/image";
import { wedding } from "@/content/wedding";
import { SectionHeading } from "./SectionHeading";

export function WitnessThanks() {
  return (
    <section className="witnesses" id="trauzeugen" aria-labelledby="witnesses-title">
      <div className="page-shell">
        <SectionHeading eyebrow={wedding.witnesses.eyebrow} title={wedding.witnesses.title} id="witnesses-title" />
        <p className="witnesses__intro">{wedding.witnesses.intro}</p>

        <div className="witness-grid">
          {wedding.witnesses.people.map((person, index) => (
            <article className={`witness-card witness-card--${index + 1}`} key={person.name}>
              <div className="witness-card__image">
                <Image
                  src={person.image.src}
                  alt={person.image.alt}
                  fill
                  sizes="(max-width: 780px) 92vw, 45vw"
                  quality={92}
                  style={{ objectPosition: person.image.focalPoint }}
                />
                <span className="witness-card__number" aria-hidden="true">0{index + 1}</span>
              </div>
              <div className="witness-card__copy">
                <p className="witness-card__role">{person.role}</p>
                <h3>{person.name}</h3>
                <span className="witness-card__rule" aria-hidden="true" />
                <p className="witness-card__salutation">{person.salutation}</p>
                {person.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>
          ))}
        </div>

        <div className="witnesses__closing">
          <p>{wedding.witnesses.closing}</p>
          <strong>{wedding.witnesses.signature}</strong>
        </div>
      </div>
    </section>
  );
}
